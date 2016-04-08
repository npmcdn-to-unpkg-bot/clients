import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Rx';

import { ExceptionService, SpinnerService } from '../blocks/blocks';
import { CONFIG, MessageService } from '../shared/shared';

let charactersUrl = CONFIG.baseUrls.clients;

export interface Client {
  id: number;
  name: string;
}

@Injectable()
export class ClientService {
  constructor(private _http: Http,
    private _exceptionService: ExceptionService,
    private _messageService: MessageService,
    private _spinnerService: SpinnerService) {
    this._messageService.state.subscribe(state => this.getClients());
  }

  addCharacter(client: Client) {
    let body = JSON.stringify(client);
    this._spinnerService.show();
    return this._http
      .post(`${charactersUrl}`, body)
      .map(res => res.json().data)
      .catch(this._exceptionService.catchBadResponse)
      .finally(() => this._spinnerService.hide());
  }

  deleteCharacter(client: Client) {
    this._spinnerService.show();
    return this._http
      .delete(`${charactersUrl}/${client.id}`)
      .catch(this._exceptionService.catchBadResponse)
      .finally(() => this._spinnerService.hide());
  }

  getClients() {
    this._spinnerService.show();
    return this._http.get(charactersUrl)
      .map((response: Response) => <Client[]>response.json().data)
      .catch(this._exceptionService.catchBadResponse)
      .finally(() => this._spinnerService.hide());
  }

  getCharacter(id: number) {
    this._spinnerService.show();
    return this._http.get(`${charactersUrl}/${id}`)
      .map((response: Response) => response.json().data)
      .catch(this._exceptionService.catchBadResponse)
      .finally(() => this._spinnerService.hide());
  }

  onDbReset = this._messageService.state;

  updateCharacter(client: Client) {
    let body = JSON.stringify(client);
    this._spinnerService.show();

    return this._http
      .put(`${charactersUrl}/${client.id}`, body)
      .catch(this._exceptionService.catchBadResponse)
      .finally(() => this._spinnerService.hide());
  }
}
