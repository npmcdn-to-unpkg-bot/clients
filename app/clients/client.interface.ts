import { Component, Input, OnDestroy, OnInit } from 'angular2/core';
import {IhasId} from "../core/interfaces/IhasId";
import {Vehicle} from "../vehicles/vehicles";

export interface Client extends IhasId {
  isActive : boolean;
  name: string;
  title: string;
  contactPerson : string;
  mobile : string;
  email : string;
  vehicles : Vehicle[]
}
/*
export class Client implements IClient{
  id: number;  
  isActive : boolean;
  name: string;
  title: string;
  contactPerson : string;
  mobile : string;
  email : string;
}*/