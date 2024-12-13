import path from 'path';
import { existsSync, promises as fs } from 'fs';
import { createSpinner, Spinner } from 'nanospinner';
import JsonToTS from 'json-to-ts';
import prettier from 'prettier';

import { Logger } from './logger.js';

// @ts-expect-error
import translate from 'translate';
import { TranslationObject } from '../interfaces/input-params.interface';
import { store } from './store';

async function makeTranslatedCopy(
  source: TranslationObject,
  target: TranslationObject,
  targetLang: string,
) {
  const { from, skipExisting } = store.getInputParams();

  for (let [key, value] of Object.entries(source)) {
    if (typeof value === 'object') {
      target[key] = target[key] || {};

      await makeTranslatedCopy(value, target[key], targetLang);
    } else {
      try {
        if (!(target[key] && skipExisting)) {
          target[key] = await translate(value, {
            from,
            to: targetLang,
          });
        }
      } catch (err: any) {
        console.log('\n');
        Logger.error(err.message);
        process.exit(1);
      }
    }
  }
}

const getTranslationObject = (lang: string): Promise<TranslationObject> => {
  const { dir } = store.getInputParams();

  return new Promise(async (resolve, reject) => {
    let translatedObj: TranslationObject = {};
    const inputLangObj = await getInputLangObject();

    const outputFile = path.join(process.cwd(), dir, `${lang}.json`);

    if (existsSync(outputFile)) {
      translatedObj = await parseJsonFile(outputFile);
    }

    await makeTranslatedCopy(inputLangObj, translatedObj, lang);

    resolve(translatedObj);
  });
};

export async function createDeclarationFile() {
  const { dir, genType } = store.getInputParams();
  const spinner = createSpinner('Creating language type file').start();

  const langObject = parseJsonFile(
    path.join(process.cwd(), dir, `${genType}.json`),
  );

  const interfaces = JsonToTS(langObject, {
    rootName: 'GlobalTranslationType',
  });
  const typesDir = path.join(process.cwd(), dir, 'types');

  if (!existsSync(typesDir)) {
    await fs.mkdir(typesDir);
  }

  const declarationFile = path.join(typesDir, 'index');

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

  const formattedContent = await prettier.format(result, {
    parser: 'typescript',
  });

  await fs.writeFile(declarationFile, formattedContent);

  spinner.success({ text: 'Language type file created' });
}

export async function translateFile() {
  const { to, dir } = store.getInputParams();

  let spinner: Spinner;
  let langFile: string;
  let translationObject: TranslationObject;

  for (let lang of to) {
    langFile = path.join(process.cwd(), dir, `${lang}.json`);
    spinner = createSpinner(`Translating to ${lang}...`).start();

    translationObject = await getTranslationObject(lang);

    await fs.writeFile(langFile, JSON.stringify(translationObject, null, 2));

    spinner.success({ text: `Complete` });
  }
}

export async function parseJsonFile<T = Record<string, any>>(filePath: string) {
  return JSON.parse(await fs.readFile(filePath, { encoding: 'utf-8' })) as T;
}

function getInputLangObject() {
  const { dir, from } = store.getInputParams();

  const inputFile = path.join(process.cwd(), dir, `${from}.json`);

  return parseJsonFile(inputFile);
}

function getMissingKeys(source: TranslationObject, target: TranslationObject) {
  const missingKeys: string[] = [];

  function loop(
    source: TranslationObject,
    target: TranslationObject,
    path = '',
  ) {
    for (let [key, value] of Object.entries(source)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof value === 'object') {
        if (target[key]) {
          loop(value, target[key], currentPath);
        } else {
          missingKeys.push(currentPath);
        }
      } else {
        if (!target[key]) {
          missingKeys.push(currentPath);
        }
      }
    }
  }

  loop(source, target);

  return missingKeys;
}

export async function showLangDiff() {
  const spinner = createSpinner('Comparing language files').start();

  const { dir, diff } = store.getInputParams();

  const lang1 = diff[0];
  const lang2 = diff[1];

  const lang1Object = await parseJsonFile(
    path.join(process.cwd(), dir, `${lang1}.json`),
  );
  const lang2Object = await parseJsonFile(
    path.join(process.cwd(), dir, `${lang2}.json`),
  );

  const missingKeys = getMissingKeys(lang1Object, lang2Object);

  Logger.log(`\nMissing keys in ${lang2}.json compared to ${lang1}.json\n`);
  Logger.log(missingKeys.join('\n') || 'No missing keys');

  spinner.success({ text: 'Comparison complete' });
}
