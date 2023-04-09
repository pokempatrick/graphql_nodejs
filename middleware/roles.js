const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
    ac.grant("labor")
        .readAny("manufacturer")
        .readAny("store_entrance")
        .readAny("third_party")
        .readAny("diagnostic")
        .readAny("downgrading")
        .readAny("repair")
        .createAny("store_entrance")
        .createAny("diagnostic")
        .createAny("downgrading")
        .createAny("repair")
        .updateOwn("user");

    ac.grant("technician").extend("labor").createAny("third_party");

    ac.grant("manager")
        .extend("technician")
        .createAny("manufacturer")
        .updateAny("manufacturer")
        .updateAny("transformer")
        .updateAny("store_entrance")
        .updateAny("third_party")
        .updateAny("diagnostic")
        .updateAny("downgrading")
        .updateAny("user_role")
        .updateAny("repair");

    ac.grant("admin")
        .extend("manager")
        .createAny("user")
        .createAny("transformer")
        .readAny("user")
        .updateAny("user")
        .deleteAny("user");

    ac.grant("superAdmin").extend("admin").readAny("profile");

    return ac;
})();
