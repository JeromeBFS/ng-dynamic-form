import { Component } from "@angular/core";
import { ReactiveFormsModule, UntypedFormControl, Validators } from "@angular/forms";
import { DynamicFormComponentPosition } from "../../../../models/dynamic-form";
import { MatInput } from "@angular/material/input";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { ObFormFieldDirective } from "@oblique/oblique";
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from "@angular/material/expansion";
import {
  FormBuilderPropertyBaseComponent
} from "../form-builder-property-base/form-builder-property-base.component";

@Component({
  selector: "ndf-form-builder-property-position",
  templateUrl: "./form-builder-property-position.component.html",
  styleUrl: "./form-builder-property-position.component.scss",
  standalone: true,
  imports: [ReactiveFormsModule, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, ObFormFieldDirective, MatFormField, MatLabel, MatInput]
})
export class FormBuilderPropertyPositionComponent extends FormBuilderPropertyBaseComponent<DynamicFormComponentPosition> {
  protected get position(): DynamicFormComponentPosition {
    return this.propertyData ?? {row: 1, col: 1};
  }

  constructor() {
    super();
    this.formGroup.addControl("row", new UntypedFormControl(1, [Validators.required, Validators.min(1)]));
    this.formGroup.addControl("col", new UntypedFormControl(1, [Validators.required, Validators.min(1)]));
    this.formGroup.addControl("rowspan", new UntypedFormControl(1, [Validators.min(1)]));
    this.formGroup.addControl("colspan", new UntypedFormControl(1, [Validators.min(1)]));
  }

  protected override get propertyData(): DynamicFormComponentPosition | null {
    return this.formGroup.getRawValue() as DynamicFormComponentPosition;
  }

  protected override setPropertyData(data: DynamicFormComponentPosition | null): void {
    if (data && !this.dynamicFormService.positionEquals(data, this.propertyData ?? {row: -1, col: -1})) {
      this.formGroup.patchValue(data ?? {row: 1, col: 1});
    }
  }
}
