import { Component, forwardRef, inject, OnInit } from "@angular/core";
import { DynamicFormComponentProperty } from "../../../../models/dynamic-form-component-property";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormGroup } from "@angular/forms";
import { DynamicFormService } from "../../../../services/dynamic-form.service";

/**
 * Abstract base class for form components that provide a property of an object.
 *
 * This component is intended to be extended by other form components to manage and display
 * specific properties of an object. It provides a skeleton structure to ensure consistency
 * and reuse of common functionality related to form properties.
 */
@Component({
  standalone: true,
  imports: [],
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormBuilderPropertyBaseComponent),
      multi: true
    }
  ],
})
export abstract class FormBuilderPropertyBaseComponent<TPropertyData> implements ControlValueAccessor, OnInit {
  /**
   * Represents the property config.
   *
   * @type {DynamicFormComponentProperty}
   */
  protected property!: DynamicFormComponentProperty;
  protected readonly formGroup = new UntypedFormGroup({});
  protected  readonly dynamicFormService: DynamicFormService;

  protected constructor() {
    this.dynamicFormService = inject(DynamicFormService);
  }

  ngOnInit(): void {
    this.formGroup.valueChanges.subscribe(() => {
      this.onChange(this.propertyData);
      this.dynamicFormService.emitGridChanged();
    });
  }

  // eslint-disable-next-line
  onChange: any = () => '';

  // eslint-disable-next-line
  onTouch: any = () => '';

  // eslint-disable-next-line
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // eslint-disable-next-line
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(initialData: TPropertyData | null): void {
    this.setPropertyData(initialData);
  }

  protected abstract get propertyData(): TPropertyData | null;

  protected abstract setPropertyData(data: TPropertyData | null): void;
}
