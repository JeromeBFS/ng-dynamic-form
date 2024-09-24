import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import {
  multiTranslateLoader,
  ObColumnLayoutModule,
  ObExternalLinkModule, ObIconModule,
  ObMasterLayoutModule,
  ObOffCanvasContainerDirective
} from "@oblique/oblique";
import { TranslateModule } from "@ngx-translate/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { NgxJsonViewerModule } from "ngx-json-viewer";
import { AppComponent } from "./app.component";
import { FormBuilderDemoModule } from "./components/form-builder-demo/form-builder-demo.module";
import { FormComponentPropertiesModule } from "./components/form-component-properties/form-component-properties.module";
import { FormComponentsModule } from "./components/form-components/form-components.module";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { HomeModule } from "./home/home.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";


@NgModule({
  declarations: [
    AppComponent,
  ],
  exports: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(multiTranslateLoader()),
    ObIconModule.forRoot(),
    AppRoutingModule,
    HomeModule,
    HttpClientModule,
    FormBuilderDemoModule,
    FormComponentPropertiesModule,
    FormComponentsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    NgxJsonViewerModule,
    ObColumnLayoutModule,
    ObExternalLinkModule,
    ObMasterLayoutModule,
    ObOffCanvasContainerDirective,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
