import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  public anim1OnProgress(data: Object) {
    // console.log(data);
  }

  public anim2OnProgress(data: Object) {
    // console.log(data);
  }
}
