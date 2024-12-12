# Auto Lang

Generate translation files for multiple languages.

Write once for a single language and automatically get translated json files for others.

**NEW**: Show the difference between two translation files.

## Installation
### Using npm
    $ npm install auto-lang
### Using yarn
    $ yarn add auto-lang

## Usage
You could either install the package and add a script to `package.json` or use the `npx` command directly from the terminal.

### 1. Using the `npx` command
    $ npx auto-lang [options]

### 2. Using a script in `package.json`
```json
{
    "scripts": {
        "gen-lang": "auto-lang [options]"
    }
}
```

Now, in the terminal run:

    $ npm run gen-lang

Or, using yarn:

    $ yarn gen-lang

**Note:** You can give your script any name you wish. Also, replace `[options]` with any of the options below.

#### Options

```
  -V, --version          output the version number
  -f, --from <lang>      language to translate from
  -t, --to <lang...>     languages to translate to (seperated by space)
  -d, --dir <directory>  directory containing the language files (default: "translations")
  -s, --skip-existing    skip existing keys during translation
  -g, --gen-type <lang>  generate types from language file
  -d, --diff <lang...>   show missing keys between two language files
  -h, --help             display help for command
```

**Note:** `<lang>` must be a valid [ISO 639-1 language code](https://localizely.com/iso-639-1-list/).

### Examples

These examples  assume there's a folder `translations` in the root directory the command is executed.

You can also pass `--dir <directory>` to change the folder that contains your language `json` files.

There is a file `en.json` in the translations folder

```json
{
  "GENERAL": {
    "OK": "OK",
    "CANCEL": "Cancel",
    "ACCEPT": "Accept",
    "DECLINE": "Decline"
  },
  "GREETINGS": {
    "HELLO": "Hello",
    "HI": "Hi",
    "GOOD_MORNING": "Good morning"
  }
}
```
Get translation files for French (fr) and Spanish (es).

    $ npx auto-lang --from en --to fr es

Two files have been created; `fr.json` and `es.json` in the `translations` folder.

    +-- root
    |   +-- translations
    |   |   +-- en.json
    |   |   +-- fr.json
    |   |   +-- es.json

```json
/* fr.json */

{
  "GENERAL": {
    "OK": "D'ACCORD",
    "CANCEL": "Annuler",
    "ACCEPT": "Accepter",
    "DECLINE": "Déclin"
  },
  "GREETINGS": {
    "HELLO": "Bonjour",
    "HI": "Salut",
    "GOOD_MORNING": "Bonjour"
  }
}
```

```json
/* es.json */

{
  "GENERAL": {
    "OK": "OK",
    "CANCEL": "Cancelar",
    "ACCEPT": "Aceptar",
    "DECLINE": "Rechazar"
  },
  "GREETINGS": {
    "HELLO": "Hola",
    "HI": "Hola",
    "GOOD_MORNING": "Buenos dias"
  }
}
```

If you use typescript in your project, you can generate a typescript file to use in your code.

    $ npx auto-lang --gen-type en

This will generate a `GlobalTranslation` type based on the structure of the `translations/en.json` file.

    +-- root
    |   +-- translations
    |   |   +-- types
    |   |   |   +-- index.ts
    |   |   +-- en.json
    |   |   +-- fr.json
    |   |   +-- es.json

```ts
/* translations/types/index.ts */

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & string]: ObjectType[Key] extends object
    ? // @ts-ignore
      `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & string];

export type GlobalTranslation = NestedKeyOf<GlobalTranslationType>;

interface GlobalTranslationType {
  GENERAL: GENERAL;
  GREETINGS: GREETINGS;
}

interface GREETINGS {
  HELLO: string;
  HI: string;
  GOOD_MORNING: string;
}

interface GENERAL {
  OK: string;
  CANCEL: string;
  ACCEPT: string;
  DECLINE: string;
}

```

Now you should be able to use `GlobalTranslation` in your code.

```ts
import { GlobalTranslation } from './translations/types';

const translate = (key: GlobalTranslation) => {
  // your code
};

translate('GENERAL.ACCEPT'); // Intellisense and type check from GlobalTranslation

```
