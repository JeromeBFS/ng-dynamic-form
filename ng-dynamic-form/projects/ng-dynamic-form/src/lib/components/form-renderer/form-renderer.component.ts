import {Component, OnInit} from '@angular/core';
import {DynamicForm, DynamicFormComposition, Media} from '../../models/dynamic-form';
import {DynamicFormService} from '../../services/dynamic-form.service';
import {filter, window} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {UntypedFormGroup} from '@angular/forms';
import {Clipboard} from '@angular/cdk/clipboard';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {FormGridComponent} from '../form-grid/form-grid.component';
import {ObButtonDirective, ObColumnLayoutModule} from '@oblique/oblique';
import {RenderingMode} from '../../shared/enums/rendering-mode';

@Component({
    selector: 'ndf-form-renderer',
    templateUrl: './form-renderer.component.html',
    styleUrl: './form-renderer.component.scss',
    providers: [
        {
            provide: Window,
            useValue: window
        }
    ],
    standalone: true,
    imports: [ObColumnLayoutModule, FormGridComponent, MatButton, ObButtonDirective, MatIcon, NgxJsonViewerModule]
})
export class FormRendererComponent implements OnInit {
	protected mainForm?: DynamicForm;
	protected formGroup = new UntypedFormGroup({});
	protected readonly RenderingMode = RenderingMode;

	protected get form(): DynamicFormComposition {
		return this.mainForm?.forms.find(f => f.media === this.media) ?? this.dynamicFormService.getEmptyMediaForm(this.media);
	}

	constructor(
		private readonly dynamicFormService: DynamicFormService,
		private readonly breakpointObserver: BreakpointObserver,
		private readonly clipboard: Clipboard
	) {}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Handset])
			.pipe(filter(r => r.matches))
			.subscribe(() => (this.media = Media.Small));
		this.breakpointObserver
			.observe([Breakpoints.Tablet])
			.pipe(filter(r => r.matches))
			.subscribe(() => (this.media = Media.Medium));
		this.breakpointObserver
			.observe([Breakpoints.Web])
			.pipe(filter(r => r.matches))
			.subscribe(() => (this.media = Media.Large));
	}

	protected get formData(): unknown {
		return this.formGroup.getRawValue();
	}

	protected get media(): Media {
		return this.dynamicFormService.media;
	}

	protected set media(value: Media) {
		this.dynamicFormService.setMedia(value);
	}

	protected formGroupFilled(formGroup: UntypedFormGroup) {
		const existingData = {};
		formGroup.patchValue(existingData);
	}

	protected copyJson() {
		this.clipboard.copy(JSON.stringify(this.formData, null, 2));
	}

}
