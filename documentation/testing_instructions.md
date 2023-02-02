# Testausohje

## Backendin testaus

...

## E2E-testaus

1. In /server/.env set the value of variable:
    - TEST_MONGODB_URI to be the URL of the database used for testing
    - PORT to be the port used by the server
    - SECRET to be any secret string

2. In /server start the server in test mode:

```bash
npm run start:test
```

3. In /client start the React app:

```bash
npm start
```

4. To run the tests:

Either open visual testing tool for Cypress tests:

```bash
npm run cypress:open
```

Or run the tests in terminal:

```bash
npm run test:e2e
```
