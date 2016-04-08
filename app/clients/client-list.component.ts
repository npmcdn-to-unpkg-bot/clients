import { Component, OnDestroy, OnInit, ViewChild } from 'angular2/core';
import { ROUTER_DIRECTIVES } from 'angular2/router';
import { Observable, Subscription } from 'rxjs/Rx';

import { Client, ClientService } from './client.service';
import { SortClientsPipe } from './sort-clients.pipe';
import { FilterService, FilterTextComponent } from '../blocks/blocks';

@Component({
  selector: 'story-characters',
  templateUrl: './app/characters/character-list.component.html',
  directives: [FilterTextComponent, ROUTER_DIRECTIVES],
  styleUrls: ['./app/characters/character-list.component.css'],
  pipes: [SortClientsPipe],
  providers: [FilterService]
})
export class ClientListComponent implements OnDestroy, OnInit {
  private _dbResetSubscription: Subscription;

  clients: Client[];
  filteredClients = this.clients;
  @ViewChild(FilterTextComponent) filterComponent: FilterTextComponent;

  constructor(private _characterService: ClientService,
    private _filterService: FilterService) { }

  filterChanged(searchText: string) {
    this.filteredClients = this._filterService.filter(searchText, ['id', 'name'], this.clients);
  }

  getCharacters() {
    this.clients = [];

    this._characterService.getClients()
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
    this._dbResetSubscription = this._characterService.onDbReset
      .subscribe(() => this.getCharacters());
  }
}
