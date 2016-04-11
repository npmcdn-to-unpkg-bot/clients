import { Component, Input, OnInit } from 'angular2/core';
import { CanDeactivate, ComponentInstruction, RouteParams, Router, ROUTER_DIRECTIVES } from 'angular2/router';

import { Client, ClientService } from './clients';
import {Vehicle} from '../vehicles/vehicles';

@Component({
    selector: 'client-vehicles',
    template: `
        <section>
            <ul>
              <li *ngFor="#v of vehicles">
                    <span>{{v.id}} //  {{v.name}} //</span><input type="text" [(ngModel)]]="{{v.type}}" />
                </li>
            </ul>
        </section>
    `
    
})
export class ClientVehiclesComponent implements OnInit {
    
    @Input() vehicles: Vehicle[];
    @Output() changed: EventEmitter<string>;
    
    constructor(
        private _clientService: ClientService,
        private _routeParams: RouteParams
        
    ) {
        this.changed = new EventEmitter();

        componentHandler.upgradeDom();
    }

    ngOnInit() {
        this.filter = "";
     // this.x=3;
      //  console.log(this.vehicles);   
    }
    
  filter: string;



  filterChanged(event: any) {
    event.preventDefault();
    console.log(`Filter Changed: ${this.filter}`);
    this.changed.emit(this.filter);
  }
    /*
    private _getClientVehicles(){
        let id = +this._routeParams.get('id');
        if (id === 0) return;
        this._clientService.getClient(id)
        .subscribe(client => this.vehicles = client.vehicles);
    }
    */
   

}