import chalk from 'chalk';

export class Logger {
  static error(message: string) {
    console.log(`${chalk.red(message)}`);
  }

  static log(message: string) {
    console.log(message);
  }
}
