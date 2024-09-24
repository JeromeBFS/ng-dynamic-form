import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";


platformBrowserDynamic().bootstrapModule(AppModule)
	.catch(err => console.error(err));

// import { provideAnimations } from "@angular/platform-browser/animations";
// import { bootstrapApplication, BrowserModule } from "@angular/platform-browser";
// import { ObHttpApiInterceptor } from "@oblique/oblique";
// import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
// import { importProvidersFrom, LOCALE_ID } from "@angular/core";
// import { AppModule } from "./app/app.component.module";
//
//
// bootstrapApplication(AppModule, {
// 	providers: [
// 		importProvidersFrom(
// 			BrowserModule,
// 		),
// 		{provide: LOCALE_ID, useValue: 'fr-CH'},
// 		{provide: HTTP_INTERCEPTORS, useClass: ObHttpApiInterceptor, multi: true},
// 		provideAnimations(),
// 		provideHttpClient(withInterceptorsFromDi()),
// 	]
// })
// 	.catch(err => console.error(err));
