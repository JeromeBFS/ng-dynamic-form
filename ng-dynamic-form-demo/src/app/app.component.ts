import { Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ObMasterLayoutModule, ObOffCanvasContainerDirective } from "@oblique/oblique";
import { ComponentProviderService } from "@bfs/ng-dynamic-form";
import {
  FormComponentInputComponent
} from "./components/form-components/form-component-input/form-component-input.component";
import {
  FormComponentTextStylePropertyComponent
} from "./components/form-component-properties/form-component-text-style-property/form-component-text-style-property.component";
import {
  FormComponentInputTypePropertyComponent
} from "./components/form-component-properties/form-component-input-type-property/form-component-input-type-property.component";
import {
  FormBuilderPropertyMultilingualTextComponent
} from "../../../ng-dynamic-form/projects/ng-dynamic-form/src/lib/components/form-builder/form-builder-component-properties/form-builder-property-multilingual-text/form-builder-property-multilingual-text.component";
import {
  FormComponentTextComponent
} from "./components/form-components/form-component-text/form-component-text.component";
import { FormComponentsModule } from "./components/form-components/form-components.module";
import { FormBuilderDemoModule } from "./components/form-builder-demo/form-builder-demo.module";
import { FormComponentPropertiesModule } from "./components/form-component-properties/form-component-properties.module";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "ng-dynamic-form-demo";

  constructor(componentProviderService: ComponentProviderService) {
    componentProviderService.registerComponent({
      id: "demo.text",
      componentType: FormComponentTextComponent,
      properties: [
        {
          name: 'text',
          propertyComponentType: FormBuilderPropertyMultilingualTextComponent,
          label: { en: "Text", fr: "Texte" },
          order: 1000,
          toolValue: {
            'en': 'Text',
            'fr': 'Texte',
          }
        },
        {
          name: 'textStyle',
          propertyComponentType: FormComponentTextStylePropertyComponent,
          label: { en: "Style" },
          order: 1010
        }
      ]
    });
    componentProviderService.registerComponent({
      id: "demo.input",
      componentType: FormComponentInputComponent,
      properties: [
        {
          name: 'label',
          propertyComponentType: FormBuilderPropertyMultilingualTextComponent,
          label: { en: "Label", fr: "Libellé" },
          order: 1000,
          toolValue: {
            'en': 'Input',
            'fr': 'Champ de saisie',
          }
        },
        {
          name: 'placeholder',
          propertyComponentType: FormBuilderPropertyMultilingualTextComponent,
          label: { en: "Placeholder" },
          order: 1000,
          toolValue: {
            'en': 'Input',
            'fr': 'Champ de saisie',
          }
        },
        {
          name: 'type',
          propertyComponentType: FormComponentInputTypePropertyComponent,
          label: { en: "Value type" },
          order: 1020,
          toolValue: 'text'
        }
      ]
    });
    console.info("appComponent", componentProviderService);
  }
}
