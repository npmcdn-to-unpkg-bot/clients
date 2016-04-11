import { Component, OnDestroy, OnInit, ViewChild } from 'angular2/core';
import { ROUTER_DIRECTIVES } from 'angular2/router';
import { Observable, Subscription } from 'rxjs/Rx';

import { ClientService } from './client.service';
import { Client } from './client.interface';
import { SortClientsPipe } from './sort-clients.pipe';
import { FilterService, FilterTextComponent } from '../blocks/blocks';

@Component({
  selector: 'clients-list',
  templateUrl: './app/clients/client-list.component.html',
  directives: [FilterTextComponent, ROUTER_DIRECTIVES],
  styleUrls: ['./app/clients/client-list.component.css'],
  pipes: [SortClientsPipe],
  providers: [FilterService]
})
export class ClientListComponent implements OnDestroy, OnInit {
  private _dbResetSubscription: Subscription;

  clients: Client[];
  filteredClients = this.clients;
  @ViewChild(FilterTextComponent) filterComponent: FilterTextComponent;

  constructor(private _clientService: ClientService,
    private _filterService: FilterService) { }

  filterChanged(searchText: string) {
    this.filteredClients = this._filterService.filter(searchText, ['id', 'contactPerson'], this.clients);
  }

  getCharacters() {
    this.clients = [];

    this._clientService.getClients()
      .subscribe(clients => {
        this.clients = this.filteredClients = clients;
        this.filterComponent.clear();
      });
  }

  ngOnDestroy() {
    this._dbResetSubscription.unsubscribe();
  }

  ngOnInit() {
    componentHandler.upgradeDom();
    this.getCharacters();
    this._dbResetSubscription = this._clientService.onDbReset
      .subscribe(() => this.getCharacters());
  }
}
