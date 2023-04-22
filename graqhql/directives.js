const { mapSchema, MapperKind, getDirective } = require("@graphql-tools/utils");
const { defaultFieldResolver } = require("graphql");

exports.authDirective = (directiveName, getUserFn) => {
    const typeDirectiveArgumentMaps = {};
    return {
        authDirectiveTypeDefs: `directive @${directiveName}(
        requires: Role = admin,
      ) on OBJECT | FIELD_DEFINITION
   
      enum Role {
        admin
        owner
        manager
        accountant
        technician
      }`,
        authDirectiveTransformer: (schema) =>
            mapSchema(schema, {
                [MapperKind.TYPE]: (type) => {
                    const authDirective = getDirective(
                        schema,
                        type,
                        directiveName
                    )?.[0];
                    if (authDirective) {
                        typeDirectiveArgumentMaps[type.name] = authDirective;
                    }
                    return undefined;
                },
                [MapperKind.OBJECT_FIELD]: (
                    fieldConfig,
                    _fieldName,
                    typeName
                ) => {
                    const authDirective =
                        getDirective(schema, fieldConfig, directiveName)?.[0] ??
                        typeDirectiveArgumentMaps[typeName];
                    if (authDirective) {
                        const { requires } = authDirective;
                        if (requires) {
                            const { resolve = defaultFieldResolver } =
                                fieldConfig;
                            fieldConfig.resolve = function (
                                source,
                                args,
                                context,
                                info
                            ) {
                                const user = getUserFn(context);
                                if (!user.hasRole(requires)) {
                                    throw new Error("not authorized");
                                }
                                return resolve(source, args, context, info);
                            };
                            return fieldConfig;
                        }
                    }
                },
            }),
    };
};

const isGrantedLimitedAccess = (req) => {
    try {
        return (
            new Date(req.user.limitedAccessDate) > new Date() ||
            req?.user?.role.includes("admin")
        );
    } catch (error) {
        throw new Error("Internal error");
    }
};

// change roles according the actual situation
const isGrantedRole = (userRole, requireRole) => {
    let auth = {};
    auth["admin"] = ["admin"];
    auth["owner"] = [...auth["admin"], "owner"];
    auth["manager"] = [...auth["owner"], "manager"];
    auth["accountant"] = [...auth["manager"], "accountant"];
    auth["technician"] = ["technician"];
    if (userRole !== undefined) {
        return auth[requireRole].reduce(
            (result, item) => result || userRole.includes(item),
            false
        );
    }
    return false;
};

exports.getUser = (req) => {
    const ownRole = req?.user?.role;
    return {
        hasRole: (requestedRole) => {
            return (
                isGrantedLimitedAccess(req) &&
                isGrantedRole(ownRole, requestedRole)
            );
        },
    };
};
