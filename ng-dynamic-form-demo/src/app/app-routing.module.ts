import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ObUnknownRouteModule } from '@oblique/oblique';
import { HomeComponent } from './home/home.component';
import { FormBuilderDemoComponent } from './components/form-builder-demo/form-builder-demo.component';
import { RouterNames } from './shared/router-names';
import {FormRendererDemoComponent} from './components/form-renderer-demo/form-renderer-demo.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full'
	},
	{
		path: 'home',
		component: HomeComponent
	},
	{
		path: RouterNames.FormBuilder,
		component: FormBuilderDemoComponent
	},
	{
		path: RouterNames.FormRenderer,
		component: FormRendererDemoComponent
	},
	{
		path: '**',
		redirectTo: 'unknown-route'
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes), ObUnknownRouteModule],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
