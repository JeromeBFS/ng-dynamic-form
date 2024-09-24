import { Injectable, Type } from "@angular/core";
import { DynamicFormComponentReference } from "../models/dynamic-form-component-reference";

/**
 * Service for managing dynamic form components.
 *
 * This service allows for the registration, retrieval, and unregistration
 * of dynamic form components. Components registered with this service can
 * be dynamically included in forms.
 */
@Injectable({
  providedIn: "root"
})
export class ComponentProviderService {

  /**
   * Retrieves the currently stored dynamic form components.
   *
   * @return {DynamicFormComponentReference[]} An array of dynamic form component elements.
   */
  public get components(): DynamicFormComponentReference[] {
    return Object.values(this.componentsById);
  }

  private readonly componentsById: { [id: string]: DynamicFormComponentReference } = {};

  constructor() {
  }

  /**
   * Registers a dynamic form component with the registry. If a component
   * of the same type is already registered, it will be replaced by the new one.
   *
   * @param {DynamicFormComponentReference} component - The component to be registered.
   * @return {void}
   */
  public registerComponent(component: DynamicFormComponentReference): void {
    const existingComponent = this.getComponentById(component.id);

    if (existingComponent) {
      throw new Error(`A component with ID '${component.id}' has already been registered`);
    }

    this.componentsById[component.id] = component;
  }

  /**
   * Retrieves a component of the specified type from the dynamic form.
   *
   * @param {Type<unknown>} componentType - The type of the component to search for.
   * @return {DynamicFormComponentReference | undefined} The component of the specified type if found; otherwise, undefined.
   */
  public getComponentByType(componentType: Type<unknown>): DynamicFormComponentReference | undefined {
    return this.components.find(c => c.componentType === componentType);
  }

  /**
   * Retrieves a component by its unique identifier.
   *
   * @param {string} id - The unique identifier of the component.
   * @return {DynamicFormComponentReference | undefined} The component reference if found, otherwise undefined.
   */
  public getComponentById(id: string): DynamicFormComponentReference | undefined {
    return this.componentsById[id];
  }

  /**
   * Unregisters a dynamic form component from the system.
   *
   * @param {DynamicFormComponentReference} component - The component to be unregistered, identified by its reference.
   * @return {void} This method does not return a value.
   */
  public unregisterComponent(component: DynamicFormComponentReference): void {
    this.unregisterComponentById(component.id);
  }

  /**
   * Unregisters a component by its unique identifier.
   *
   * @param {string} id - The unique identifier of the component to be unregistered.
   * @return {void}
   */
  public unregisterComponentById(id: string): void {
    const existingComponent = this.getComponentById(id);
    if (!existingComponent) {
      console.warn(`Component type '${id}' not found, can't unregister it`);
      return;
    }

    delete this.componentsById[id];
  }

}
