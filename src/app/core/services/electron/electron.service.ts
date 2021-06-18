import {Injectable} from '@angular/core';
import {ipcRenderer, webFrame} from 'electron';
import * as remote from '@electron/remote';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import {
  ConnectionNameEnum,
  CopyDataInterface,
  RemoveDataInterface,
  TransferActionEnum,
  TransferDataInterface
} from "../../../shared/model";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  checkConnection$: Subject<TransferDataInterface> = new Subject();
  loadConnection$: Subject<TransferDataInterface> = new Subject();

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');

      this.events();
    }
    this.removePreloader();
  }

  removePreloader(): void {
    document.querySelector('#loader').remove();
    document.querySelector<HTMLElement>('app-root').style.cssText = "display: block";
  }

  private events(): void {
    this.ipcRenderer.on(TransferActionEnum.checkConnection, (event, data: TransferDataInterface) => {
      this.checkConnection$.next(data);
    });
    this.ipcRenderer.on(TransferActionEnum.load, (event, data: TransferDataInterface) => {
      this.loadConnection$.next(data);
    });
    this.ipcRenderer.on(TransferActionEnum.copy, (event, data: TransferDataInterface) => {
      this.reload();
    });
    this.ipcRenderer.on(TransferActionEnum.remove, (event, data: TransferDataInterface) => {
      this.reload();
    });
  }

  checkConnection(data: TransferDataInterface): void {
    this.ipcRenderer.send(TransferActionEnum.checkConnection, data);
  }

  lastDataLoad = {
    connection1: null,
    connection2: null
  };

  reload(): void {
    if(this.lastDataLoad.connection1) {
      this.ipcRenderer.send(TransferActionEnum.load, this.lastDataLoad.connection1);
    }
    if(this.lastDataLoad.connection2) {
      this.ipcRenderer.send(TransferActionEnum.load, this.lastDataLoad.connection2);
    }
  }

  load(data: TransferDataInterface, type?: ConnectionNameEnum | null): void {
    if (type === ConnectionNameEnum.connection1) {
      this.lastDataLoad.connection1 = data;
    } else if (type === ConnectionNameEnum.connection2) {
      this.lastDataLoad.connection2 = data;
    }
    this.ipcRenderer.send(TransferActionEnum.load, data);
  }

  copy(data: CopyDataInterface): void {
    this.ipcRenderer.send(TransferActionEnum.copy, data);
  }

  remove(data: RemoveDataInterface): void {
    this.ipcRenderer.send(TransferActionEnum.remove, data);
  }

}
