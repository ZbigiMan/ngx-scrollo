import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public animOneOnBegin(data: Object) {
    console.log('anim one on begin', data);
  }

  public animOneOnEnd(data: Object) {
    console.log('anim one on end', data);
  }

  public animOneOnReverseBegin(data: Object) {
    console.log('anim one on reverse begin', data);
  }

  public animOneOnReverseEnd(data: Object) {
    console.log('anim one on reverse end', data);
  }

  public animOneOnProgress(data: Object) {
    // console.log(data);
  }

  public anim2OnProgress(data: Object) {
    // console.log(data);
  }
}
