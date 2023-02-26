# Instructions to run automated tests locally

Make sure that prerequisites defined in [installation instructions](documentation/installation_instructions-md) are met

## Backend tests

```shell
~/server$ npm run test
```

## E2E-tests

1. Start the server in test mode:

```shell
~/server$ npm run start:test
```

2. Start the React app:

```shell
~/client$ npm start
```

3. To run the tests in visual testing tool for Cypress tests:

```shell
~/client$ npm run cypress:open
```

4. To run the tests in terminal:

```shell
~/client$ npm run test:e2e
```
