import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';

import { ClientComponent } from './client.component';
import { ClientListComponent } from './client-list.component';
import { ClientService } from './client.service';

@Component({
  selector: 'clients-root',
  template: `
    <router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
  { path: '/', name: 'Clients', component: ClientListComponent, useAsDefault: true },
	{ path: '/list/:id', name: 'Clients', component: ClientListComponent	},
	{ path: '/:id', name: 'Client', component: ClientComponent }
])

export class ClientsComponent { }

