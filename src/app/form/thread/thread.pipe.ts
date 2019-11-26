import {Pipe, Injectable, PipeTransform} from "@angular/core";

@Pipe({
  name: 'startFrom',
  pure: false
})
@Injectable()
export class startFrom implements PipeTransform {
  transform(items: any[], args: any[]): any {
    return function(input, start) {
      start = +start; //parse to int
      return input.slice(start);
    }
  }
}
