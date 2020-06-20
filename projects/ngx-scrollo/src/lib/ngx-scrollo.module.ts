// ngx-scrollo previously circus-scroll-2
// Released: December 2016, refactored: 2018, 2019, 2020
// Author: Zbigi Man Zbigniew Stepniewski, www.zbigiman.com, github.com/zbigiman

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrolloDirective } from './ngx-scrollo.directive';
import { ScrolloService } from './ngx-scrollo.service';
import { TinTween } from './tin-tween';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [ScrolloDirective],
  exports: [ScrolloDirective],
  providers: [TinTween, ScrolloService]
})
export class ScrolloModule { }
