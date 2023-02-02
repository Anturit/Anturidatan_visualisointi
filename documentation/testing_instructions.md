# Testing instructions

In /server/.env set the value of variable:
* TEST_MONGODB_URI to be the URL of the database used for testing
* PORT to be the port used by the server
* SECRET to be any secret string

## Backend tests

1. In /server to run the tests:

```bash
npm run test
```

## E2E-tests

1. In /server start the server in test mode:

```bash
npm run start:test
```

2. In /client start the React app:

```bash
npm start
```

3. To run the tests in visual testing tool for Cypress tests:

```bash
npm run cypress:open
```

4. To run the tests in terminal:

```bash
npm run test:e2e
```
