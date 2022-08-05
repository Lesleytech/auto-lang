# Auto Lang

Generate translation files for multiple languages.

Write once for a single language and automatically get translated json files for others.
## Installation
### Using npm
    $ npm install auto-lang
### Using yarn
    $ yarn add auto-lang

## Usage
Run `auto-lang [options]`

### Options

    -V, --version          output the version number
    -f, --from <lang>      language to translate from
    -t, --to <lang...>     languages to translate to (seperated by space)
    -d, --dir <directory>  directory containing the language files (default: "translations")
    -g, --gen-type <lang>  generate types from language file
    -h, --help             display help for command