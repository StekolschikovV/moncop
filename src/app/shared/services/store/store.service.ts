import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ConnectionDataInterface, ConnectionDataStatusEnum, ConnectionNameEnum} from "../../model";
import {filter, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  primeKey$: BehaviorSubject<null | string> = new BehaviorSubject(null);

  allKeys$: BehaviorSubject<Set<string>> = new BehaviorSubject(new Set());

  connection1Keys$: BehaviorSubject<Set<string>> = new BehaviorSubject(new Set());
  connection2Keys$: BehaviorSubject<Set<string>> = new BehaviorSubject(new Set());

  connection1: BehaviorSubject<ConnectionDataInterface> = new BehaviorSubject({
    name: ConnectionNameEnum.connection1,
    url: "",
    database: "",
    collection: "",
    status: ConnectionDataStatusEnum.notChecked
  });

  connection2: BehaviorSubject<ConnectionDataInterface> = new BehaviorSubject({
    name:  ConnectionNameEnum.connection2,
    url: "",
    database: "",
    collection: "",
    status: ConnectionDataStatusEnum.notChecked
  });

}
