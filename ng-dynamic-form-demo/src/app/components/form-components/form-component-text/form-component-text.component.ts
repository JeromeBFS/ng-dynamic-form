import { Component } from "@angular/core";
import {
  DynamicFormComponent,
  FormComponentBaseComponent,
  MultilingualText,
  MultilingualTextPipe
} from "@bfs/ng-dynamic-form";

export enum TextStyle {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  H4 = "h4",
  H5 = "h5",
  H6 = "h6",
  Normal = "normal",
}

@Component({
  selector: "ndf-form-component-text[element]",
  templateUrl: "./form-component-text.component.html",
  styleUrl: "./form-component-text.component.scss",
})
export class FormComponentTextComponent extends FormComponentBaseComponent {
  protected readonly TextStyle = TextStyle;
  protected textStyle: TextStyle = TextStyle.Normal;
  protected text: MultilingualText = {en: ''};

  constructor() {
    super();
  }

  protected override initializeProperties(component: DynamicFormComponent): void {
    this.textStyle = component['textStyle'];
    this.text = component['text'] as MultilingualText;
  }
}
