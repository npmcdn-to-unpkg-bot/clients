import { Component, Input, OnDestroy, OnInit } from 'angular2/core';
import { CanDeactivate, ComponentInstruction, RouteParams, Router, ROUTER_DIRECTIVES } from 'angular2/router';
import { Observable, Subscription } from 'rxjs/Rx';

import { EntityService, ModalService, ToastService } from '../blocks/blocks';
import { Client, ClientService } from '../clients/client.service';

@Component({
  selector: 'story-character',
  templateUrl: 'app/clients/client.component.html',
  styles: ['.mdl-textfield__label {top: 0;}'],
  directives: [ROUTER_DIRECTIVES]
})
export class ClientComponent implements CanDeactivate, OnDestroy, OnInit {
  private _dbResetSubscription: Subscription;

  @Input() client: Client;
  editCharacter: Client = <Client>{};

  constructor(
    private _clientService: ClientService,
    private _entityService: EntityService,
    private _modalService: ModalService,
    private _routeParams: RouteParams,
    private _router: Router,
    private _toastService: ToastService) { }

  cancel(showToast = true) {
    this.editCharacter = this._entityService.clone(this.client);
    if (showToast) {
      this._toastService.activate(`Cancelled changes to ${this.client.name}`);
    }
  }

  delete() {
    let msg = `Do you want to delete ${this.client.name}?`;
    this._modalService.activate(msg).then(responseOK => {
      if (responseOK) {
        this.cancel(false);
        this._clientService.deleteCharacter(this.client)
          .subscribe(() => {
            this._toastService.activate(`Deleted ${this.client.name}`);
            this._gotoCharacters();
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
    this._getCharacter();
    this._dbResetSubscription = this._clientService.onDbReset
      .subscribe(() => this._getCharacter());
  }

  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction) {
    return !this.character ||
      !this._isDirty() ||
      this._modalService.activate();
  }

  save() {
    let client = this.client = this._entityService.merge(this.client, this.editCharacter);
    if (character.id == null) {
      this._characterService.addCharacter(character)
        .subscribe(char => {
          this._setEditCharacter(char);
          this._toastService.activate(`Successfully added ${char.name}`);
          this._gotoCharacters();
        });
      return;
    }
    this._characterService.updateCharacter(character)
      .subscribe(() => this._toastService.activate(`Successfully saved ${character.name}`));
  }

  private _getCharacter() {
    let id = +this._routeParams.get('id');
    if (id === 0) return;
    if (this.isAddMode()) {
      this.client = <Client>{ name: '', side: 'dark' };
      this.editCharacter = this._entityService.clone(this.client);
      return;
    }
    this._characterService.getCharacter(id)
      .subscribe(character => this._setEditCharacter(character));
  }

  private _gotoCharacters() {
    let id = this.client ? this.client.id : null;
    let route = ['Clients', { id: id }];
    this._router.navigate(route);
  }

  private _handleServiceError(op: string, err: any) {
    console.error(`${op} error: ${err.message || err}`);
  }

  private _isDirty() {
    return this._entityService.propertiesDiffer(this.client, this.editCharacter);
  }

  private _setEditCharacter(client: Client) {
    if (client) {
      this.client = client;
      this.editCharacter = this._entityService.clone(this.client);
    } else {
      this._gotoCharacters();
    }
  }
}
