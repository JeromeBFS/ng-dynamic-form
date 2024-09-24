import { Component, Input, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { DynamicFormComponent } from "../../../models/dynamic-form";
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { filter, tap } from "rxjs";
import { DynamicFormService } from "../../../services/dynamic-form.service";
import { MatOption } from "@angular/material/core";
import { MatSelect } from "@angular/material/select";
import {
	FormBuilderPropertyMultilingualTextComponent
} from "./form-builder-property-multilingual-text/form-builder-property-multilingual-text.component";
import {
	FormBuilderPropertyPositionComponent
} from "./form-builder-property-position/form-builder-property-position.component";
import { MatInput } from "@angular/material/input";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { ObFormFieldDirective, ObSelectDirective } from "@oblique/oblique";
import { ComponentProviderService } from "../../../services/component-provider.service";
import { DynamicFormComponentPropertyReference } from "../../../models/dynamic-form-component-property-reference";
import { FormBuilderPropertyInputComponent } from "./form-builder-property-input/form-builder-property-input.component";
import { DynamicFormComponentProperty } from "../../../models/dynamic-form-component-property";

const commonProperties: DynamicFormComponentProperty[] = [
	{
		id: 'common.id',
		type: FormBuilderPropertyInputComponent,
		label: { en: 'ID' },
		order: 0,
		disabled: true,
		validators: [Validators.required, Validators.minLength(3)]
	},
	{
		id: 'common.position',
		label: {
			de: 'Position',
			fr: 'Position',
			it: 'Posizione',
			en: 'Position',
		},
		type: FormBuilderPropertyPositionComponent,
		order: 1000
	}
];

const commonValueProperties: DynamicFormComponentProperty[] = [
	...commonProperties,
	{
		id: 'common.variable',
		label: {
			de: 'Variable',
			fr: 'Variable',
			it: 'Variabile',
			en: 'Variable',
		},
		type: FormBuilderPropertyInputComponent,
		order: 1100
	}
];

// Here new component properties

@Component({
	selector: 'ndf-form-builder-component-properties[component]',
	templateUrl: './form-builder-component-properties.component.html',
	styleUrl: './form-builder-component-properties.component.scss',
	standalone: true,
	imports: [ReactiveFormsModule, ObFormFieldDirective, MatFormField, MatLabel, MatInput, FormBuilderPropertyPositionComponent, FormBuilderPropertyMultilingualTextComponent, ObSelectDirective, MatSelect, MatOption]
})
export class FormBuilderComponentPropertiesComponent implements OnInit {
	protected formGroup = new UntypedFormGroup({});
	protected updateProperties = true;

	private _component?: DynamicFormComponent;
	private editableProperties: DynamicFormComponentProperty[] = [];

	get component(): DynamicFormComponent | undefined {
		return this._component;
	}

	@Input() set component(value: DynamicFormComponent | undefined) {
		this._component = value;
		this.updateEditableProperties();
	}

	@ViewChild('propertyComponentsContainer', {read: ViewContainerRef}) propertyComponentsContainer?: ViewContainerRef;

	constructor(private readonly dynamicFormService: DynamicFormService,
							private readonly componentProviderService: ComponentProviderService) {}

	ngOnInit(): void {
		this.formGroup.valueChanges
			.pipe(
				filter(() => this.formGroup.valid && !!this.component),
				tap(() => Object.assign(this.component!, this.formGroup.getRawValue()))
			)
			.subscribe();
		this.dynamicFormService.gridChanged$.subscribe(() => {
			this.updateEditableProperties();
		});
	}

	private updateEditableProperties() {
		if (!this.component) {
			return;
		}

		this.updateProperties = true;
		try {
			const registeredComponent = this.componentProviderService.getComponentById(this.component.componentReferenceId ?? '__unknown__');
			if (!registeredComponent) {
				throw new Error(`Component reference with ID '${this.component.componentReferenceId}' is not registered`);
			}
			this.editableProperties = [
				...(this.component.variable ? commonValueProperties : commonProperties),
				...registeredComponent.properties.map(p => this.createProperty(p))
			].sort((a, b) => (a.order ?? 100000) - (b.order ?? 100000));
			this.createPropertyComponents(this.editableProperties);
			this.buildForm();
		} finally {
			this.updateProperties = false;
		}
	}

	private buildForm() {
		this.formGroup.controls = {};
		this.editableProperties.forEach(property => {
			const control = new UntypedFormControl(this.component?.[property.id]);
			control.valueChanges.pipe(filter(v => v === null)).subscribe(() => control.setValue(undefined, {emitEvent: false}));
			this.formGroup.addControl(property.id, control);
			control.addValidators(property.validators ?? []);
			control.addAsyncValidators(property.asyncValidators ?? []);
			if (property.disabled) {
				control.disable();
			}
		});
		this.formGroup.patchValue(this.component!);
	}

	private createProperty(propertyReference: DynamicFormComponentPropertyReference): DynamicFormComponentProperty {
		return {
			id: new Date().getTime().toString(),
      type: propertyReference.propertyComponentType,
			label: propertyReference.label,
      order: propertyReference.order,
		};
	}

	private createPropertyComponents(componentProperties: DynamicFormComponentProperty[]): void {
		if (!this.propertyComponentsContainer) {
			return;
		}
		componentProperties.forEach(cp => this.propertyComponentsContainer!.createComponent(cp.type))
	}
}
