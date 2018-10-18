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
