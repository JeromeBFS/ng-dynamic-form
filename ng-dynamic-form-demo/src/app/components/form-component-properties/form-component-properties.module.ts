import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormComponentInputTypePropertyComponent
} from "./form-component-input-type-property/form-component-input-type-property.component";
import {
  FormComponentTextStylePropertyComponent
} from "./form-component-text-style-property/form-component-text-style-property.component";
import { ObFormFieldDirective, ObSelectDirective } from "@oblique/oblique";
import { MatLabel } from "@angular/material/form-field";
import { MatOption } from "@angular/material/autocomplete";
import { MultilingualTextPipe } from "@bfs";



@NgModule({
  declarations: [
    FormComponentInputTypePropertyComponent,
    FormComponentTextStylePropertyComponent
  ],
  exports: [
    FormComponentInputTypePropertyComponent,
    FormComponentTextStylePropertyComponent
  ],
  imports: [
    CommonModule,
    ObFormFieldDirective,
    MatLabel,
    ObSelectDirective,
    MatOption,
    MultilingualTextPipe
  ]
})
export class FormComponentPropertiesModule { }
