# EspiApp
 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


docker-compose up --build -d

## For DevMode:

## run hasura console
hasura console
## check migration status 
hasura migrate status --database-name="default"
## apply all new
hasura migrate apply --type up --database-name="default"
## apply one
hasura migrate apply --type up --database-name="default" --version 1624619288822
## after all
hasura metadata apply 
## Types generator
npm run watch-types / yarn watch-types

## Test with Carma
# all:
ng test --code-coverage --watch=false --browsers=ChromeHeadless
# single:
ng test --include src/app/auth/login/login.component.spec.ts --code-coverage

