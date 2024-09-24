# Table of content

<!-- TOC -->
* [Table of content](#table-of-content)
* [DynamicForm](#dynamicform)
  * [Form builder](#form-builder)
  * [Form renderer](#form-renderer)
  * [Grid](#grid)
    * [Responsibility](#responsibility)
* [Development](#development)
  * [Architecture](#architecture)
  * [Unit tests](#unit-tests)
  * [Components](#components)
    * [Create new component](#create-new-component)
    * [Activate component in tools](#activate-component-in-tools)
    * [Expose component properties in builder (settings)](#expose-component-properties-in-builder-settings)
      * [Existing property components](#existing-property-components)
      * [Implement new property component](#implement-new-property-component)
  * [Form metadata JSON schema](#form-metadata-json-schema)
    * [Model generation](#model-generation)
      * [Generation tool](#generation-tool)
      * [Generate models](#generate-models)
    * [Best practices](#best-practices)
      * [Interface naming](#interface-naming)
<!-- TOC -->

# DynamicForm

The goal of DynamicForm is to be able to create forms dynamically (form builder), and then
expose it to a final user who must enter the requested data (form renderer).

The form builder should [ng-dynamic-form.component.spec.ts](..%2F..%2F..%2Fng-dynamic-form%2Fng-dynamic-form%2Fprojects%2Fng-dynamic-form%2Fsrc%2Flib%2Fng-dynamic-form.component.spec.ts)generate JSON metadata and form renderer should 
generate JSON data that final user enter in rendered form.

The form has been designed as grid placeholders. The components could be placed in 
a grid and could span over multiple grid cells.

Also, forms should be responsive.

## Form builder

The form builder should allow to place components in the grid. These components are placed by drag and drop.

Then user can change settings of each component.

The form builder produce a JSON that contains metadata description of built form.
The structure of this JSON is described in a JSON schema that you can find in 
directory `src/app/shared/schema` (see [Form metadata JSON schema](#form-metadata-json-schema)).

## Form renderer

The form renderer render responsively the form according screen size. In fact,
it uses the same component as form builder (the `FormGridComponent`) but
don't show the grid cells, don't allow to select components and allow to set 
focus in inputs.

The form renderer dynamically generate JSON data using variable names. 

Remark: the design of variable and validation still is under discussion. To update when implemented.

## Grid

The grid is the core of form. It's common to builder and renderer. This
to simplify changes and to avoid to modify code in several places.

Also if new components are developed, the grid will include it 
automatically (see [Components](#components)).

### Responsibility

The generated forms should be responsive. The choice has been ported to three sizes:
* Desktop (12 columns)
* Tablet (8 columns)
* Mobile (4 columns)

A form for each size should be built.

The breaking points of screen width are managed by the `@angular/cdk/layout/BreakpointObserver`.
See `FormRendererComponent` for more details.

# Development

This part of documentation will explain some architectural point and how to add new components.

## Architecture

All visual components classified in directories:
* `src/app/`
  * `components/`
    * `form-builder/`: This directory contains the frame for the builder display.
      * `form-builder-component-properties/`: Contains all the components used to 
      edit component property value. 
    * `form-renderer`: This directory contains the frame for the renderer display.
    * `form-grid`: Contains the core to display the form itself, for builder or renderer.
    * `form-components`: Contains implementation of all available components for builder or renderer.
  * `services`
    * `dynamic-form.service.ts`: This service is the core of form handling.

## Unit tests

Especially if you modify `dynamic-form.service.ts`, please do unit tests for your changes. 
Ths service is almost fully tested and should stay tested.

## Components

The components has been designed to be scalable and developed once both for builder 
and renderer. 

### Create new component

If you need a new component, add new Angular component in `src/app/components/form-components`
and implement it as you need.

Then you must ensure it's available in tools and his properties are accessibles.

### Activate component in tools

To make component visible in the tools list on builder, just add it in the array of
DynamicFormComponent in file 
`src/app/components/form-builder/form-builder-tools/form-builder-tools.component.ts`.

```typescript
protected visibleComponents: DynamicFormComponent[] = [
	{
		id: 'demo-text',
		component: ComponentType.Text,
		position: {row: 0, col: 0},
		text: {de: 'Text', fr: 'Texte', it: 'Testo', en: 'Text'} as MultilingualStringDefinition,
		textStyle: TextStyle.Normal
	},
	{
		id: 'demo-input',
		component: ComponentType.Input,
		position: {row: 0, col: 0},
		label: {de: 'Eingabe', fr: 'Saisie', it: 'Ingresso', en: 'Input'} as MultilingualStringDefinition,
		type: Type.String
	}
	// Here add new components
];
```
### Expose component properties in builder (settings)

Each component should expose his specific properties. Some properties are
common (such as id or component position).

For each component you must tell to system witch properties has the component.
For that you have to:
1. Fill new array with properties in file `src/app/components/form-builder/form-builder-component-properties/form-builder-component-properties.component.ts`
```typescript
// Components properties
const componentsProperties: ComponentProperties[] = [
	{
		componentType: ComponentType.Text,
		properties: [
			...commonProperties,
			{id: 'text.text', name: 'text', order: 10},
			{id: 'text.style', name: 'textStyle', order: 20}
		]
	},
	{
		componentType: ComponentType.Input,
		properties: [
			...commonValueProperties,
			{id: 'input.label', name: 'label', order: 10},
			{id: 'input.placeholder', name: 'placeholder', order: 20},
			{id: 'input.type', name: 'type', order: 30}
		]
	}
];
// Here new component properties
```
2. If there is no existing component (see [Existing property components](#existing-property-components)) that can handle the data of your property, 
you have to implement it.

#### Existing property components

* `FormBuilderPropertyMultilingualTextComponent`: this property component 
allow to enter multilingual texts (DE, FR, IT or EN), for example for label.

#### Implement new property component

To implement new property component, add new component in 
`src/app/components/form-builder/form-builder-component-properties` and implements
what is necessary for your business. Then [expose](#expose-component-properties-in-builder-settings)
it for needed components.

## Form metadata JSON schema

The dynamic forms are stored as JSON string.

The structure is defined in a JSON schema and could be used to validate
the JSON dynamic form data as well.

To accurate use of dynamic form structure in type script code,
the models are generated as type script interfaces.

The main schema file is `form.schema.json`.

### Model generation

#### Generation tool

To generate the models from schema, use the tool [quicktype](https://quicktype.io/).

To install quick type, use following command:

```shell
npm install -g quicktype
```

#### Generate models

To generate models open terminal in directory `src/app/shared/schema`.

Then execute following command.

```shell
quicktype -o ..\..\models\dynamic-form.ts --src-lang schema dynamic-form.schema.json
```

### Best practices

#### Interface naming

If you modify the schema, use the _"definitions"_ pattern. The interface names are
generated from definitions names. Else the names will be fun but unusable.
So the best practices are to create a schema file in most cases, as you
create a file per class...

Example of a file with definitions:

```json
{
	"$schema": "http://json-schema.org/draft-07/schema",
	"$id": "https://bfs.admin.ch/schemas/dynamic-form.schema.json",
	"description": "Defines a new type",
	"definitions": {
		"MyNewType": {
			"type": "object",
			"properties": {
				"name": {
					"type": "string",
					"description": "Name of my new type",
					"minLength": 3
				}
			}
		}
	},
}
```

This generates:

```typescript
/**
 * Defines a new type
 */
export interface MyNewType {
	/*
	 * Name of my new type
	 */
	name: DynamicForm;
	[property: string]: any;
}
```

