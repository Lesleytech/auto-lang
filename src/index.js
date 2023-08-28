#!/usr/bin/env node

import path from 'path';
import {existsSync, promises as fs} from 'fs';
import {Command} from 'commander';
import {createSpinner} from 'nanospinner';
import translate from 'translate';
import JsonToTS from 'json-to-ts';
import prettier from 'prettier';

import pJson from '../package.json' assert { type: "json" };
import {Logger} from './utils/Logger.mjs';
import {validateOptions} from './utils/validation.mjs';

const {version: appVersion} = pJson;


const program = new Command();
const nodeMajVer = parseInt(process.version.substring(1).split('.')[0]);

if (nodeMajVer < 14) {
  Logger.error(`Node version >= 14.x.x is required`);

  process.exit(1);
}

program
  .name('auto-lang')
  .description('Generate translation files for multiple languages (i18n)')
  .version(appVersion)
  .option('-f, --from <lang>', 'language to translate from')
  .option(
    '-t, --to <lang...>',
    'languages to translate to (seperated by space)'
  )
  .option(
    '-d, --dir <directory>',
    'directory containing the language files',
    'translations'
  )
  .option('-s, --skip-existing', 'skip existing keys during translation')
  .option('-g, --gen-type <lang>', 'generate types from language file')
  .parse();

const { from, to, genType, inputFile, genTypeFile, dir, skipExisting } = validateOptions(
  program.opts()
);

const inputJson = JSON.parse(
  await fs.readFile(from ? inputFile : genTypeFile, { encoding: 'utf-8' })
);

async function makeTranslatedCopy(obj1, obj2, options) {
  for (let [key, value] of Object.entries(obj1)) {
    if (typeof value === 'object') {
      obj2[key] = obj2[key] || {};
      await makeTranslatedCopy(value, obj2[key], options);
    } else {
      try {
        if(!(obj2[key] && skipExisting)) obj2[key] = await translate(value, { from, to: options.to });
      } catch (err) {
        console.log('\n');
        Logger.error(err.message);
        process.exit(1);
      }
    }
  }
}

const getTranslation = (language) =>
  new Promise(async (resolve, reject) => {
    let translatedObj = {};
    const outputFile = path.join(process.cwd(), dir, `${language}.json`);

    if(existsSync(outputFile)) {
      translatedObj = JSON.parse(
          await fs.readFile(outputFile, { encoding: 'utf-8' })
      );
    }

    await makeTranslatedCopy(inputJson, translatedObj, { to: language });

    resolve(JSON.stringify(translatedObj, null, 4));
  });

async function createDeclarationFile() {
  const spinner = createSpinner('Creating language type file').start();

  const interfaces = JsonToTS(inputJson, { rootName: 'GlobalTranslationType' });
  const typesDir = path.join(process.cwd(), dir, 'types');

  if (!existsSync(typesDir)) {
    fs.mkdir(typesDir);
  }

  const declarationFile = path.join(typesDir, 'index.ts');

  const result = `
    type NestedKeyOf<ObjectType extends object> = {
    [Key in keyof ObjectType & string]: ObjectType[Key] extends object
      ? // @ts-ignore
        \`$\{Key}.$\{NestedKeyOf<ObjectType[Key]>}\`
      : \`$\{Key}\`
    }[keyof ObjectType & string]

    export type GlobalTranslation = NestedKeyOf<GlobalTranslationType>;
    
    ${interfaces.join('\n\n')}
  `;

  const formattedResult = prettier.format(result, { parser: 'typescript' });

  fs.writeFile(declarationFile, formattedResult);
  spinner.success({ text: 'Language type file created' });
}

async function translateFile() {
  let spinner, langFile, tranlatedJson;

  for (let lang of to) {
    langFile = path.join(process.cwd(), dir, `${lang}.json`);
    spinner = createSpinner(`Translating to ${lang}...`).start();

    tranlatedJson = await getTranslation(lang);
    // await sleep(1000);
    await fs.writeFile(langFile, tranlatedJson);

    spinner.success({ text: `Complete` });
  }
}

if (from && to) {
  await translateFile();
}

if (genType) {
  await createDeclarationFile();
}
