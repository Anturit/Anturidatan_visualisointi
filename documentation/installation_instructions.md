# Asennus

## Esivaatimukset
- Käynnissä oleva MongoDB serveri-instanssi
  - esim. [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)   
- [Node.js versio 18+](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) asennettuna
-  tiedosto ```.env``` alikansioissa _/server_
   - MongoDB connection string format [guide](https://www.mongodb.com/docs/manual/reference/connection-string/) 
```
MONGODB_URI=<connection_string_for_default_mode>
TEST_MONGODB_URI=<connection_string_for_NODE_ENV=test>
SECRET=<any_secret_string>
PORT=<port_to_use>
```

- Asenna riippuvuudet kansioissa _server_ ja _client_ komennolla

```shell
~/server$ npm install
~/client$ npm install
```

## Tuotantoversion tarjoaminen

Luo frontendista tuotantoversio
```shell
~/server$ npm run build:ui
```

Käynnistä serveri ja tarjoa frontend .env tiedostossa määritellystä portista
```shell
~/server$ npm start
```

## Kehittäminen
Listaa kaikki käytettävissä olevat komennot ja niiden ohjeet:
```shell
~/server$ npm run
~/client$ npm run
```
### Toimiva yhdistelmä kehityksen aikana käyttäen testitietokantaa
Käynnistä backend
```shell
~/server$ npm run dev
```

Käynnistä frontend
```shell
~/client$ npm run dev:test
```

