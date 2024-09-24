import { Type } from "@angular/core";
import { AsyncValidatorFn, ValidatorFn } from "@angular/forms";
import { MultilingualString } from "./dynamic-form";

/**
 * Interface representing a property configuration.
 *
 * @interface DynamicFormComponentProperty
 * @property {string} id - Unique identifier for the property.
 * @property {Type<unknown>} type - The data type of component to entry the property value in builder.
 * @property {number} [order] - Optional show order of the property. If undefined, will be at the end.
 * @property {boolean} [disabled] - Optional flag indicating whether the property is disabled.
 * @property {ValidatorFn | ValidatorFn[]} [validators] - Optional synchronous validators for the property.
 * @property {AsyncValidatorFn | AsyncValidatorFn[]} [asyncValidators] - Optional asynchronous validators for the property.
 */
export interface DynamicFormComponentProperty {
  id: string;
  type: Type<unknown>;
  label: MultilingualString;
  order?: number;
  disabled?: boolean;
  validators?: ValidatorFn | ValidatorFn[];
  asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[];
}