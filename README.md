# Develop

This documentation explain how to develop libraries for ng-dynamic-form.

# Demo project

To be able to test the library, a demo project that use library(ies) 
and show a form builder and renderer.

The goal of this demo is to demonstrate how to use it and allow to 
debug library. 

# Debug library

All following tips comes from 
* https://dev.to/sumitparakh/how-to-make-angular-app-watch-for-changes-in-angular-library-and-update-itself-2j79
* https://medium.com/@joosep.parts/create-an-angular-14-library-use-it-locally-when-developing-and-publish-the-package-to-npm-689ca2efdea8

## Initially

Initially you must build the library and link it in your global libraries.

For that goto the library directory and:

```shell
ng build ng-dynamic-form
npm link
```

## Daily working

Then in daily working, tTo debug library, launch the 
`build-watch:ng-dynamic-form` npm script in `ng-dynamic-form/package.json`.

```shell
npm run build-watch:ng-dynamic-form
```

Then start the demo as usually from directory `ng-dynamic-form-demo`

```shell
npm run start:demo
```
