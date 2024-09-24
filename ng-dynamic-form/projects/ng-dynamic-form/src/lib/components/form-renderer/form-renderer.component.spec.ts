import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicFormService } from '../../services/dynamic-form.service';
import { FormRendererComponent } from './form-renderer.component';

describe('FormBuilderComponent', () => {
	let component: FormRendererComponent;
	let fixture: ComponentFixture<FormRendererComponent>;

	let formLoaderServiceMock: { loadFromAssets: jest.Mock };

	beforeEach(async () => {
		// create an object that mock the getBooks method from BooksService
		formLoaderServiceMock = {
			loadFromAssets: jest.fn()
		};

		await TestBed.configureTestingModule({
    imports: [FormRendererComponent],
    providers: [
        {
            provide: DynamicFormService,
            useValue: formLoaderServiceMock
        }
    ]
}).compileComponents();

		fixture = TestBed.createComponent(FormRendererComponent);
		component = fixture.componentInstance;
		// fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

});
