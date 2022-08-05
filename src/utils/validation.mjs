import chalk from 'chalk';
import { existsSync } from 'fs';
import path from 'path';

import { Logger } from './Logger.mjs';

export function validateOptions(opts) {
  if (!Object.keys(opts).length) {
    Logger.error(`Invalid arguments. Use ${chalk.gray('--help')} for usage`);

    exit(1);
  }

  const { to, from, dir, genType } = opts;

  if ((from && !to) || (to && !from)) {
    Logger.error(
      `${chalk.gray('--from')} and ${chalk.gray('--to')} are dependent options`
    );
    exit(1);
  }

  const inputFile = path.join(process.cwd(), dir, `${from}.json`);
  const genTypeFile = path.join(process.cwd(), dir, `${genType}.json`);

  if (!existsSync(inputFile) && from) {
    Logger.error(`File "${inputFile}" not found`);
    exit(1);
  }

  if (!existsSync(genTypeFile) && genType) {
    Logger.error(`File "${genType}" not found`);
    exit(1);
  }

  return { ...opts, inputFile, genTypeFile };
}
