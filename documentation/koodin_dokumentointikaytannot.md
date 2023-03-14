# Koodin dokumentointikäytännöt

* Kommentoidaan koodi [JSDOC](https://jsdoc.app/) -käytäntöjen mukaisesti.
* Dokumentointi tehdään suoraan lähdekoodiin.
* Kommentoinnin tarkoitus on selventää, **mitä** koodi tekee ja **miksi**.
  * Kertooko funktion nimi **mitä** se tekee?
    * Jos ei -> Pitäisikö funktio pilkkoa pienempii osiin?

### Esimerkki JSDOC dokumentaatiosta

```
/**
 * This is a function.
 *
 * @param {string} n - A string param
 * @param {string} [o] - A optional string param
 * @param {string} [d=DefaultValue] - A optional string param
 * @return {string} A good string
 *
 * @example
 *
 *     foo('hello')
 */

function foo(n, o, d) {
  return n
}
```