import { Pipe, PipeTransform } from 'angular2/core';
import { Client } from './client.service';

@Pipe({ name: 'sortCharacters' })
export class SortClientsPipe implements PipeTransform {
  transform(value: Client[], args: any[]) {
    if (!value || !value.sort) { return value; }

    return value.sort((a: Client, b: Client) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    });
  }
}