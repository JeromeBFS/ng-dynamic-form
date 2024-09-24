import { Component, Input, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import {
	DynamicFormService,
	GRID_STYLE_GAP_MARGIN,
	GridDirection,
	GridElement
} from "../../../services/dynamic-form.service";
import { FormComponentEmptyComponent } from "../form-component-empty/form-component-empty.component";
import {
	DynamicFormComponent,
	DynamicFormComponentPosition,
	DynamicFormComposition
} from "../../../models/dynamic-form";
import { AsyncPipe, NgStyle } from "@angular/common";
import { map, Observable } from "rxjs";
import { CdkDrag } from "@angular/cdk/drag-drop";
import { MemoryStorageService } from "../../../services/memory-storage.service";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";
import { RenderingMode } from "../../../shared/enums/rendering-mode";
import { FormComponentBaseComponent } from "../form-component-base/form-component-base.component";
import { ComponentProviderService } from "../../../services/component-provider.service";

const DRAG_DROP_DRAGGING_TYPE: string = 'form-builder.dragging-type';
const DRAG_DROP_COMPONENT_DATA_TYPE_NEW: string = 'form-builder.new';
const DRAG_DROP_COMPONENT_DATA_TYPE_MOVE: string = 'form-builder.move';
const DRAG_DROP_COMPONENT_DATA_TYPE_SPAN: string = 'form-builder.span';
const DRAG_DROP_COMPONENT_DATA_TYPE_LAST_CELL: string = 'form-builder.last-cell';
const DRAG_DROP_SPANNED_COMPONENT: string = 'form-builder.spanned-component';
const DRAG_DROP_SPAN_DIRECTION: string = 'form-builder.span-direction';

@Component({
	selector: 'ndf-form-component[element],app-form-component[form]',
	templateUrl: './form-component.component.html',
	styleUrl: './form-component.component.scss',
	imports: [FormComponentEmptyComponent, NgStyle, AsyncPipe, CdkDrag, MatIcon, MatIconButton],
	standalone: true
})
export class FormComponentComponent implements OnInit {
	get element(): GridElement {
		return this._element;
	}

	@Input() set element(value: GridElement) {
		this._element = value;
		this.createComponent(value)
	}
	@Input() form!: DynamicFormComposition;
	@Input() isTool = false;

	/**
	 * The mode how to render the component. If 'build' the user can select the component
	 * and chang his properties. If RenderingMode.Render, the user can set data in field.
	 *
	 * @type {RenderingMode}
	 * @default RenderingMode.Render
	 */
	@Input() mode: RenderingMode = RenderingMode.Render;

	@ViewChild('componentContainer', {read: ViewContainerRef}) set componentContainer(value: ViewContainerRef) {
		this._componentContainer = value;
		this.createComponent(this._element)
	}

	private _componentContainer?: ViewContainerRef;
	private _componentCreated = false;

	protected isSelected$: Observable<boolean> = this.dynamicFormService.selectedId$.pipe(
		map(id => !!id && id === (this._element.component?.id ?? this._element.id))
	);
	protected dropAllowed = false;
	protected cellBaseStyle: {[key: string]: string} = {};
	protected cellSelectedBaseStyle: {[key: string]: string} = {};

	private _element!: GridElement;

	constructor(
		private readonly dynamicFormService: DynamicFormService,
		private readonly componentProviderService: ComponentProviderService,
		private readonly memoryStorageService: MemoryStorageService
	) {}

	ngOnInit(): void {
		this.cellBaseStyle = this.mode === 'build' ? {padding: GRID_STYLE_GAP_MARGIN} : {padding: `0 ${GRID_STYLE_GAP_MARGIN}`};
		this.cellSelectedBaseStyle = {margin: GRID_STYLE_GAP_MARGIN};
	}

	protected get isComponent(): boolean {
		return !!this._element.component;
	}

	protected get elementOverlayId(): string {
		return `${this._element.id}-overlay`;
	}

	protected isToolComponent(component?: DynamicFormComponent): boolean {
		return component?.position.row === 0 && component?.position.col === 0;
	}

	protected canResize(direction: GridDirection): boolean {
		return !this.dynamicFormService.hasCloseElement(this.form, this._element, direction);
	}

	protected startDrag(dragEvent: DragEvent) {
		if (this.isToolComponent(this._element.component)) {
			this.memoryStorageService.setData(DRAG_DROP_DRAGGING_TYPE, DRAG_DROP_COMPONENT_DATA_TYPE_NEW);
			this.memoryStorageService.setData(DRAG_DROP_COMPONENT_DATA_TYPE_NEW, this._element.component);
		} else {
			this.memoryStorageService.setData(DRAG_DROP_DRAGGING_TYPE, DRAG_DROP_COMPONENT_DATA_TYPE_MOVE);
			this.memoryStorageService.setData(DRAG_DROP_COMPONENT_DATA_TYPE_MOVE, this._element.id);
		}
		dragEvent.dataTransfer!.effectAllowed = this.draggingEffect();
		dragEvent.dataTransfer!.dropEffect = this.draggingEffect();
	}

	protected dragEnter(dragEvent: DragEvent) {
		dragEvent.preventDefault();
		this.cleanupLastCell();

		const draggingType = this.memoryStorageService.getData<string>(DRAG_DROP_DRAGGING_TYPE);
		switch (draggingType) {
			case DRAG_DROP_COMPONENT_DATA_TYPE_NEW:
			case DRAG_DROP_COMPONENT_DATA_TYPE_MOVE:
				this.dragComponentEnter(dragEvent);
				break;
			case DRAG_DROP_COMPONENT_DATA_TYPE_SPAN:
				this.dragSpanEnter();
				break;
		}
	}

	protected dragOver(dragEvent: DragEvent) {
		const draggingType = this.memoryStorageService.getData<string>(DRAG_DROP_DRAGGING_TYPE);
		switch (draggingType) {
			case DRAG_DROP_COMPONENT_DATA_TYPE_NEW:
			case DRAG_DROP_COMPONENT_DATA_TYPE_MOVE:
				this.dragComponentOver(dragEvent);
				break;
			case DRAG_DROP_COMPONENT_DATA_TYPE_SPAN:
				this.dragSpanOver(dragEvent);
				break;
		}
	}

	protected drop(dragEvent: DragEvent) {
		dragEvent.preventDefault();
		const draggingType = this.memoryStorageService.getData<string>(DRAG_DROP_DRAGGING_TYPE);
		switch (draggingType) {
			case DRAG_DROP_COMPONENT_DATA_TYPE_NEW:
				this.dropNewComponent();
				break;
			case DRAG_DROP_COMPONENT_DATA_TYPE_MOVE:
				this.moveComponent(this.memoryStorageService.getData<string>(DRAG_DROP_COMPONENT_DATA_TYPE_MOVE)!);
				break;
		}
		this.dropAllowed = false;
	}

	protected spanDragStart(dragEvent: DragEvent, direction: GridDirection) {
		dragEvent.stopPropagation();
		this.memoryStorageService.setData(DRAG_DROP_DRAGGING_TYPE, DRAG_DROP_COMPONENT_DATA_TYPE_SPAN);
		this.memoryStorageService.setData(DRAG_DROP_SPANNED_COMPONENT, this._element.component);
		this.memoryStorageService.setData(DRAG_DROP_SPAN_DIRECTION, direction);
	}

	protected dragSpanEnter() {
		if (!this.isComponent) {
			this.spanComponentOutside();
		}
	}

	protected dragSpanOver(dragEvent: DragEvent) {
		if (this.isComponent && this.isOverlayTarget(dragEvent)) {
			dragEvent.preventDefault();
			this.spanComponentInside(dragEvent);
		}
	}

	protected selectComponent() {
		this.dynamicFormService.setSelectedComponent(this._element.component?.id ?? this._element.id);
	}

	protected removeComponent() {
		this.dynamicFormService.removeComponent(this.form, this._element.component);
	}

	protected componentDoubleClick(mouseEvent: MouseEvent) {
		mouseEvent.stopPropagation();
		this.dynamicFormService.setSelectedComponent(this._element.component?.id ?? this._element.id, true);
	}

	private dragComponentEnter(dragEvent: DragEvent) {
		const draggingEffect = this.draggingEffect();

		if (draggingEffect === 'copy') {
			const fc = this.dynamicFormService.findComponent(this.form, this._element.row, this._element.col);
			this.dropAllowed = !fc;
		} else {
			const draggingComponentId = this.memoryStorageService.getData<string>(DRAG_DROP_COMPONENT_DATA_TYPE_MOVE)!;
			this.dropAllowed = this.isDropAllowedByComponentId(draggingComponentId, false);
		}
		dragEvent.dataTransfer!.dropEffect = this.dropAllowed ? draggingEffect : 'none';
	}

	private dragComponentOver(dragEvent: DragEvent) {
		if (this.dropAllowed) {
			dragEvent.preventDefault();
		}
	}

	private createNewComponent(component: DynamicFormComponent) {
		const addedComponent = this.dynamicFormService.addComponentAtPosition(this.form, component, this._element.row, this._element.col);
		this._element.id = addedComponent.id;
		this._element.component = addedComponent;
		this.dynamicFormService.setSelectedComponent(addedComponent.id);
	}

	private moveComponent(id: string) {
		this.dynamicFormService.moveComponentByIdAtPosition(this.form, id, this._element.row, this._element.col);
	}

	private draggingEffect(): 'none' | 'copy' | 'link' | 'move' {
		const draggingType = this.memoryStorageService.getData(DRAG_DROP_DRAGGING_TYPE);
		switch (draggingType) {
			case DRAG_DROP_COMPONENT_DATA_TYPE_NEW:
				return 'copy';
			case DRAG_DROP_COMPONENT_DATA_TYPE_MOVE:
				return 'move';
		}
		return 'none';
	}

	private isDropAllowedByComponentId(componentId: string, isSpanning: boolean): boolean {
		const draggingComponent = this.form.components.find(c => c.id === componentId)!;
		const hasConflict = this.dynamicFormService.hasConflictAtPosition(this.form, draggingComponent, this._element.row, this._element.col);
		const position: DynamicFormComponentPosition = {
			row: this._element.col,
			col: isSpanning ? draggingComponent.position.col : this._element.col,
			colspan: isSpanning ? this._element.col - draggingComponent.position.col + 1 : draggingComponent.position.colspan
		};
		const isOutOfGrid = this.dynamicFormService.isOutOfGrid(position, this.dynamicFormService.getGridColWidthByMedia(this.dynamicFormService.media));
		return !hasConflict && !isOutOfGrid;
	}

	private dropNewComponent() {
		const component = this.memoryStorageService.getData<DynamicFormComponent>(DRAG_DROP_COMPONENT_DATA_TYPE_NEW);
		if (component) {
			this.createNewComponent(component);
		}
	}

	private cleanupLastCell() {
		const lastCell = this.memoryStorageService.getData<FormComponentComponent>(DRAG_DROP_COMPONENT_DATA_TYPE_LAST_CELL);
		if (lastCell) {
			lastCell.dropAllowed = false;
		}
		this.memoryStorageService.setData(DRAG_DROP_COMPONENT_DATA_TYPE_LAST_CELL, this);
	}

	private calculateSpanningOutside(spannedComponent: DynamicFormComponent, direction: GridDirection): number {
		switch (direction) {
			case 'up':
				return spannedComponent.position.row - this._element.row;
			case 'down':
				return this._element.row - spannedComponent.position.row - (spannedComponent.position.rowspan ?? 1) + 1;
			case 'left':
				return spannedComponent.position.col - this._element.col;
			case 'right':
				return this._element.col - spannedComponent.position.col - (spannedComponent.position.colspan ?? 1) + 1;
		}
	}

	/**
	 * Method to span the component outside the component itself (growing).
	 *
	 * @private
	 * @returns {void}
	 */
	private spanComponentOutside(): void {
		const spannedComponent = this.memoryStorageService.getData<DynamicFormComponent>(DRAG_DROP_SPANNED_COMPONENT)!;
		this.dropAllowed = this.isDropAllowedByComponentId(spannedComponent.id, true);
		if (this.dropAllowed) {
			const spannedComponent = this.memoryStorageService.getData<DynamicFormComponent>(DRAG_DROP_SPANNED_COMPONENT)!;
			if (spannedComponent) {
				const direction = this.memoryStorageService.getData<GridDirection>(DRAG_DROP_SPAN_DIRECTION)!;
				const spanning = this.calculateSpanningOutside(spannedComponent, direction);
				this.dynamicFormService.spanComponent(this.form, spannedComponent, spanning, direction);
				this.dynamicFormService.setSelectedComponent(spannedComponent.id);
			}
		}
	}

	/**
	 * Spans the component inside the component itself (reducing size).
	 *
	 * @description
	 * This because inside the component this is only one cell and the
	 * position is the top left corner. So we have to simulate (calculate)
	 * the grid behind and deduce the cell position by calculation.
	 *
	 * @private
	 * @function spanComponentInside
	 *
	 * @returns {void} This method does not return any value.
	 */
	private spanComponentInside(dragEvent: DragEvent): void {
		// Collect values needed to calculate theoretical grid inside component
		const target = dragEvent.target as HTMLElement;
		const x = dragEvent.offsetX;
		const y = dragEvent.offsetY;
		const cellWidth = target.offsetWidth;
		const cellHeight = target.offsetHeight;
		const gridCellWidth = cellWidth / (this._element.component?.position.colspan ?? 1);
		const gridCellHeight = cellHeight / (this._element.component?.position.rowspan ?? 1);
		// Calculate position of mouse in the theoretical grid
		const mouseRow = Math.floor(y / gridCellHeight) + 1;
		const mouseCol = Math.floor(x / gridCellWidth) + 1;

		// Do spanning
		const direction = this.memoryStorageService.getData<GridDirection>(DRAG_DROP_SPAN_DIRECTION)!;
		const spannedComponent = this.memoryStorageService.getData<DynamicFormComponent>(DRAG_DROP_SPANNED_COMPONENT)!;
		if (spannedComponent) {
			const spanning = this.calculateSpanningInside(spannedComponent, direction, mouseRow, mouseCol);
			this.dynamicFormService.spanComponent(this.form, spannedComponent, spanning * -1, direction);
			this.dynamicFormService.setSelectedComponent(spannedComponent.id);
		}
	}

	private calculateSpanningInside(spannedComponent: DynamicFormComponent, direction: GridDirection, mouseRow: number, mouseCol: number): number {
		const rowspan = spannedComponent.position.rowspan ?? 1;
		const colspan = spannedComponent.position.colspan ?? 1;
		switch (direction) {
			case 'up':
				return mouseRow - 1;
			case 'down':
				return mouseRow < rowspan ? rowspan - mouseRow : 0;
			case 'left':
				return mouseCol - 1;
			case 'right':
				return mouseCol < colspan ? colspan - mouseCol : 0;
		}
	}

	private isOverlayTarget(dragEvent: DragEvent): boolean {
		return (dragEvent.target as HTMLElement).id === this.elementOverlayId;
	}

	private createComponent(gridElement: GridElement): void {
		if (!this._componentContainer || !gridElement.component || this._componentCreated) {
			return;
		}
		this._componentCreated = true;

		const registeredComponent = this.componentProviderService.getComponentById(gridElement.component.componentReferenceId);
		if (!registeredComponent) {
			throw new Error(`Component reference with ID '${gridElement.component.componentReferenceId}' is not registered`);
		}
		const componentRef = this._componentContainer.createComponent(registeredComponent.componentType);
		const component = componentRef.instance as FormComponentBaseComponent;
		component.element = gridElement;
		component.mode = this.mode;
	}
}
