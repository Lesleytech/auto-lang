import { Command } from 'commander';
import path from 'path';

import {
  createDeclarationFile,
  parseJsonFile,
  showLangDiff,
  translateFile,
} from './utils/index.js';
import { validateUserInput } from './utils/validation.js';
import { store } from './utils/store.js';

async function main() {
  const pjson = await parseJsonFile(path.join(process.cwd(), 'package.json'));
  const appVersion = pjson.version;

  const program = new Command();

  program
    .name('auto-lang')
    .description('Generate translation files for multiple languages (i18n)')
    .version(appVersion)
    .option('-f, --from <lang>', 'language to translate from')
    .option(
      '-t, --to <lang...>',
      'languages to translate to (seperated by space)',
    )
    .option(
      '-d, --dir <directory>',
      'directory containing the language files',
      'translations',
    )
    .option('-s, --skip-existing', 'skip existing keys during translation')
    .option('-g, --gen-type <lang>', 'generate types from language file')
    .option(
      '-d, --diff <lang...>',
      'show missing keys between two language files',
    )
    .parse();

  validateUserInput(program.opts());
  store.setInputParams(program.opts());

  const { from, to, genType, diff } = store.getInputParams();

  if (from && to) {
    await translateFile();
  }

  if (genType) {
    await createDeclarationFile();
  }

  if (diff) {
    await showLangDiff();
  }
}

main();
