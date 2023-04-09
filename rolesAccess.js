const AccessControl = require("accesscontrol");
const ac = new AccessControl();
ac.grant("user") // define new or modify existing role. also takes an array.
    .createOwn("video") // equivalent to .createOwn('video', ['*'])
    .deleteOwn("video")
    .readAny("video")
    .grant("admin") // switch to another role without breaking the chain
    .extend("user") // inherit role capabilities. also takes an array
    .updateAny("video", ["title"]) // explicitly defined attributes
    .deleteAny("video");
ac.grant("test");
// const permission = ac.can("user").createOwn("video");
// console.log(permission.granted); // —> true
// console.log(permission.attributes); // —> ['*'] (all attributes)

permission = ac.can("test").updateAny("video");
console.log(permission.granted); // —> true
console.log(permission.attributes); // —> ['title']
