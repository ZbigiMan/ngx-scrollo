import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ScrolloModule } from 'projects/ngx-scrollo/src/public_api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ScrolloModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
