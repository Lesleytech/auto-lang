import { existsSync } from 'fs';
import path from 'path';

import { IInputParams } from '../interfaces/input-params.interface';
import { Logger } from './logger';

export function validateUserInput(params: IInputParams) {
  if (!Object.keys(params).length) {
    Logger.error(`Invalid arguments. Use "--help" for usage`);

    process.exit(1);
  }

  const { to, from, dir, genType, diff } = params;

  if ((from && !to) || (to && !from)) {
    Logger.error(`"--from" and "--to" are dependent options`);
    process.exit(1);
  }

  const inputFilePath = path.join(process.cwd(), dir, `${from}.json`);
  const genTypeFilePath = path.join(process.cwd(), dir, `${genType}.json`);

  if (!existsSync(inputFilePath) && from) {
    Logger.error(`File "${inputFilePath}" not found`);
    process.exit(1);
  }

  if (!existsSync(genTypeFilePath) && genType) {
    Logger.error(`File "${genTypeFilePath}" not found`);
    process.exit(1);
  }

  if (diff) {
    if (diff.length !== 2) {
      Logger.error(`"--diff" option requires two languages`);
      process.exit(1);
    }

    const [lang1, lang2] = diff;

    const lang1File = path.join(process.cwd(), dir, `${lang1}.json`);
    const lang2File = path.join(process.cwd(), dir, `${lang2}.json`);

    if (!existsSync(lang1File)) {
      Logger.error(`File "${lang1File}" not found`);
      process.exit(1);
    }

    if (!existsSync(lang2File)) {
      Logger.error(`File "${lang2File}" not found`);
      process.exit(1);
    }
  }
}
