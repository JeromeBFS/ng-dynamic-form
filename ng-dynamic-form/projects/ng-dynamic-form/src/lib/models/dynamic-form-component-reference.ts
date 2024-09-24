import { Type } from "@angular/core";
import { DynamicFormComponentPropertyReference } from "./dynamic-form-component-property-reference";

/**
 * Represents an element of a dynamic form component.
 *
 * @interface DynamicFormComponentReference
 * @property {string} id - A unique identifier represented as a string.
 * @property {Type<unknown>} componentType - The type of the component.
 * @property {DynamicFormComponentPropertyReference[]} properties - An array of properties for the form component element.
 */
export interface DynamicFormComponentReference {
  /**
   * A unique identifier represented as a string.
   */
  id: string;

  /**
   * A variable representing a component's type. It is used to specify and identify
   * the type of a component in the system.
   *
   * @type {Type<unknown>}
   */
  componentType: Type<unknown>;

  /**
   * Represents an array of DynamicFormComponentPropertyElement objects.
   * Each element in this array defines a property of a dynamic form component.
   *
   * @property {DynamicFormComponentPropertyReference[]} properties
   * The list of properties defining various attributes and behaviors of components in a dynamic form.
   */
  properties: DynamicFormComponentPropertyReference[];
}