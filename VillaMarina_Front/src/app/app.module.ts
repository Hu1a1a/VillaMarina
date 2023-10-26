import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { LayoutModule } from './module/app.layout.module.component';
import { FrontModule } from './module/app.front.module.component';
import { AdminModule } from './module/app.admin.module.component';
import { AngularMaterialModule } from './module/app.angular.material.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    FrontModule,
    AdminModule,
    LayoutModule
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
