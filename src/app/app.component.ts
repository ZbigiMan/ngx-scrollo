import { Component } from '@angular/core';
import { AppConstants } from './app.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  codeExamples: any;

  constructor() {
    this.codeExamples = AppConstants.codeExamples;
  }

  public animOneOnBegin(data: object) {
    console.log('anim one on begin', data);
  }

  public animOneOnEnd(data: object) {
    console.log('anim one on end', data);
  }

  public animOneOnReverseBegin(data: object) {
    console.log('anim one on reverse begin', data);
  }

  public animOneOnReverseEnd(data: object) {
    console.log('anim one on reverse end', data);
  }

  public animOneOnProgress(data: object) {
    // console.log(data);
  }

  public anim2OnProgress(data: object) {
    // console.log(data);
  }
}
