import { Message } from "discord.js"

import { CatbugBot } from "./catbug-bot"
import { CommandArgs } from "./command-args"

export interface BotCommand<T extends CommandArgs> {
    name: string | string[]
    description: string
    longDescription: string
    list: boolean
    buildArgs(args: string[]): Promise<T>
    execute(bot: CatbugBot, message: Message, args: T): Promise<void>
}
