import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormComponentTextComponent } from "./form-component-text/form-component-text.component";
import { FormComponentInputComponent } from "./form-component-input/form-component-input.component";
import { MultilingualTextPipe } from "@bfs";
import { ObFormFieldDirective } from "@oblique/oblique";
import { MatLabel } from "@angular/material/form-field";
import { ReactiveFormsModule } from "@angular/forms";
import { MatInput } from "@angular/material/input";


@NgModule({
  declarations: [
    FormComponentTextComponent,
    FormComponentInputComponent
  ],
  exports: [
    FormComponentTextComponent,
    FormComponentInputComponent
  ],
  imports: [
    CommonModule,
    MultilingualTextPipe,
    ObFormFieldDirective,
    MatLabel,
    ReactiveFormsModule,
    MatInput
  ]
})
export class FormComponentsModule {}
