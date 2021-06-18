export interface TransferDataInterface {
  _id?: any
  url: string
  database: string
  collection: string
  data?: any[]
}

export interface CopyDataInterface extends TransferDataInterface {
  from: ConnectionNameEnum
  to: TransferDataInterface
}

export interface RemoveDataInterface extends TransferDataInterface {
  id: number
}


export interface ConnectionDataInterface extends TransferDataInterface {
  name: ConnectionNameEnum
  status: ConnectionDataStatusEnum
}

export enum ConnectionDataStatusEnum {
  online = "online",
  offline = "offline",
  notChecked = "not-сhecked",
}

export interface DataInterface {
  [key: string]: any
}

export enum ConnectionNameEnum {
  connection1 = "connection1",
  connection2 = "connection2",
}

export enum TransferActionEnum {
  checkConnection = "check-connection",
  load = "load",
  copy = "copy",
  remove = "remove",
}

export interface TableLineInterface {
  status: string | null,
  data: any[]
}

export enum LineStatusEnum {
  notMatch = "not-match",
  notMatchWithoutPrimeKey = "not-match-without-prime-key",
}

export interface connectionDataInterface {
  key: string | null
  c1data: {
    status: null | string
    data: any[]
  }[]
  c2data: {
    status: null | string
    data: any[]
  }[]
}


