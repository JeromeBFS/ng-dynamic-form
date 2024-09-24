import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilderDemoComponent } from "./form-builder-demo.component";
import { MatIcon } from "@angular/material/icon";
import { ObButtonDirective, ObColumnLayoutModule } from "@oblique/oblique";
import { MatTooltip } from "@angular/material/tooltip";
import { TranslateModule } from "@ngx-translate/core";
import { FormBuilderComponentPropertiesComponent, FormBuilderToolsComponent, FormGridComponent } from "@bfs";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { MatButton } from "@angular/material/button";
import { NgxJsonViewerModule } from "ngx-json-viewer";



@NgModule({
  declarations: [
    FormBuilderDemoComponent,
  ],
  exports: [
    FormBuilderDemoComponent,
  ],
  imports: [
    CommonModule,
    MatIcon,
    ObColumnLayoutModule,
    MatTooltip,
    TranslateModule,
    FormGridComponent,
    MatTabGroup,
    MatTab,
    FormBuilderToolsComponent,
    FormBuilderComponentPropertiesComponent,
    MatButton,
    ObButtonDirective,
    NgxJsonViewerModule
  ]
})
export class FormBuilderDemoModule { }
