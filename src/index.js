#!/usr/bin/env node

import path from 'path';
import { promises as fs } from 'fs';
import { existsSync } from 'fs';
import { Command } from 'commander';
import chalk from 'chalk';
import { exit } from 'process';
import { createSpinner } from 'nanospinner';
import translate from 'translate';
import { Logger } from './utils/Logger.mjs';
import JsonToTS from 'json-to-ts';
import prettier from 'prettier';

const program = new Command();
const nodeMajVer = parseInt(process.version.substring(1).split('.')[0]);

if (nodeMajVer < 14) {
  Logger.error(`Node version >= 14.x.x is required`);

  exit(1);
}

program
  .name('auto-lang')
  .description('Generate translation files for multiple languages')
  .version('1.0.0')
  .requiredOption('-f, --from <lang>', 'language to translate from')
  .requiredOption(
    '-t, --to <lang...>',
    'Languages to translate to (Seperated by space)'
  )
  .parse();

const { from, to } = program.opts();

const inputFile = path.join(process.cwd(), 'translations', `${from}.json`);

if (!existsSync(inputFile)) {
  Logger.error(`File 'translations/${from}.json' not found`);
  exit(1);
}

async function makeTranslatedCopy(obj1, obj2, options) {
  for (let [key, value] of Object.entries(obj1)) {
    if (typeof value === 'object') {
      obj2[key] = {};
      await makeTranslatedCopy(value, obj2[key], options);
    } else {
      obj2[key] = await translate(value, { from, to: options.to });
    }
  }
}

const getTranslation = (inputJson, language) =>
  new Promise(async (resolve, reject) => {
    const translatedObj = {};

    await makeTranslatedCopy(inputJson, translatedObj, { to: language });

    resolve(JSON.stringify(translatedObj, null, 4));
  });

async function createDeclarationFile(json) {
  const spinner = createSpinner('Creating typescript declaration file').start();

  const interfaces = JsonToTS(json, { rootName: 'GlobalTranslation' });
  const typesDir = path.join(process.cwd(), 'translations', 'types');

  if (!existsSync(typesDir)) {
    fs.mkdir(typesDir);
  }

  const declarationFile = path.join(typesDir, 'index.d.ts');

  const result = `
    /* eslint-disable no-var */

    declare global {
      ${interfaces[0]}\n\n
    }

    ${interfaces.slice(1).join('\n\n')}

    export {};
  `;

  const formattedResult = prettier.format(result, { parser: 'typescript' });

  fs.writeFile(declarationFile, formattedResult);
  spinner.success({ text: 'TS declaration file created' });
}

async function translateFile(inputFile) {
  const inputJson = JSON.parse(
    await fs.readFile(inputFile, { encoding: 'utf-8' })
  );
  let spinner, langFile, tranlatedJson;

  return inputJson;
  for (let lang of to) {
    langFile = path.join(process.cwd(), 'translations', `${lang}.json`);
    spinner = createSpinner(`Translating to ${lang}...`).start();

    tranlatedJson = await getTranslation(inputJson, lang);
    // await sleep(1000);
    await fs.writeFile(langFile, tranlatedJson);

    spinner.success({ text: `Complete` });
  }
}

const json = await translateFile(inputFile);
await createDeclarationFile(json);
