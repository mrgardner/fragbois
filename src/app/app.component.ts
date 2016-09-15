import {Component, NgZone, ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {
    zone.run(function() {
      cdr.markForCheck();
    });
  }
}
