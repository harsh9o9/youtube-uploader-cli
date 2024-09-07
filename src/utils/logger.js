import chalk from 'chalk';

export function logSuccess(message) {
  console.log(chalk.green(message));
}

export function logError(message) {
  console.log(chalk.red(message));
}

export function logInfo(message) {
  console.log(chalk.blue(message));
}