import { Component, ElementRef, ViewChild } from "@angular/core";
import {
	DynamicFormComponent,
	FormComponentBaseComponent,
	MultilingualString,
	MultilingualText,
	MultilingualTextPipe,
	RenderingMode
} from "@bfs/ng-dynamic-form";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { ObFormFieldDirective } from "@oblique/oblique";

@Component({
	selector: "ndf-form-component-input[element]",
	templateUrl: "./form-component-input.component.html",
	styleUrl: "./form-component-input.component.scss",
})
export class FormComponentInputComponent extends FormComponentBaseComponent {
	@ViewChild('input') set input(value: ElementRef) {
		this._input = value;
		this.modeChanged(this.mode);
	}

	protected type: 'text' | 'number' | 'password' = 'text';
	protected label?: MultilingualString | string;
	protected placeholder?: MultilingualString | string;

	private _input?: ElementRef;

	constructor() {
		super();
	}

	protected override modeChanged(mode: RenderingMode) {
		if (mode === 'build' && this._input) {
			this._input.nativeElement.tabIndex = -1;
		}
	}

	protected override initializeProperties(component: DynamicFormComponent): void {
		this.type = component['type'];
		this.label = component['label'];
		this.placeholder = component['placeholder'];
	}
}
