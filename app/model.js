"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineStatusEnum = exports.TransferActionEnum = exports.ConnectionNameEnum = exports.ConnectionDataStatusEnum = void 0;
var ConnectionDataStatusEnum;
(function (ConnectionDataStatusEnum) {
    ConnectionDataStatusEnum["online"] = "online";
    ConnectionDataStatusEnum["offline"] = "offline";
    ConnectionDataStatusEnum["notChecked"] = "not-\u0441hecked";
})(ConnectionDataStatusEnum = exports.ConnectionDataStatusEnum || (exports.ConnectionDataStatusEnum = {}));
var ConnectionNameEnum;
(function (ConnectionNameEnum) {
    ConnectionNameEnum["connection1"] = "connection1";
    ConnectionNameEnum["connection2"] = "connection2";
})(ConnectionNameEnum = exports.ConnectionNameEnum || (exports.ConnectionNameEnum = {}));
var TransferActionEnum;
(function (TransferActionEnum) {
    TransferActionEnum["checkConnection"] = "check-connection";
    TransferActionEnum["load"] = "load";
    TransferActionEnum["copy"] = "copy";
    TransferActionEnum["remove"] = "remove";
})(TransferActionEnum = exports.TransferActionEnum || (exports.TransferActionEnum = {}));
var LineStatusEnum;
(function (LineStatusEnum) {
    LineStatusEnum["notMatch"] = "not-match";
    LineStatusEnum["notMatchWithoutPrimeKey"] = "not-match-without-prime-key";
})(LineStatusEnum = exports.LineStatusEnum || (exports.LineStatusEnum = {}));
//# sourceMappingURL=model.js.map