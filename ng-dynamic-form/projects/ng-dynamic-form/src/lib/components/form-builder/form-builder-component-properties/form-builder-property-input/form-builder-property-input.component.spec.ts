import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormBuilderPropertyInputComponent} from './form-builder-property-input.component';

describe('FormBuilderPropertyMultilingualTextComponent', () => {
	let component: FormBuilderPropertyInputComponent;
	let fixture: ComponentFixture<FormBuilderPropertyInputComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
    imports: [FormBuilderPropertyInputComponent]
})
			.compileComponents();

		fixture = TestBed.createComponent(FormBuilderPropertyInputComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
