import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Rx';

import { ExceptionService, SpinnerService } from '../blocks/blocks';
import { CONFIG, MessageService } from '../shared/shared';
import {Client} from './clients'

let clientsUrl = CONFIG.baseUrls.clients;



@Injectable()
export class ClientService {
  constructor(private _http: Http,
    private _exceptionService: ExceptionService,
    private _messageService: MessageService,
    private _spinnerService: SpinnerService) {
    this._messageService.state.subscribe(state => this.getClients());
  }

  addClient(client: Client) {
    let body = JSON.stringify(client);
    this._spinnerService.show();
    return this._http
      .post(`${clientsUrl}`, body)
      .map(res => res.json().data)
      .catch(this._exceptionService.catchBadResponse)
      .finally(() => this._spinnerService.hide());
  }

  deleteClient(client: Client) {
    this._spinnerService.show();
    return this._http
      .delete(`${clientsUrl}/${client.id}`)
      .catch(this._exceptionService.catchBadResponse)
      .finally(() => this._spinnerService.hide());
  }

  getClients() {
    this._spinnerService.show();
    return this._http.get(clientsUrl)
      .map((response: Response) => <Client[]>response.json().data)
      .catch(this._exceptionService.catchBadResponse)
      .finally(() => this._spinnerService.hide());
  }

  getClient(id: number) {
    this._spinnerService.show();
    return this._http.get(`${clientsUrl}/${id}`)
      .map((response: Response) => response.json().data)
      .catch(this._exceptionService.catchBadResponse)
      .finally(() => this._spinnerService.hide());
  }

  onDbReset = this._messageService.state;

  updateClient(client: Client) {
    let body = JSON.stringify(client);
    this._spinnerService.show();

    return this._http
      .put(`${clientsUrl}/${client.id}`, body)
      .catch(this._exceptionService.catchBadResponse)
      .finally(() => this._spinnerService.hide());
  }
}
