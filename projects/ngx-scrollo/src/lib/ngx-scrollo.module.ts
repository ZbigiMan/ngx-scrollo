// ngx-scrollo previously circus-scroll-2
// Released: December 2016, refactored: 2018, 2019
// Author: Zbigi Man Zbigniew Stepniewski, www.zbigiman.com, github.com/zbigiman

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrolloDirective } from './ngx-scrollo.directive';
import { TinTween } from './tin-tween';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ScrolloDirective],
  exports: [ScrolloDirective],
  providers: [TinTween]
})
export class ScrolloModule { }
