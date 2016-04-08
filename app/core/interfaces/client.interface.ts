import {hasId} from "./hasId"

export interface Client extends hasId {
  isActive : boolean,
  name: string;
  title: string;
  contactPerson : string;
  mobile : string;
  email : string;
}
