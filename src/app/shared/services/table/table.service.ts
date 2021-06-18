import {Injectable} from '@angular/core';
import {
  ConnectionNameEnum,
  CopyDataInterface,
  DataInterface,
  LineStatusEnum,
  RemoveDataInterface,
  TransferDataInterface
} from "../../model";
import {ElectronService} from "../../../core/services";
import {StoreService} from "../store/store.service";

@Injectable({
  providedIn: 'root'
})
export class TableService {


  constructor(
    private electronService: ElectronService,
    private storeService: StoreService
  ) {
  }

  notMatch(line, data: []): boolean {

    let result = false;
    const lineJsonString = JSON.stringify(this.removePropertyStartingWithUnderscore(line));

    data.forEach(dataLine => {

      const dataLineJsonString = JSON.stringify(this.removePropertyStartingWithUnderscore(dataLine));

      if (lineJsonString === dataLineJsonString) {
        result = true;
      }

    });

    return result;

  }

  notMatchWithoutPrimeKey(line, data: [], primeKey: string): boolean {

    let result = false;
    let lineClone = Object.assign({}, this.removePropertyStartingWithUnderscore(line));
    lineClone = this.removeProperty(lineClone, primeKey);
    const lineJsonString = JSON.stringify(lineClone);

    data.forEach(dataLine => {

      const dataLineClone = Object.assign({}, this.removePropertyStartingWithUnderscore(dataLine));
      const dataLineJsonString = JSON.stringify(this.removeProperty(dataLineClone, primeKey));

      if (lineJsonString === dataLineJsonString) {
        result = true;
      }

    });

    return result;

  }


  removeKeysStartingWithUnderscore(value: Set<string>): Set<string> {

    const result: Set<string> = new Set<string>();

    value.forEach(key => {
      if (!key.startsWith("_")) {
        result.add(key);
      }
    });

    return result;

  }

  removePropertyStartingWithUnderscore(value: { [kay: string]: string }): { [kay: string]: string } {

    const clone = Object.assign({}, value);

    const keysStartWithUnderscore = Object.keys(clone).filter(e => e.startsWith("_"));

    keysStartWithUnderscore.forEach(key => {
      delete clone[key];
    });

    return clone;
    // return value;

  }

  removeProperty(value: { [kay: string]: string }, key: string) {

    delete value[key];

    return value;

  }

  copy(connection: ConnectionNameEnum, line: number) {

    let connectionData;
    let to: TransferDataInterface | null = null;
    if (connection === ConnectionNameEnum.connection1) {
      to = this.storeService.connection2.getValue();
      connectionData = this.storeService.connection1.getValue();
    } else {
      to = this.storeService.connection1.getValue();
      connectionData = this.storeService.connection2.getValue();
    }

    let lineData: DataInterface | null = null;

    if (connection === ConnectionNameEnum.connection1) {
      lineData = this.storeService.connection1.getValue().data[line];
    } else {
      lineData = this.storeService.connection2.getValue().data[line];
    }

    const data: CopyDataInterface = {
      ...connectionData,
      data: lineData,
      to
    };

    this.electronService.copy(data);

  }

  remove(connection: ConnectionNameEnum, line: number) {

    let id: string;
    let connectionData;
    if (connection === ConnectionNameEnum.connection1) {
      id = this.storeService.connection1.getValue().data[line]?._id;
      connectionData = this.storeService.connection1.getValue();
    } else {
      id = this.storeService.connection2.getValue().data[line]?._id;
      connectionData = this.storeService.connection2.getValue();
    }

    const data: RemoveDataInterface = {
      ...connectionData,
      id
    };

    this.electronService.remove(data);

  }
}
