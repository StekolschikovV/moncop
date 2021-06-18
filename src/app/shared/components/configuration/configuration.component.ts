import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {StoreService} from "../../services/store/store.service";
import {ConfigurationService} from "../../services/configuration/configuration.service";
import {ConnectionDataInterface, ConnectionDataStatusEnum, ConnectionNameEnum} from "../../model";
import {filter, map} from "rxjs/operators";

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  connectionNameEnum = ConnectionNameEnum;

  connection1Form = new FormGroup({
    url: new FormControl(''),
    database: new FormControl(''),
    collection: new FormControl(''),
  });

  keys$ = this.storeService.allKeys$.pipe(
    map( value => {

      const result: Set<string> = new Set<string>();

      value.forEach(key => {
        if (!key.startsWith("_")) {
          result.add(key);
        }
      });

      return result;

    })
  );

  connection1Status: ConnectionDataStatusEnum = ConnectionDataStatusEnum.notChecked;

  connection1Status$ = this.storeService.connection1
    .pipe(map(data => data.status));

  connection2Status: ConnectionDataStatusEnum = ConnectionDataStatusEnum.notChecked;

  connection2Status$ = this.storeService.connection2
    .pipe(map(data => data.status));

  connection2Form = new FormGroup({
    url: new FormControl(''),
    database: new FormControl(''),
    collection: new FormControl(''),
  });

  constructor(
    public storeService: StoreService,
    public configurationService: ConfigurationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.connection1Status$.subscribe( data => {
      this.connection1Status = data;
      this.changeDetectorRef.detectChanges();
    });

    this.connection2Status$.subscribe( data => {
      this.connection2Status = data;
      this.changeDetectorRef.detectChanges();
    });

    this.connection1Form.valueChanges.subscribe(val => {
      this.storeService.connection1.next({
        ...this.storeService.connection1.getValue(),
        url: val.url,
        database: val.database,
        collection: val.collection,
      });
    });

    this.connection2Form.valueChanges.subscribe(val => {
      this.storeService.connection2.next({
        ...this.storeService.connection2.getValue(),
        url: val.url,
        database: val.database,
        collection: val.collection,
      });
    });

    // this.testData();

  }

  testData() {

    const mockData1: ConnectionDataInterface = {
      name: ConnectionNameEnum.connection1,
      url: 'mongodb://localhost:27017',
      database: 'articles',
      collection: "articles",
      status: ConnectionDataStatusEnum.notChecked
    };

    const mockData2: ConnectionDataInterface = {
      name: ConnectionNameEnum.connection2,
      url: 'mongodb://localhost:27017',
      database: 'articles',
      collection: "articles2",
      status: ConnectionDataStatusEnum.notChecked
    };

    this.connection1Form.setValue({
      url: mockData1.url,
      database: mockData1.database,
      collection: mockData1.collection
    });

    this.connection2Form.setValue({
      url: mockData2.url,
      database: mockData2.database,
      collection: mockData2.collection
    });

    this.storeService.connection1.next(mockData1);
    this.storeService.connection2.next(mockData2);
  }

  check(connection: 'connection1' | 'connection2'): void {
    this.configurationService.check(connection);
  }

  load(connection: ConnectionNameEnum): void {
    this.configurationService.load(connection);
  }

  setPrimeKey($event): void {
    this.storeService.primeKey$.next($event.target.value);
  }

}
