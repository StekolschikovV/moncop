"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferAction = void 0;
var model_1 = require("./model");
var ipcMain = require('electron').ipcMain;
var mongoClient = require('mongodb').MongoClient;
var ObjectID = require("mongodb").ObjectID;
var TransferAction = /** @class */ (function () {
    function TransferAction() {
        this.events();
    }
    TransferAction.prototype.events = function () {
        // checkConnection
        ipcMain.on(model_1.TransferActionEnum.checkConnection, function (event, data) {
            mongoClient
                .connect(data.url)
                .then(function (dbc) {
                event.reply(model_1.TransferActionEnum.checkConnection, __assign(__assign({}, data), { status: model_1.ConnectionDataStatusEnum.online }));
            })
                .catch(function (err) {
                event.reply(model_1.TransferActionEnum.checkConnection, __assign(__assign({}, data), { status: model_1.ConnectionDataStatusEnum.offline }));
            });
        });
        // load
        ipcMain.on(model_1.TransferActionEnum.load, function (event, data) {
            mongoClient.connect(data.url, function (err, client) {
                try {
                    var db = client.db(data.database);
                    db.collection(data.collection)
                        .find({})
                        .toArray(function (err, result) {
                        client.close();
                        if (err) {
                            event.reply(model_1.TransferActionEnum.load, __assign(__assign({}, data), { status: model_1.ConnectionDataStatusEnum.offline, data: [] }));
                        }
                        else {
                            result = result.map(function (e) { return __assign(__assign({}, e), { _id: e._id.toString() }); });
                            event.reply(model_1.TransferActionEnum.load, __assign(__assign({}, data), { status: model_1.ConnectionDataStatusEnum.online, data: result }));
                        }
                    });
                }
                catch (e) {
                    event.reply(model_1.TransferActionEnum.load, __assign(__assign({}, data), { status: model_1.ConnectionDataStatusEnum.offline, data: [] }));
                }
            });
        });
        // copy
        ipcMain.on(model_1.TransferActionEnum.copy, function (event, data) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            var id = data.data._id;
            mongoClient.connect(data.to.url, function (err, client) {
                var db = client.db(data.to.database);
                db.collection(data.to.collection).insert(__assign(__assign({}, data.data), { _id: new ObjectID(id) })).catch(function (e) { return console.log(e); });
                event.reply(model_1.TransferActionEnum.copy, __assign({}, data));
                client.close();
            });
        });
        // remove
        ipcMain.on(model_1.TransferActionEnum.remove, function (event, data) {
            mongoClient.connect(data.url, function (err, client) {
                var db = client.db(data.database);
                db.collection(data.collection).deleteOne({ _id: new ObjectID(data.id) });
                event.reply(model_1.TransferActionEnum.remove, __assign({}, data));
                client.close();
            });
        });
    };
    return TransferAction;
}());
exports.TransferAction = TransferAction;
//# sourceMappingURL=transfer-action.js.map