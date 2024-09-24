import { Component } from "@angular/core";
import { ReactiveFormsModule, UntypedFormControl } from "@angular/forms";
import { UpperCasePipe } from "@angular/common";
import { MatInput } from "@angular/material/input";
import { MatFormField, MatLabel, MatSuffix } from "@angular/material/form-field";
import { ObFormFieldDirective } from "@oblique/oblique";
import { FormBuilderPropertyBaseComponent } from "../form-builder-property-base/form-builder-property-base.component";
import { MultilingualTextPipe } from "../../../../shared/pipes/multilingual-text.pipe";

@Component({
    templateUrl: './form-builder-property-input.component.html',
    styleUrl: './form-builder-property-input.component.scss',
    standalone: true,
	imports: [ReactiveFormsModule, ObFormFieldDirective, MatFormField, MatLabel, MatInput, MatSuffix, UpperCasePipe, MultilingualTextPipe]
})
export class FormBuilderPropertyInputComponent  extends FormBuilderPropertyBaseComponent<string> {
	constructor() {
		super();
		this.formGroup.addControl('value', new UntypedFormControl(null))
	}

	protected override get propertyData(): string | null {
		return this.formGroup.get('value')?.value as string ?? null;
	}

	protected override setPropertyData(data: string | null): void {
		this.formGroup.get('value')?.setValue(data, {emitEvent: false});
	}
}
