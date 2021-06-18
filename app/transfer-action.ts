import {
  ConnectionDataStatusEnum,
  CopyDataInterface, RemoveDataInterface,
  TransferActionEnum,
  TransferDataInterface
} from "./model";
const {ipcMain} = require('electron');
const mongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID;
export class TransferAction {

  constructor() {
    this.events();
  }

  private events(): void {

    // checkConnection
    ipcMain.on(TransferActionEnum.checkConnection, (event, data: TransferDataInterface) => {

      mongoClient
        .connect(data.url)
        .then(dbc => {
          event.reply(TransferActionEnum.checkConnection, {
            ...data,
            status: ConnectionDataStatusEnum.online
          });
        })
        .catch(err => {
          event.reply(TransferActionEnum.checkConnection, {
            ...data,
            status: ConnectionDataStatusEnum.offline
          });
        });

    });

    // load
    ipcMain.on(TransferActionEnum.load, (event, data: TransferDataInterface) => {

      mongoClient.connect(data.url, (err, client) => {
        try {
          const db = client.db(data.database);
          db.collection(data.collection)
            .find({})
            .toArray((err, result) => {
              client.close();
              if (err) {
                event.reply(TransferActionEnum.load, {
                  ...data,
                  status: ConnectionDataStatusEnum.offline,
                  data: []
                });
              } else {
                result = result.map( e => {return {...e, _id: e._id.toString()};});
                event.reply(TransferActionEnum.load, {
                  ...data,
                  status: ConnectionDataStatusEnum.online,
                  data: result
                });
              }
            });
        } catch(e) {
          event.reply(TransferActionEnum.load, {
            ...data,
            status: ConnectionDataStatusEnum.offline,
            data: []
          });
        }
      });

    });

    // copy
    ipcMain.on(TransferActionEnum.copy, (event, data: CopyDataInterface) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const id = data.data._id;
      mongoClient.connect(data.to.url, (err, client) => {
        const db = client.db(data.to.database);
        db.collection(data.to.collection).insert({
          ...data.data,
          _id: new ObjectID(id)
        }).catch(e => console.log(e));
        event.reply(TransferActionEnum.copy, {...data});
        client.close();
      });
    });

    // remove
    ipcMain.on(TransferActionEnum.remove, (event, data: RemoveDataInterface) => {
      mongoClient.connect(data.url, (err, client) => {
        const db = client.db(data.database);
        db.collection(data.collection).deleteOne({_id: new ObjectID(data.id)});
        event.reply(TransferActionEnum.remove, {...data});
        client.close();
      });

    });

  }

}

