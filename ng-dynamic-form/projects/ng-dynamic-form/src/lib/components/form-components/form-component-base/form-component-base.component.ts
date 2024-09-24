import { AfterViewInit, Component, inject, Input, OnInit } from "@angular/core";
import { DynamicFormComponent } from "../../../models/dynamic-form";
import { GridElement } from "../../../services/dynamic-form.service";
import { AbstractControl, FormControl, UntypedFormControl } from "@angular/forms";
import { RenderingMode } from "../../../shared/enums/rendering-mode";
import { ComponentProviderService } from "../../../services/component-provider.service";

@Component({
  selector: "ndf-form-component-base[element]",
  standalone: true,
  template: ""
})
export abstract class FormComponentBaseComponent implements OnInit, AfterViewInit {
  public get mode(): RenderingMode {
    return this._mode;
  }

  @Input() set mode(value: RenderingMode) {
    this._mode = value;
    this.modeChanged(value);
  }

  @Input() element!: GridElement;

  private _mode: RenderingMode = RenderingMode.Render;
  private readonly componentProviderService!: ComponentProviderService;

  public get component(): DynamicFormComponent {
    return this.element.component!;
  }

  public get control(): AbstractControl {
    return this.element.control ?? new UntypedFormControl();
  }

  public get formControl(): UntypedFormControl {
    return this.control as FormControl;
  }

  protected constructor() {
    this.componentProviderService = inject(ComponentProviderService);
  }

  ngOnInit(): void {
    const registeredComponent = this.componentProviderService.getComponentById(this.component.componentReferenceId);
    if (!registeredComponent) {
      throw new Error(`Component reference with ID '${this.component.componentReferenceId}' is not registered`);
    }
  }

  ngAfterViewInit(): void {
    this.initializeProperties(this.component);
  }

  protected modeChanged(mode: RenderingMode): void {
    void mode;
  }

  protected abstract initializeProperties(component: DynamicFormComponent): void;
}
