import { Component, OnDestroy, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';
import { Observable, Subscription } from 'rxjs/Rx';

import { Client, ClientService } from '../clients/clients';
import { ToastService } from '../blocks/blocks';

@Component({
  selector: 'my-dashboard',
  templateUrl: 'app/dashboard/dashboard.component.html',
  styleUrls: ['app/dashboard/dashboard.component.css']
})
export class DashboardComponent implements OnDestroy, OnInit {
  private _dbResetSubscription: Subscription;

  clients: Observable<Client[]>;

  constructor(
    private _clientService: ClientService,
    private _router: Router,
    private _toastService: ToastService) { }

  getClients() {
    // this._spinnerService.show();
    this.clients = this._clientService.getClients()
      .catch(e => {
        this._toastService.activate(`${e}`);
        return Observable.of();
      })
      // .finally(() => { this._spinnerService.hide(); })
  }

  gotoDetail(client: Client) {
    let link = ['Clients', 'Client', { id: client.id }];
    this._router.navigate(link);
  }

  ngOnDestroy() {
    this._dbResetSubscription.unsubscribe();
  }

  ngOnInit() {
    this.getClients();
    this._dbResetSubscription = this._clientService.onDbReset
      .subscribe(() => this.getClients());
  }
}
