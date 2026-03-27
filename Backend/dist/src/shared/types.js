import {} from "express";
export var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["Success"] = 200] = "Success";
    StatusCode[StatusCode["InputError"] = 411] = "InputError";
    StatusCode[StatusCode["DocumentExists"] = 403] = "DocumentExists";
    StatusCode[StatusCode["ServerError"] = 500] = "ServerError";
    StatusCode[StatusCode["NotFound"] = 404] = "NotFound";
    StatusCode[StatusCode["Unauthorized"] = 401] = "Unauthorized";
})(StatusCode || (StatusCode = {}));
;
//# sourceMappingURL=types.js.map