import {Injectable} from '@angular/core';
import {StoreService} from "../store/store.service";
import {ElectronService} from "../../../core/services";
import {ConnectionDataInterface, ConnectionNameEnum} from "../../model";
import {combineAll, filter, map} from "rxjs/operators";
import {combineLatest} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  allKeys$ = combineLatest(this.storeService.connection1, this.storeService.connection2)
    .pipe(
      map(([c1, c2]) => {
        const result: {
          allKeys: Set<string>,
          connection1Keys: Set<string>,
          connection2Keys: Set<string>,
        } = {
          allKeys: new Set(),
          connection1Keys: new Set(),
          connection2Keys: new Set(),
        };

        if (c1 && c1.data) {
          c1.data.forEach(line => {
            Object.keys(line).forEach((key) => {
              result.allKeys.add(key);
              result.connection1Keys.add(key);
            });
          });
        }
        if (c2 && c2.data) {
          c2.data.forEach(line => {
            Object.keys(line).forEach((key) => {
              result.allKeys.add(key);
              result.connection2Keys.add(key);
            });
          });
        }
        return result;
      })
    ).subscribe( (result) => {
      this.storeService.allKeys$.next(result.allKeys);
      this.storeService.connection1Keys$.next(result.connection1Keys);
      this.storeService.connection2Keys$.next(result.connection2Keys);
    });

  checkConnection$ = this.electronService.checkConnection$
    .subscribe((answer: ConnectionDataInterface) => {
      if (answer.name === 'connection1') {
        this.storeService.connection1.next({
          ...this.storeService.connection1.getValue(),
          status: answer.status
        });
      } else {
        this.storeService.connection2.next({
          ...this.storeService.connection2.getValue(),
          status: answer.status
        });
      }
    });

  loadConnection$ = this.electronService.loadConnection$
    .subscribe((answer: ConnectionDataInterface) => {
      if (answer.name === 'connection1') {
        this.storeService.connection1.next({
          ...this.storeService.connection1.getValue(),
          status: answer.status,
          data: answer.data
        });
      } else {
        this.storeService.connection2.next({
          ...this.storeService.connection2.getValue(),
          status: answer.status,
          data: answer.data
        });
      }
    });

  constructor(
    public storeService: StoreService,
    private electronService: ElectronService
  ) {
  }

  check(connection: 'connection1' | 'connection2'): void {
    let connectionData;
    if (connection === 'connection1') {
      connectionData = this.storeService.connection1.getValue();
    } else {
      connectionData = this.storeService.connection2.getValue();
    }
    this.electronService.checkConnection(connectionData);
  }

  load(connection: ConnectionNameEnum): void {
    let connectionData;
    if (connection === ConnectionNameEnum.connection1) {
      connectionData = this.storeService.connection1.getValue();
    } else {
      connectionData = this.storeService.connection2.getValue();
    }
    this.electronService.load(connectionData, connection);
  }

}
