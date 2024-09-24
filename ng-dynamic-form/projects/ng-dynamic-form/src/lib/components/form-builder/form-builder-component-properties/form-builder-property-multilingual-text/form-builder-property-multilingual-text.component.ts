import { Component } from "@angular/core";
import { FormControl, ReactiveFormsModule, UntypedFormControl } from "@angular/forms";
import { MultilingualString } from "../../../../models/dynamic-form";
import { TranslateService } from "@ngx-translate/core";
import { UpperCasePipe } from "@angular/common";
import { MatInput } from "@angular/material/input";
import { MatFormField, MatLabel, MatSuffix } from "@angular/material/form-field";
import { ObFormFieldDirective } from "@oblique/oblique";
import {
	FormBuilderPropertyBaseComponent
} from "../form-builder-property-base/form-builder-property-base.component";
import { MultilingualTextPipe } from "../../../../shared/pipes/multilingual-text.pipe";
import { emptyToNullValidator } from "../../../../shared/validators/empty-to-null.validator";

@Component({
    templateUrl: './form-builder-property-multilingual-text.component.html',
    styleUrl: './form-builder-property-multilingual-text.component.scss',
    standalone: true,
	imports: [ReactiveFormsModule, ObFormFieldDirective, MatFormField, MatLabel, MatInput, MatSuffix, UpperCasePipe, MultilingualTextPipe]
})
export class FormBuilderPropertyMultilingualTextComponent extends FormBuilderPropertyBaseComponent<MultilingualString> {

	protected language = this.translateService.currentLang;

	constructor(private readonly translateService: TranslateService) {
		super();
		this.formGroup.addControl('de', new UntypedFormControl(null, emptyToNullValidator(undefined)));
		this.formGroup.addControl('fr', new UntypedFormControl(null, emptyToNullValidator(undefined)));
		this.formGroup.addControl('it', new UntypedFormControl(null, emptyToNullValidator(undefined)));
		this.formGroup.addControl('en', new UntypedFormControl(null, emptyToNullValidator(undefined)));
	}

	protected get selectedLanguageControl(): FormControl {
		return this.formGroup.get(this.language) as FormControl;
	}

	protected override get propertyData(): MultilingualString | null {
		const data = this.formGroup.getRawValue() as MultilingualString;
		if (!data?.de && !data.fr && !data.it && !data.en) {
			return null;
		} else {
			return data;
		}
	}

	protected override setPropertyData(data: MultilingualString | null): void {
		this.formGroup.patchValue(data ?? {});
	}
}
