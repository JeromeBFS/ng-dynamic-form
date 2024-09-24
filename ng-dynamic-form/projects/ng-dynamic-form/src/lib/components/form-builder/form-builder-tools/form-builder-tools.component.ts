import { DynamicFormComponent, DynamicFormComposition, Media } from "../../../models/dynamic-form";
import { Component, OnInit } from "@angular/core";
import { GridElement } from "../../../services/dynamic-form.service";
import { FormComponentComponent } from "../../form-components/form-component/form-component.component";
import { ComponentProviderService } from "../../../services/component-provider.service";

@Component({
  selector: "ndf-form-builder-tools",
  templateUrl: "./form-builder-tools.component.html",
  styleUrl: "./form-builder-tools.component.scss",
  standalone: true,
  imports: [FormComponentComponent]
})
export class FormBuilderToolsComponent implements OnInit {
  protected toolComponents: DynamicFormComponent[] = [];

  protected get form(): DynamicFormComposition {
    return {
      media: Media.Large,
      components: this.toolComponents
    };
  };

  protected tools: GridElement[] = [];

  constructor(private readonly componentProviderService: ComponentProviderService) {
  }

  ngOnInit(): void {
    this.toolComponents = this.componentProviderService.components.map(c => {
      const componentData: DynamicFormComponent = {
        id: c.id,
        componentReferenceId: c.id,
        position: {
          row: 0, col: 0
        },
      };
      c.properties.forEach(p => componentData[p.name] = p.toolValue)
      return componentData;
    });
    this.tools = this.toolComponents.map(fcd => ({
        id: fcd.id,
        row: 0,
        col: 0,
        component: fcd
      })
    );
  }
}
