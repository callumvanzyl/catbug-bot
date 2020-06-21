import chalk from "chalk"

export class Logger {
    static logSuccessToConsole(message: string): void {
        console.log(chalk.green(message))
    }

    static logInfoToConsole(message: string): void {
        console.log(chalk.blue(message))
    }

    static logErrorToConsole(message: string): void {
        console.log(chalk.red(message))
    }
}
