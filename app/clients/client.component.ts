import { Component, Input, OnDestroy, OnInit } from 'angular2/core';
import { CanDeactivate, ComponentInstruction, RouteParams, Router, ROUTER_DIRECTIVES } from 'angular2/router';
import { Observable, Subscription } from 'rxjs/Rx';

import { EntityService, ModalService, ToastService } from '../blocks/blocks';
import { ClientService } from './client.service';
import { Client } from './client.interface';
import { ClientVehiclesComponent } from './client-vehicles.component';

import {Pipe, PipeTransform} from 'angular2/core'

@Component({
  selector: 'client',
  templateUrl: 'app/clients/client.component.html',
  styles: ['.mdl-textfield__label {top: 0;}'],
  directives: [ClientVehiclesComponent, ROUTER_DIRECTIVES]
})

/*@Pipe({ name: 'values',  pure: false })
export class ValuesPipe implements PipeTransform {
  transform(value: any, args: any[] = null): any {
    return Object.keys(value).map(key => value[key]);
  }
}*/

export class ClientComponent implements CanDeactivate, OnDestroy, OnInit {
  private _dbResetSubscription: Subscription;

  @Input() client: Client;
  editclient: Client = <Client>{};

  constructor(
    private _clientService: ClientService,
    private _entityService: EntityService,
    private _modalService: ModalService,
    private _routeParams: RouteParams,
    private _router: Router,
    private _toastService: ToastService) { }



  cancel(showToast = true) {
    this.editclient = this._entityService.clone(this.client);
    if (showToast) {
      this._toastService.activate(`Cancelled changes to ${this.client.contactPerson}`);
    }
  }

  delete() {
    let msg = `Do you want to delete ${this.client.contactPerson}?`;
    this._modalService.activate(msg).then(responseOK => {
      if (responseOK) {
        this.cancel(false);
        this._clientService.deleteClient(this.client)
          .subscribe(() => {
            this._toastService.activate(`Deleted ${this.client.contactPerson}`);
            this._gotoClients();
          });
      }
    });
  }

  isAddMode() {
    let id = +this._routeParams.get('id');
    return isNaN(id);
  }

  ngOnDestroy() {
    this._dbResetSubscription.unsubscribe();
  }

  ngOnInit() {
    componentHandler.upgradeDom();
    this._getClient();
    this._dbResetSubscription = this._clientService.onDbReset
      .subscribe(() => this._getClient());
  }

  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction) {
    return !this.client ||
      !this._isDirty() ||
      this._modalService.activate();
  }

  save() {
    let client = this.client = this._entityService.merge(this.client, this.editclient);
    if (client.id == null) {
      this._clientService.addClient(client)
        .subscribe(char => {
          this._setEditClient(char);
          this._toastService.activate(`Successfully added ${char.name}`);
          this._gotoClients();
        });
      return;
    }
    this._clientService.updateClient(client)
      .subscribe(() => this._toastService.activate(`Successfully saved ${client.contactPerson}`));
  }

  private _getClient() {
    let id = +this._routeParams.get('id');
    if (id === 0) return;
    if (this.isAddMode()) {
      this.client = <Client>{ contactPerson: '', email: 'dark' };
      this.editclient = this._entityService.clone(this.client);
      return;
    }
    this._clientService.getClient(id)
      .subscribe(client => this._setEditClient(client));
  }

  private _gotoClients() {
    let id = this.client ? this.client.id : null;
    let route = ['Clients', { id: id }];
    this._router.navigate(route);
  }

  private _handleServiceError(op: string, err: any) {
    console.error(`${op} error: ${err.message || err}`);
  }

  private _isDirty() {
    return this._entityService.propertiesDiffer(this.client, this.editclient);
  }

  private _setEditClient(client: Client) {
    if (client) {
      this.client = client;
      this.editclient = this._entityService.clone(this.client);
    } else {
      this._gotoClients();
    }
  }
}
