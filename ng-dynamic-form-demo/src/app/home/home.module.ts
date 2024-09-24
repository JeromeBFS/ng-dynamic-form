import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from "./home.component";
import { RouterLink } from "@angular/router";
import { MatButton } from "@angular/material/button";
import { ObButtonDirective } from "@oblique/oblique";



@NgModule({
  declarations: [
    HomeComponent
  ],
  exports: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterLink,
    MatButton,
    ObButtonDirective
  ]
})
export class HomeModule { }
