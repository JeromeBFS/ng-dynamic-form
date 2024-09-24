import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { DynamicFormService, GRID_TEMPLATE_EMPTY, GridDirection, GridElement } from "./dynamic-form.service";
import {
	DynamicFormComponent,
	DynamicFormComponentPosition,
	DynamicFormComposition,
	Media
} from "../models/dynamic-form";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { EventEmitter } from "@angular/core";
import { LangChangeEvent } from "@ngx-translate/core/lib/translate.service";
import { RenderingMode } from "../shared/enums/rendering-mode";

describe('DynamicFormService', () => {
	class TranslateServiceStub {
		onLangChange = new EventEmitter<LangChangeEvent>();
	}

	let service: DynamicFormService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TranslateModule],
			providers: [DynamicFormService, {provide: TranslateService, useClass: TranslateServiceStub}]
		});
		service = TestBed.inject(DynamicFormService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('getGridAreasComponents', () => {
		it('should return elements with or without components for all gris cells when rendering mode is build', () => {
			// Arrange
			const createGridElement = (row: number, col: number, component?: DynamicFormComponent): GridElement => {
				if (component) {
					return {
						id: component.id,
						row,
						col,
						component: component
					};
				}
				return {
					id: `${GRID_TEMPLATE_EMPTY}-${row}-${col}`,
					row,
					col
				};
			};
			const colCount = 5;
			const rowCount = 5;
			const form: DynamicFormComposition = {
				media: Media.Large,
				components: [
					{
						id: 'c-1',
						componentReferenceId: 'some.component.ref.id',
						position: {
							row: 1,
							col: 1
						}
					},
					{
						id: 'c-2',
						componentReferenceId: 'some.component.ref.id',
						position: {
							row: 3,
							rowspan: 2,
							col: 3,
							colspan: 2
						}
					}
				]
			};

			// Act
			const result = service.getGridAreasElements(form, RenderingMode.Build, rowCount, colCount);

			// Assert
			expect(result).toEqual([
				// row 1
				createGridElement(1, 1, form.components[0]),
				createGridElement(1, 2),
				createGridElement(1, 3),
				createGridElement(1, 4),
				createGridElement(1, 5),
				// row 2
				createGridElement(2, 1),
				createGridElement(2, 2),
				createGridElement(2, 3),
				createGridElement(2, 4),
				createGridElement(2, 5),
				// row 3
				createGridElement(3, 1),
				createGridElement(3, 2),
				createGridElement(3, 3, form.components[1]),
				// No value because of component colspan 2
				createGridElement(3, 5),
				// row 4
				createGridElement(4, 1),
				createGridElement(4, 2),
				// No value because of component rowspan 2
				// No value because of component rowspan and colspan 2
				createGridElement(4, 5),
				// row 5
				createGridElement(5, 1),
				createGridElement(5, 2),
				createGridElement(5, 3),
				createGridElement(5, 4),
				createGridElement(5, 5)
			]);
		});

		it('should return elements only for components when rendering mode is input', () => {
			// Arrange
			const createGridElement = (row: number, col: number, component?: DynamicFormComponent): GridElement => {
				if (component) {
					return {
						id: component.id,
						row,
						col,
						component: component
					};
				}
				return {
					id: `${GRID_TEMPLATE_EMPTY}-${row}-${col}`,
					row,
					col
				};
			};
			const colCount = 5;
			const rowCount = 5;
			const form: DynamicFormComposition = {
				media: Media.Large,
				components: [
					{
						id: 'c-1',
						componentReferenceId: 'some.component.ref.id',
						position: {
							row: 1,
							col: 1
						}
					},
					{
						id: 'c-2',
						componentReferenceId: 'some.component.ref.id',
						position: {
							row: 3,
							rowspan: 2,
							col: 3,
							colspan: 2
						}
					}
				]
			};

			// Act
			const result = service.getGridAreasElements(form, RenderingMode.Render, rowCount, colCount);

			// Assert
			result.forEach(ge => {
				expect(ge.component).toBeDefined();
				ge.control = undefined; // Remove it for next expectation
			}); // Do not test con
			expect(result).toEqual([createGridElement(1, 1, form.components[0]), createGridElement(3, 3, form.components[1])]);
		});
	});

	describe('buildGridTemplateArea', () => {
		it('should return grid area only with empty cells when mode is build and formMetaData is empty', () => {
			// Arrange
			const colCount = 3;
			const rowCount = 3;
			const form = service.getEmptyMediaForm(Media.Large);

			// Act
			const result = service.buildGridTemplateArea(form, RenderingMode.Build, rowCount, colCount);

			// Assert
			expect(result).toBe('"e-1-1 e-1-2 e-1-3" "e-2-1 e-2-2 e-2-3" "e-3-1 e-3-2 e-3-3"');
		});

		it('should return grid area only with "." cells when mode is build and formMetaData is empty', () => {
			// Arrange
			const colCount = 3;
			const rowCount = 3;
			const form = service.getEmptyMediaForm(Media.Large);

			// Act
			const result = service.buildGridTemplateArea(form, RenderingMode.Render, rowCount, colCount);

			// Assert
			expect(result).toBe('". . ." ". . ." ". . ."');
		});

		it('should return grid area with component id in occupied places when mode is build and form contains components', () => {
			// Arrange
			const colCount = 5;
			const rowCount = 5;
			const form: DynamicFormComposition = {
				media: Media.Large,
				components: [
					{
						id: 'c-1',
						componentReferenceId: 'some.component.ref.id',
						position: {
							row: 1,
							col: 1
						}
					},
					{
						id: 'c-2',
						componentReferenceId: 'some.component.ref.id',
						position: {
							row: 3,
							rowspan: 2,
							col: 3,
							colspan: 2
						}
					}
				]
			};

			// Act
			const result = service.buildGridTemplateArea(form, RenderingMode.Build, rowCount, colCount);

			// Assert
			expect(result).toBe(
				'"c-1 e-1-2 e-1-3 e-1-4 e-1-5" "e-2-1 e-2-2 e-2-3 e-2-4 e-2-5" "e-3-1 e-3-2 c-2 c-2 e-3-5" "e-4-1 e-4-2 c-2 c-2 e-4-5" "e-5-1 e-5-2 e-5-3 e-5-4 e-5-5"'
			);
		});

		it('should return grid area with component id in occupied places and "." in empty places when mode is input and form contains components', () => {
			// Arrange
			const colCount = 5;
			const rowCount = 5;
			const form: DynamicFormComposition = {
				media: Media.Large,
				components: [
					{
						id: 'c-1',
						componentReferenceId: 'some.component.ref.id',
						position: {
							row: 1,
							col: 1
						}
					},
					{
						id: 'c-2',
						componentReferenceId: 'some.component.ref.id',
						position: {
							row: 3,
							rowspan: 2,
							col: 3,
							colspan: 2
						}
					}
				]
			};

			// Act
			const result = service.buildGridTemplateArea(form, RenderingMode.Render, rowCount, colCount);

			// Assert
			expect(result).toBe('"c-1 . . . ." ". . . . ." ". . c-2 c-2 ." ". . c-2 c-2 ." ". . . . ."');
		});
	});

	describe('findComponent', () => {
		it('should return component when row and col match defined position', () => {
			// Arrange
			const form: DynamicFormComposition = {
				media: Media.Large,
				components: [
					{
						id: 'comp-1',
						componentReferenceId: 'some.component.ref.id',
						position: {
							row: 3,
							col: 3
						}
					}
				]
			};
			const col = 3;
			const row = 3;

			// Act
			const result = service.findComponent(form, row, col);

			// Assert
			expect(result).toBe(form.components[0]);
		});

		it('should return undefined when row and col doesnt match defined position', () => {
			// Arrange
			const form = {
				media: Media.Large,
				components: [
					{
						id: 'comp-1',
						componentReferenceId: 'some.component.ref.id',
						position: {
							row: 1,
							col: 1
						}
					}
				]
			};
			const col = 3;
			const row = 3;

			// Act
			const result = service.findComponent(form, row, col);

			// Assert
			expect(result).toBeUndefined();
		});

		it('should return component when row and col match defined position in colspan', () => {
			// Arrange
			const form = {
				media: Media.Large,
				components: [
					{
						id: 'comp-1',
						componentReferenceId: 'some.component.ref.id',
						position: {
							row: 1,
							col: 1,
							colspan: 3
						}
					}
				]
			};
			const col = 3;
			const row = 1;

			// Act
			const result = service.findComponent(form, row, col);

			// Assert
			expect(result).toBe(form.components[0]);
		});

		it('should return component when row and col match defined position in rowspan', () => {
			// Arrange
			const form = {
				media: Media.Large,
				components: [
					{
						id: 'comp-1',
						componentReferenceId: 'some.component.ref.id',
						position: {
							row: 1,
							rowspan: 3,
							col: 1
						}
					}
				]
			};
			const col = 1;
			const row = 3;

			// Act
			const result = service.findComponent(form, row, col);

			// Assert
			expect(result).toBe(form.components[0]);
		});

		it('should return component when row and col match defined position in colspan and rowspan', () => {
			// Arrange
			const form = {
				media: Media.Large,
				components: [
					{
						id: 'comp-1',
						componentReferenceId: 'some.component.ref.id',
						position: {
							row: 1,
							rowspan: 3,
							col: 1,
							colspan: 3
						}
					}
				]
			};
			const col = 3;
			const row = 3;

			// Act
			const result = service.findComponent(form, row, col);

			// Assert
			expect(result).toBe(form.components[0]);
		});

		it('should return component when row and col match defined position between colspan and rowspan', () => {
			// Arrange
			const form = {
				media: Media.Large,
				components: [
					{
						id: 'comp-1',
						componentReferenceId: 'some.component.ref.id',
						position: {
							row: 1,
							rowspan: 3,
							col: 1,
							colspan: 3
						}
					}
				]
			};
			const col = 2;
			const row = 2;

			// Act
			const result = service.findComponent(form, row, col);

			// Assert
			expect(result).toBe(form.components[0]);
		});

		it('should return undefined when row and col match defined position out of colspan and rowspan', () => {
			// Arrange
			const form = {
				media: Media.Large,
				components: [
					{
						id: 'comp-1',
						componentReferenceId: 'some.component.ref.id',
						position: {
							row: 1,
							rowspan: 3,
							col: 1,
							colspan: 3
						}
					}
				]
			};
			const col = 5;
			const row = 5;

			// Act
			const result = service.findComponent(form, row, col);

			// Assert
			expect(result).toBeUndefined();
		});
	});

	describe('getElementId', () => {
		it('should return component id when component is defined', () => {
			// Arrange
			const component: DynamicFormComponent = {
				id: 'comp-1',
				componentReferenceId: 'some.component.ref.id',
				position: {
					row: 3,
					col: 3
				}
			};
			const col = 3;
			const row = 3;

			// Act
			const id = service.getElementId(row, col, component);

			// Assert
			expect(id).toBe(component.id);
		});

		it('should return empty id according row and col when component is undefined', () => {
			// Arrange
			const col = 3;
			const row = 5;

			// Act
			const id = service.getElementId(row, col);

			// Assert
			expect(id).toBe(`${GRID_TEMPLATE_EMPTY}-${row}-${col}`);
		});
	});

	describe('emptyForm', () => {
		it('should generate different instance at each call', () => {
			// Act
			const empty1 = service.getEmptyMediaForm(Media.Large);
			const empty2 = service.getEmptyMediaForm(Media.Large);

			// Assert
			expect(empty1).not.toBe(empty2);
		});
	});

	describe('hasCloseElement', () => {
		it('should return true for any direction when element is not a component', () => {
			// Arrange
			const element: GridElement = {
				id: 'SomeId',
				row: 0,
				col: 0
			};
			const form = service.getEmptyMediaForm(Media.Large);

			// Act
			const upResult = service.hasCloseElement(form, element, 'up');
			const downResult = service.hasCloseElement(form, element, 'down');
			const leftResult = service.hasCloseElement(form, element, 'left');
			const rightResult = service.hasCloseElement(form, element, 'right');

			// Assert
			expect(upResult).toBe(true);
			expect(downResult).toBe(true);
			expect(leftResult).toBe(true);
			expect(rightResult).toBe(true);
		});

		const directions: GridDirection[] = ['up', 'down', 'left', 'right'];
		const cases = directions.flatMap(test => directions.map(component => [test, component]));
		test.each(cases)(`should return true when %s === %s else false`, (testDirection, componentPosition) => {
			// Arrange
			const testComponent: DynamicFormComponent = {id: 'test', componentReferenceId: 'some.component.ref.id', position: {row: 2, col: 2}};
			const upComponent: DynamicFormComponent = {id: 'up', componentReferenceId: 'some.component.ref.id', position: {row: 1, col: 2}};
			const downComponent: DynamicFormComponent = {id: 'down', componentReferenceId: 'some.component.ref.id', position: {row: 3, col: 2}};
			const leftComponent: DynamicFormComponent = {id: 'left', componentReferenceId: 'some.component.ref.id', position: {row: 2, col: 1}};
			const rightComponent: DynamicFormComponent = {id: 'right', componentReferenceId: 'some.component.ref.id', position: {row: 2, col: 3}};
			const element: GridElement = {
				id: testComponent.id,
				row: testComponent.position.row,
				col: testComponent.position.col,
				component: testComponent
			};

			const components: DynamicFormComponent[] = [testComponent];
			if (componentPosition === 'up') components.push(upComponent);
			if (componentPosition === 'down') components.push(downComponent);
			if (componentPosition === 'left') components.push(leftComponent);
			if (componentPosition === 'right') components.push(rightComponent);
			const form = {name: 'test-form', media: Media.Large, components} as DynamicFormComposition;

			// Act
			const result = service.hasCloseElement(form, element, testDirection);

			// Assert
			expect(result).toBe(testDirection === componentPosition);
		});

		test.each(cases)(`should return true when %s === %s else false, even with padding`, (testDirection, componentPosition) => {
			// Arrange
			const testComponent: DynamicFormComponent = {id: 'test', componentReferenceId: 'some.component.ref.id', position: {row: 2, col: 2, colspan: 4, rowspan: 2}};
			const upComponent: DynamicFormComponent = {id: 'up', componentReferenceId: 'some.component.ref.id', position: {row: 1, col: 3}};
			const downComponent: DynamicFormComponent = {id: 'down', componentReferenceId: 'some.component.ref.id', position: {row: 4, col: 3}};
			const leftComponent: DynamicFormComponent = {id: 'left', componentReferenceId: 'some.component.ref.id', position: {row: 3, col: 1}};
			const rightComponent: DynamicFormComponent = {id: 'right', componentReferenceId: 'some.component.ref.id', position: {row: 3, col: 6}};
			const element: GridElement = {
				id: testComponent.id,
				row: testComponent.position.row,
				col: testComponent.position.col,
				component: testComponent
			};

			const components: DynamicFormComponent[] = [testComponent];
			if (componentPosition === 'up') components.push(upComponent);
			if (componentPosition === 'down') components.push(downComponent);
			if (componentPosition === 'left') components.push(leftComponent);
			if (componentPosition === 'right') components.push(rightComponent);
			const form = {name: 'test-form', media: Media.Large, components} as DynamicFormComposition;

			// Act
			const result = service.hasCloseElement(form, element, testDirection);

			// Assert
			expect(result).toBe(testDirection === componentPosition);
		});
	});

	describe('hasConflictAtPosition', () => {
		const cases: [number, number, number, number, number, number, number | undefined, number | undefined, boolean][] = [
			// Testing without rowspan and colspan
			[1, 1, 1, 1, 2, 3, undefined, undefined, false],
			[1, 1, 1, 1, 1, 1, undefined, undefined, true],
			[1, 1, 2, 1, 2, 1, undefined, undefined, true],
			[1, 1, 1, 2, 2, 1, undefined, undefined, false],
			[1, 1, 1, 3, 1, 2, undefined, undefined, true],
			[1, 1, 1, 3, 2, 2, undefined, undefined, false],
			[1, 1, 3, 3, 2, 2, undefined, undefined, true],
			[1, 1, 3, 3, 5, 5, undefined, undefined, false],
			[3, 3, 1, 1, 1, 2, undefined, undefined, false],
			[3, 3, 1, 1, 2, 2, undefined, undefined, true],
			[1, 1, 3, 3, 11, 11, undefined, undefined, false],
			[12, 12, 3, 3, 11, 11, undefined, undefined, true],
			// Testing rowspan and colspan
			[1, 1, 1, 1, 1, 1, 2, 2, true],
			[3, 3, 1, 1, 1, 1, 3, 3, true],
			[3, 3, 1, 1, 1, 1, 3, 3, true],
			[4, 4, 2, 2, 5, 1, 7, 7, true]
		];
		test.each(cases)(
			'should return true when a component already exists at position: %d %d %d %d %d %d %d %d %s',
			(existingRow, existingCol, existingRowspan, existingColspan, row, col, rowspan, colspan, hasConflict) => {
				// Arrange
				const form = service.getEmptyMediaForm(Media.Large);
				const existingComponent: DynamicFormComponent = {
					id: 'ExistingId',
					componentReferenceId: 'some.component.ref.id',
					position: {row: existingRow, col: existingCol, rowspan: existingRowspan, colspan: existingColspan},
					text: 'SomeText'
				};
				const component: DynamicFormComponent = {
					id: 'SomeId',
					componentReferenceId: 'some.component.ref.id',
					position: {row: 10, col: 10, rowspan: 2, colspan: 2},
					text: 'SomeText'
				};

				form.components.push(existingComponent, component);

				// Act
				const result = service.hasConflictAtPosition(form, component, row, col, rowspan, colspan);

				// Assert
				expect(result).toBe(hasConflict);
			}
		);
	});

	describe('addComponentAtPosition', () => {
		it('should return sames component with new id and position', () => {
			// Arrange
			const form = service.getEmptyMediaForm(Media.Large);
			const component: DynamicFormComponent = {
				id: 'SomeId',
				componentReferenceId: 'some.component.ref.id',
				position: {row: 3, col: 4},
				text: 'SomeText'
			};

			// Act
			const newComponent = service.addComponentAtPosition(form, component, 17, 23);

			// Assert
			expect(newComponent).not.toBe(component);
			expect(newComponent.id).toMatch(new RegExp(`^${component.componentReferenceId}-\\d{12}\\d+$`));
			expect(newComponent.componentReferenceId).toBe('some.component.ref.id');
			expect(newComponent.position.row).toBe(17);
			expect(newComponent.position.col).toBe(23);
			expect(form.components).toContain(newComponent);
		});

		const cases: [number, number, number, number, number, number, boolean][] = [
			[1, 1, 1, 1, 2, 3, false],
			[1, 1, 1, 1, 1, 1, true],
			[1, 1, 2, 1, 2, 1, true],
			[1, 1, 1, 3, 1, 2, true],
			[1, 1, 3, 3, 2, 2, true],
			[1, 1, 3, 3, 5, 5, false]
		];
		test.each(cases)(
			'should throw error when a component already exists at position: %d %d %d %d %d %d %s',
			(existingRow, existingCol, existingRowspan, existingColspan, row, col, shouldThrow) => {
				// Arrange
				const form = service.getEmptyMediaForm(Media.Large);
				const existingComponent: DynamicFormComponent = {
					id: 'ExistingId',
					componentReferenceId: 'some.component.ref.id',
					position: {row: existingRow, col: existingCol, rowspan: existingRowspan, colspan: existingColspan},
					text: 'SomeText'
				};
				form.components.push(existingComponent);
				const component: DynamicFormComponent = {
					id: 'SomeId',
					componentReferenceId: 'some.component.ref.id',
					position: {row: 0, col: 0},
					text: 'SomeText'
				};

				// Act / Assert
				const act = () => service.addComponentAtPosition(form, component, row, col);

				// Assert
				if (shouldThrow) {
					expect(act).toThrowError('A component cannot be added in an already taken position');
				} else {
					expect(act).not.toThrowError();
				}
			}
		);
	});

	describe('moveComponentByIdAtPosition', () => {
		it('should throw error when id doesnt exists in form', () => {
			// Arrange
			const form = service.getEmptyMediaForm(Media.Large);

			// Act
			const act = () => service.moveComponentByIdAtPosition(form, 'SomeUnknownId', 10, 10);

			// Assert
			expect(act).toThrowError("The component with id 'SomeUnknownId' doesnt exists in specified form");
		});

		const cases: [number, number, number, number, number, number, boolean][] = [
			[1, 1, 1, 1, 2, 3, false],
			[1, 1, 1, 1, 1, 1, true],
			[1, 1, 2, 1, 2, 1, true],
			[1, 1, 1, 3, 1, 2, true],
			[1, 1, 3, 3, 2, 2, true],
			[3, 3, 3, 3, 3, 2, true],
			[1, 1, 3, 3, 5, 5, false]
		];
		test.each(cases)(
			'should throw error when moved component touch an already existing component at desired position: %d %d %d %d %d %d %s',
			(existingRow, existingCol, existingRowspan, existingColspan, row, col, shouldThrow) => {
				// Arrange
				const form = service.getEmptyMediaForm(Media.Large);
				const existingComponent: DynamicFormComponent = {
					id: 'ExistingId',
					componentReferenceId: 'some.id.ExistingId',
					position: {row: existingRow, col: existingCol, rowspan: existingRowspan, colspan: existingColspan},
					text: 'SomeText'
				};
				const movedComponent: DynamicFormComponent = {
					id: 'MovedId',
					componentReferenceId: 'some.id.MovedId',
					position: {row: 100, col: 100, colspan: 2, rowspan: 2},
					text: 'SomeText'
				};
				form.components.push(existingComponent, movedComponent);

				// Act / Assert
				const act = () => service.moveComponentByIdAtPosition(form, movedComponent.id, row, col);

				// Assert
				if (shouldThrow) {
					expect(act).toThrowError('A component cannot be moved in an already taken position');
				} else {
					expect(act).not.toThrowError();
					expect(movedComponent.position.row).toBe(row);
					expect(movedComponent.position.col).toBe(col);
				}
			}
		);
	});

	describe('spanComponent', () => {
		const cases: [
			string,
			DynamicFormComponentPosition,
			DynamicFormComponentPosition,
			number,
			GridDirection,
			boolean,
			DynamicFormComponentPosition | undefined
		][] = [
			[
				'should throw error when spanning conflict with existing component',
				{row: 1, col: 1, rowspan: 1, colspan: 1}, // Existing component position
				{row: 2, col: 1, rowspan: 1, colspan: 1}, // Spanned component position
				1,
				'up', // Spanning
				// Expectation
				true, // Has conflict
				undefined // Final position after spanning
			],
			[
				'should throw error when spanning conflict with existing component',
				{row: 2, col: 2, rowspan: 2, colspan: 2}, // Existing component position
				{row: 1, col: 2, rowspan: 1, colspan: 1}, // Spanned component position
				1,
				'down', // Spanning
				// Expectation
				true, // Has conflict
				undefined // Final position after spanning
			],
			[
				'should throw error when spanning conflict with existing component',
				{row: 2, col: 2, rowspan: 2, colspan: 2}, // Existing component position
				{row: 2, col: 1, rowspan: 1, colspan: 1}, // Spanned component position
				1,
				'right', // Spanning
				// Expectation
				true, // Has conflict
				undefined // Final position after spanning
			],
			[
				'should throw error when spanning conflict with existing component',
				{row: 1, col: 1, rowspan: 5, colspan: 1}, // Existing component position
				{row: 2, col: 2, rowspan: 1, colspan: 1}, // Spanned component position
				1,
				'left', // Spanning
				// Expectation
				true, // Has conflict
				undefined // Final position after spanning
			],
			[
				'should throw error when spanning conflict with existing component',
				{row: 1, col: 1, rowspan: 1, colspan: 5}, // Existing component position
				{row: 2, col: 2, rowspan: 1, colspan: 1}, // Spanned component position
				1,
				'up', // Spanning
				// Expectation
				true, // Has conflict
				undefined // Final position after spanning
			],
			[
				'should move component when spanning up',
				{row: 10, col: 10, rowspan: 1, colspan: 1}, // Existing component position
				{row: 3, col: 3, rowspan: 1, colspan: 1}, // Spanned component position
				1,
				'up', // Spanning
				// Expectation
				false, // Has conflict
				{row: 2, col: 3, rowspan: 2, colspan: 1} // Final position after spanning
			],
			[
				'should move component when spanning left',
				{row: 10, col: 10, rowspan: 1, colspan: 1}, // Existing component position
				{row: 3, col: 3, rowspan: 1, colspan: 1}, // Spanned component position
				1,
				'left', // Spanning
				// Expectation
				false, // Has conflict
				{row: 3, col: 2, rowspan: 1, colspan: 2} // Final position after spanning
			],
			[
				'should only grow span when spanning down',
				{row: 10, col: 10, rowspan: 1, colspan: 1}, // Existing component position
				{row: 1, col: 1, rowspan: 3, colspan: 3}, // Spanned component position
				1,
				'down', // Spanning
				// Expectation
				false, // Has conflict
				{row: 1, col: 1, rowspan: 4, colspan: 3} // Final position after spanning
			],
			[
				'should only grow span when spanning right',
				{row: 10, col: 10, rowspan: 1, colspan: 1}, // Existing component position
				{row: 1, col: 1, rowspan: 3, colspan: 3}, // Spanned component position
				1,
				'right', // Spanning
				// Expectation
				false, // Has conflict
				{row: 1, col: 1, rowspan: 3, colspan: 4} // Final position after spanning
			],
			[
				'should only grow span by specified spanning cells when spanning down',
				{row: 10, col: 10, rowspan: 1, colspan: 1}, // Existing component position
				{row: 1, col: 1, rowspan: 3, colspan: 3}, // Spanned component position
				3,
				'down', // Spanning
				// Expectation
				false, // Has conflict
				{row: 1, col: 1, rowspan: 6, colspan: 3} // Final position after spanning
			],
			[
				'should only grow span by specified spanning cells when spanning right',
				{row: 10, col: 10, rowspan: 1, colspan: 1}, // Existing component position
				{row: 1, col: 1, rowspan: 3, colspan: 3}, // Spanned component position
				3,
				'right', // Spanning
				// Expectation
				false, // Has conflict
				{row: 1, col: 1, rowspan: 3, colspan: 6} // Final position after spanning
			],
			[
				'should reduce span and move when spanning up negatively',
				{row: 10, col: 10, rowspan: 1, colspan: 1}, // Existing component position
				{row: 3, col: 3, rowspan: 3, colspan: 3}, // Spanned component position
				-1,
				'up', // Spanning
				// Expectation
				false, // Has conflict
				{row: 4, col: 3, rowspan: 2, colspan: 3} // Final position after spanning
			],
			[
				'should reduce span when spanning down negatively',
				{row: 10, col: 10, rowspan: 1, colspan: 1}, // Existing component position
				{row: 3, col: 3, rowspan: 3, colspan: 3}, // Spanned component position
				-1,
				'down', // Spanning
				// Expectation
				false, // Has conflict
				{row: 3, col: 3, rowspan: 2, colspan: 3} // Final position after spanning
			],
			[
				'should reduce span and move when spanning left negatively',
				{row: 10, col: 10, rowspan: 1, colspan: 1}, // Existing component position
				{row: 3, col: 3, rowspan: 3, colspan: 3}, // Spanned component position
				-1,
				'left', // Spanning
				// Expectation
				false, // Has conflict
				{row: 3, col: 4, rowspan: 3, colspan: 2} // Final position after spanning
			],
			[
				'should reduce span when spanning right negatively',
				{row: 10, col: 10, rowspan: 1, colspan: 1}, // Existing component position
				{row: 3, col: 3, rowspan: 3, colspan: 3}, // Spanned component position
				-1,
				'right', // Spanning
				// Expectation
				false, // Has conflict
				{row: 3, col: 3, rowspan: 3, colspan: 2} // Final position after spanning
			]
		];
		test.each(cases)(
			'%s => Existing component position: %s; Spanned component position: %s; Spanning: %d %s; expected => Conflict: %s; Final position: %s',
			(caseDesc, existingPosition, spannedPosition, spanning, direction, shouldThrow, expectedPosition) => {
				console.info(caseDesc);
				// Arrange
				const form = service.getEmptyMediaForm(Media.Large);
				const existingComponent: DynamicFormComponent = {
					id: 'ExistingId',
					componentReferenceId: 'some.id.ExistingId',
					position: existingPosition,
					text: 'SomeText'
				};
				const spannedComponent: DynamicFormComponent = {
					id: 'SpanId',
					componentReferenceId: 'some.id.SpanId',
					position: spannedPosition,
					text: 'SomeText'
				};
				form.components.push(existingComponent, spannedComponent);

				// Act / Assert
				const act = () => service.spanComponent(form, spannedComponent, spanning, direction);

				// Assert
				if (shouldThrow) {
					expect(act).toThrowError('A component cannot be spanned in an already taken position');
				} else {
					expect(act).not.toThrowError();
					expect(spannedComponent.position).toEqual(expectedPosition!);
				}
			}
		);
	});

	describe('removeComponent', () => {
		it('should remove component form when called', () => {
			// Arrange
			const form = service.getEmptyMediaForm(Media.Large);
			const c1: DynamicFormComponent = {
				id: 'c1',
				componentReferenceId: 'some.component.ref.id',
				position: {row: 1, col: 1},
				text: 'SomeText'
			};
			const c2: DynamicFormComponent = {
				id: 'c2',
				componentReferenceId: 'some.component.ref.id',
				position: {row: 2, col: 2},
				text: 'SomeText'
			};
			form.components.push(c1, c2);

			// Act
			service.removeComponent(form, c2);

			// Assert
			expect(form.components.length).toBe(1);
			expect(form.components.find(c => c.id === c1.id)).toBeDefined();
			expect(form.components.find(c => c.id === c2.id)).toBeUndefined();
		});

		it('should do nothing when component is not in form', () => {
			// Arrange
			const form = service.getEmptyMediaForm(Media.Large);
			const c1: DynamicFormComponent = {
				id: 'c1',
				componentReferenceId: 'some.component.ref.id',
				position: {row: 1, col: 1},
				text: 'SomeText'
			};
			const c2: DynamicFormComponent = {
				id: 'c2',
				componentReferenceId: 'some.component.ref.id',
				position: {row: 2, col: 2},
				text: 'SomeText'
			};
			const c3: DynamicFormComponent = {
				id: 'c3',
				componentReferenceId: 'some.component.ref.id',
				position: {row: 2, col: 2},
				text: 'SomeText'
			};
			form.components.push(c1, c2);

			// Act
			service.removeComponent(form, c3);

			// Assert
			expect(form.components.length).toBe(2);
			expect(form.components.find(c => c.id === c1.id)).toBeDefined();
			expect(form.components.find(c => c.id === c2.id)).toBeDefined();
		});
	});

	describe('gridChanged$', () => {
		it('should be triggered when addComponentAtPosition successfully executed', fakeAsync(() => {
			// Arrange
			const form = service.getEmptyMediaForm(Media.Large);
			const existingComponent: DynamicFormComponent = {
				id: 'ExistingId',
				componentReferenceId: 'some.component.ref.id',
				position: {row: 1, col: 1, rowspan: 1, colspan: 1},
				text: 'SomeText'
			};
			const addedComponent: DynamicFormComponent = {
				id: 'SpanId',
				componentReferenceId: 'some.component.ref.id',
				position: {row: 3, col: 3, colspan: 1, rowspan: 1},
				text: 'SomeText'
			};
			form.components.push(existingComponent);

			// Act
			let gridChangedEmitted = false;
			service.gridChanged$.subscribe(() => (gridChangedEmitted = true));
			service.addComponentAtPosition(form, addedComponent, 5, 5);
			tick(100);

			// Assert
			expect(gridChangedEmitted).toBe(true);
		}));

		it('should be triggered when moveComponentByIdAtPosition successfully executed', fakeAsync(() => {
			// Arrange
			const form = service.getEmptyMediaForm(Media.Large);
			const existingComponent: DynamicFormComponent = {
				id: 'ExistingId',
				componentReferenceId: 'some.component.ref.id',
				position: {row: 1, col: 1, rowspan: 1, colspan: 1},
				text: 'SomeText'
			};
			const movedComponent: DynamicFormComponent = {
				id: 'SpanId',
				componentReferenceId: 'some.component.ref.id',
				position: {row: 3, col: 3, colspan: 1, rowspan: 1},
				text: 'SomeText'
			};
			form.components.push(existingComponent, movedComponent);

			// Act
			let gridChangedEmitted = false;
			service.gridChanged$.subscribe(() => (gridChangedEmitted = true));
			service.moveComponentByIdAtPosition(form, movedComponent.id, 5, 5);
			tick(100);

			// Assert
			expect(gridChangedEmitted).toBe(true);
		}));

		it('should not be triggered when moveComponentByIdAtPosition successfully executed but moved in same position', fakeAsync(() => {
			// Arrange
			const form = service.getEmptyMediaForm(Media.Large);
			const existingComponent: DynamicFormComponent = {
				id: 'ExistingId',
				componentReferenceId: 'some.component.ref.id',
				position: {row: 1, col: 1, rowspan: 1, colspan: 1},
				text: 'SomeText'
			};
			const movedComponent: DynamicFormComponent = {
				id: 'SpanId',
				componentReferenceId: 'some.component.ref.id',
				position: {row: 3, col: 3, colspan: 1, rowspan: 1},
				text: 'SomeText'
			};
			form.components.push(existingComponent, movedComponent);

			// Act
			let gridChangedEmitted = false;
			service.gridChanged$.subscribe(() => (gridChangedEmitted = true));
			service.moveComponentByIdAtPosition(form, movedComponent.id, 3, 3);
			tick(100);

			// Assert
			expect(gridChangedEmitted).toBe(false);
		}));

		it('should be triggered when spanComponent successfully executed', fakeAsync(() => {
			// Arrange
			const form = service.getEmptyMediaForm(Media.Large);
			const existingComponent: DynamicFormComponent = {
				id: 'ExistingId',
				componentReferenceId: 'some.component.ref.id',
				position: {row: 1, col: 1, rowspan: 1, colspan: 1},
				text: 'SomeText'
			};
			const spannedComponent: DynamicFormComponent = {
				id: 'SpanId',
				componentReferenceId: 'some.component.ref.id',
				position: {row: 3, col: 3, colspan: 1, rowspan: 1},
				text: 'SomeText'
			};
			form.components.push(existingComponent, spannedComponent);

			// Act
			let gridChangedEmitted = false;
			service.gridChanged$.subscribe(() => (gridChangedEmitted = true));
			service.spanComponent(form, spannedComponent, 5, 'up');
			tick(100);

			// Assert
			expect(gridChangedEmitted).toBe(true);
		}));

		it("should not be triggered when spanComponent successfully executed but position didn't changed", fakeAsync(() => {
			// Arrange
			const form = service.getEmptyMediaForm(Media.Large);
			const existingComponent: DynamicFormComponent = {
				id: 'ExistingId',
				componentReferenceId: 'some.component.ref.id',
				position: {row: 1, col: 1, rowspan: 1, colspan: 1},
				text: 'SomeText'
			};
			const spannedComponent: DynamicFormComponent = {
				id: 'SpanId',
				componentReferenceId: 'some.component.ref.id',
				position: {row: 3, col: 3, colspan: 1, rowspan: 1},
				text: 'SomeText'
			};
			form.components.push(existingComponent, spannedComponent);

			// Act
			let gridChangedEmitted = false;
			service.gridChanged$.subscribe(() => (gridChangedEmitted = true));
			service.spanComponent(form, spannedComponent, 0, 'up');
			tick(100);

			// Assert
			expect(gridChangedEmitted).toBe(false);
		}));

		it('should be triggered when changeComponentSpan successfully executed', fakeAsync(() => {
			// Arrange
			const form = service.getEmptyMediaForm(Media.Large);
			const c1: DynamicFormComponent = {
				id: 'c1',
				componentReferenceId: 'some.component.ref.id',
				position: {row: 1, col: 1},
				text: 'SomeText'
			};
			const c2: DynamicFormComponent = {
				id: 'c2',
				componentReferenceId: 'some.component.ref.id',
				position: {row: 2, col: 2},
				text: 'SomeText'
			};
			form.components.push(c1, c2);

			// Act
			let gridChangedEmitted = false;
			service.gridChanged$.subscribe(() => (gridChangedEmitted = true));
			service.removeComponent(form, c2);
			tick(100);

			// Assert
			expect(gridChangedEmitted).toBe(true);
		}));

		it("should not be triggered when changeComponentSpan successfully executed but position didn't changed", fakeAsync(() => {
			// Arrange
			const form = service.getEmptyMediaForm(Media.Large);
			const c1: DynamicFormComponent = {
				id: 'c1',
				componentReferenceId: 'some.component.ref.id',
				position: {row: 1, col: 1},
				text: 'SomeText'
			};
			const c2: DynamicFormComponent = {
				id: 'c2',
				componentReferenceId: 'some.component.ref.id',
				position: {row: 2, col: 2},
				text: 'SomeText'
			};
			const c3: DynamicFormComponent = {
				id: 'c3',
				componentReferenceId: 'some.component.ref.id',
				position: {row: 2, col: 2},
				text: 'SomeText'
			};
			form.components.push(c1, c2);

			// Act
			let gridChangedEmitted = false;
			service.gridChanged$.subscribe(() => (gridChangedEmitted = true));
			service.removeComponent(form, c3);
			tick(100);

			// Assert
			expect(gridChangedEmitted).toBe(false);
		}));
	});

	describe('getMaxRows', () => {
		const cases: [number, Media, DynamicFormComponentPosition[]][] = [
			[0, Media.Large, []],
			[1, Media.Large, [{row: 1, col: 1}]],
			[1, Media.Large, [{row: 1, col: 4}]],
			[2, Media.Large, [{row: 2, col: 1}]],
			[1, Media.Medium, [{row: 1, col: 1}]],
			[1, Media.Medium, [{row: 1, col: 4}]],
			[2, Media.Medium, [{row: 2, col: 1}]],
			[1, Media.Small, [{row: 1, col: 1}]],
			[1, Media.Small, [{row: 1, col: 4}]],
			[2, Media.Small, [{row: 2, col: 1}]],
			[4, Media.Large, [{row: 1, col: 1, rowspan: 4, colspan: 5}]],
			[
				20,
				Media.Large,
				[
					{row: 1, col: 1, rowspan: 4, colspan: 5},
					{row: 17, col: 1, rowspan: 4, colspan: 5}
				]
			]
		];
		test.each(cases)('should return %d when components for media "%s" has positions %j', (expected, media, positions) => {
			// Arrange
			const form = service.getEmptyMediaForm(media);
			positions.forEach(position => {
				const component: DynamicFormComponent = {
					id: 'ExistingId',
					componentReferenceId: 'some.component.ref.id',
					position,
					text: 'SomeText'
				};
				form.components.push(component);
			});

			// Act
			const result = service.getMaxRows(form);

			// Assert
			expect(result).toBe(expected);
		});
	});

	describe('isOutOfGrid', () => {
		const cases: [boolean, DynamicFormComponentPosition, number][] = [
			[true, {row: -1, col: 1}, 12],
			[true, {row: 1, col: -1}, 12],
			[true, {row: -1, col: -1}, 12],
			[false, {row: 1, col: 1}, 12],
			[false, {row: 13, col: 1}, 12],
			[true, {row: 1, col: 4, colspan: 13}, 12],
			[false, {row: 1, col: 1, rowspan: 100}, 12],
			[false, {row: 1, col: 12}, 12],
			[true, {row: 1, col: 13}, 12],
			[false, {row: 1, col: 1, colspan: 5}, 5],
			[false, {row: 1, col: 1, colspan: 5}, 6]
		];
		test.each(cases)('should return %s when components has positions %j and grid has %d columns', (expected, position, gridColWidth) => {
			// Act
			const result = service.isOutOfGrid(position, gridColWidth);

			// Assert
			expect(result).toBe(expected);
		});
	});
});
