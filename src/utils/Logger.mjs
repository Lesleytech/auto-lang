import chalk from 'chalk';

export class Logger {
  static error(message) {
    console.log(`${chalk.bgRed(' ERROR ')} ${message}`);
  }
}
