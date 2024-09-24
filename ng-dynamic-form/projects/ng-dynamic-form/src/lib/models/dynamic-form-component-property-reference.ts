import { Type } from "@angular/core";
import { MultilingualString } from "./dynamic-form";

/**
 * Interface representing a dynamic form component property element.
 *
 * This interface is used to define a component type for dynamic form properties.
 */
export interface DynamicFormComponentPropertyReference {

  /**
   * Represents the name of property.
   */
  name: string;

  /**
   * Represents the type of the property component.
   * This variable is utilized to define the dynamic type
   * of the property component in the application.
   */
  propertyComponentType: Type<unknown>;

  /**
   * Representing a text label which supports multiple languages to be shown
   * in the property field.
   * This can be used to display text in different locales based on user
   * preferences or system settings.
   */
  label: MultilingualString;

  /**
   * Represents the order in which the property appears.
   * This property is optional.
   */
  order?: number;

  /**
   * Represents the value used when component is shown as a tool
   * which can either be a string or a MultilingualString object.
   *
   * A MultilingualString object provides support for storing string
   * translations in multiple languages.
   *
   * @type {MultilingualString | string}
   */
  toolValue?: MultilingualString | string;

}