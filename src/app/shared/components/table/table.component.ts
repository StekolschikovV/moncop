import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {StoreService} from "../../services/store/store.service";
import {ConnectionNameEnum, DataInterface, LineStatusEnum, TableLineInterface} from "../../model";
import {TableService} from "../../services/table/table.service";
import {combineLatest} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  connectionNameEnum = ConnectionNameEnum;
  connection1Keys: Set<string> = new Set<string>();
  connection2Keys: Set<string> = new Set<string>();
  connection1Data = [];
  connection2Data = [];

  constructor(
    public storeService: StoreService,
    private changeDetectorRef: ChangeDetectorRef,
    private tableService: TableService
  ) {
  }

  ngOnInit(): void {

    this.storeService.connection1Keys$.subscribe((keys: Set<string>) => {
      this.connection1Keys = this.tableService.removeKeysStartingWithUnderscore(keys);
      this.changeDetectorRef.detectChanges();
    });

    this.storeService.connection2Keys$.subscribe(keys => {
      this.connection2Keys = this.tableService.removeKeysStartingWithUnderscore(keys);
      this.changeDetectorRef.detectChanges();
    });

    combineLatest([
      this.storeService.primeKey$,
      this.storeService.connection1,
      this.storeService.connection2
    ])
      .pipe(
        map(([primeKey, c1, c2]) => {

          const genList = (c, secondConnection) => {
            const data = [];
            if (c && c.data) {
              c.data.forEach(line => {
                const lineArray: TableLineInterface[] = [];

                line = this.tableService.removePropertyStartingWithUnderscore(line);

                Object.keys(line).forEach((key) => {

                  let status = '';

                  if (secondConnection && secondConnection.data) {

                    // not-match
                    const notMatch = this.tableService.notMatch(line, secondConnection.data);
                    if (notMatch) {
                      status = LineStatusEnum.notMatch;
                    }

                    // not-match-without-prime-key
                    const notMatchWithoutPrimeKey = this.tableService.notMatchWithoutPrimeKey(line, secondConnection.data, primeKey);
                    if (notMatchWithoutPrimeKey) {
                      status += ` ${LineStatusEnum.notMatchWithoutPrimeKey}`;
                    }

                  }
                  lineArray.push({
                    status,
                    data: line[key]
                  });
                });
                data.push(lineArray);
              });
            }
            return data;
          };

          this.connection1Data = genList(c1, c2);
          this.connection2Data = genList(c2, c1);

          this.changeDetectorRef.detectChanges();

        })
      )
      .subscribe();

  }

  copy(from: ConnectionNameEnum, line: number) {
    this.tableService.copy(from, line);
  }

  remove(from: ConnectionNameEnum, line: number) {
    this.tableService.remove(from, line);
  }

}
