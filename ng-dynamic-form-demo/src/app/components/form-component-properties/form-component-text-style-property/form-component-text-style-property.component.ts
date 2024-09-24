import { Component } from "@angular/core";
import { TextStyle } from "../../form-components/form-component-text/form-component-text.component";
import { FormBuilderPropertyBaseComponent, MultilingualTextPipe } from "@bfs/ng-dynamic-form";
import { ReactiveFormsModule, UntypedFormControl, Validators } from "@angular/forms";
import { ObFormFieldDirective, ObSelectDirective } from "@oblique/oblique";
import { MatLabel } from "@angular/material/form-field";
import { MatOption } from "@angular/material/autocomplete";

@Component({
  selector: 'app-form-component-text-style-property',
  templateUrl: './form-component-text-style-property.component.html',
  styleUrl: './form-component-text-style-property.component.scss'
})
export class FormComponentTextStylePropertyComponent extends FormBuilderPropertyBaseComponent<TextStyle>{
  protected readonly TextStyle = TextStyle;

  constructor() {
    super();
    this.formGroup.addControl('textStyle', new UntypedFormControl(TextStyle.Normal, Validators.required));
  }

  protected override get propertyData(): TextStyle | null {
    return this.formGroup.get('textStyle')?.value as TextStyle ?? TextStyle.Normal;
  }

  protected override setPropertyData(data: TextStyle | null): void {
    this.formGroup.get('textStyle')?.setValue(data ?? TextStyle.Normal);
  }
}
