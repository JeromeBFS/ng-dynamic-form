import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {filter} from 'rxjs';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {Clipboard} from '@angular/cdk/clipboard';
import {TranslateModule} from '@ngx-translate/core';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {MatButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';
import {ObButtonDirective, ObColumnLayoutModule} from '@oblique/oblique';
import {
	DynamicForm,
	DynamicFormComponent,
	DynamicFormComposition,
	DynamicFormService,
	FormBuilderComponentPropertiesComponent,
	FormBuilderToolsComponent,
	FormGridComponent,
	Media,
	RenderingMode
} from '@bfs/ng-dynamic-form';

@Component({
	selector: 'ndf-form-builder-demo',
	templateUrl: './form-builder-demo.component.html',
	styleUrl: './form-builder-demo.component.scss',
})
export class FormBuilderDemoComponent implements OnInit, AfterViewInit {
	@ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

	protected readonly Media = Media;
	protected mainForm: DynamicForm = this.dynamicFormService.emptyForm;
	protected mainFormView: DynamicForm = this.mainForm;
	protected formName = new FormControl<string>('', [Validators.required, Validators.minLength(3)]);
	protected RenderingMode = RenderingMode;

	constructor(
		private readonly dynamicFormService: DynamicFormService,
		private readonly clipboard: Clipboard
	) {}

	ngOnInit(): void {
		this.dynamicFormService.selectedId$.pipe(filter(id => !!this.form.components.find(c => c.id === id))).subscribe(() => this.gotoSettings());
		this.dynamicFormService.gridChanged$.subscribe(() => (this.mainFormView = JSON.parse(JSON.stringify(this.mainForm))));
	}

	ngAfterViewInit(): void {
		// this.dynamicFormService.loadFromAssets('life-stats.test').subscribe(form => (this.mainForm = form));
		this.createNewForm();
	}

	protected get media(): Media {
		return this.dynamicFormService.media;
	}

	protected get form(): DynamicFormComposition {
		let form = this.mainForm.forms.find(f => f.media === this.media);
		if (!form) {
			form = this.dynamicFormService.getEmptyMediaForm(this.media);
			this.mainForm.forms.push(form);
		}
		return form;
	}

	protected get selectedComponent(): DynamicFormComponent | undefined {
		return this.form.components.find(c => c.id === this.dynamicFormService.selectedId);
	}

	protected createNewForm() {
		this.mainForm = this.dynamicFormService.emptyForm;
		this.mainForm.name = 'New form';
		this.formName.setValue(this.mainForm.name);
	}

	protected setMedia(media: Media) {
		this.dynamicFormService.setMedia(media);
	}

	protected copyJson() {
		this.clipboard.copy(JSON.stringify(this.mainForm, null, 2));
	}

	private gotoSettings() {
		this.tabGroup.selectedIndex = 1;
	}
}
