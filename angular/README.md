# Demo with Angular
This folder shows a demo for using the dictionary with
[Angular](https://angular.io/).

The prerequisites to running this demo are Node.js and npm.

## Setup
The instructions here follow the [Angular
Quickstart](https://angular.io/guide/quickstart).

Install the Angular CLI with the command
```
npm install -g @angular/cli
```

Create a new app with the command
```
ng new my-app
```

Accept the defaults. 

Create an Angular dictionary wrapper component and a dictionary service:
```
cd my-app
ng generate component chinesedict-wrapper
ng generate service chinesedict
```

Copy demo app and dictionary files 
```
cp ../app.component.ts src/app/.
cp ../app.component.html src/app/.
cp ../app.module.ts src/app/.
cp ../app.module.ts src/app/.
cp ../chinesedict.service.ts src/app/.
cp ../chinesedict-wrapper.component.ts src/app/chinesedict-wrapper/.
cp ../chinesedict-wrapper.component.html src/app/chinesedict-wrapper/.
cp ../../dist/words_all.json src/assets/.
```

Start the app
```
ng serve --open
```

=============
## Library - work in progress
Following instructions in [Library support in Angular
CLI 6](https://github.com/angular/angular-cli/wiki/stories-create-library):
```
ng generate library chineseeict-lib
```

Build the library
```
ng build chineseeict-lib
```

Install the chinesedict-js module:
```
cd my-app
npm install @alexamies/chinesedict-js
ng build @alexamies/chinesedict-js
```

Test the library
```
ng test chineseeict-lib
```