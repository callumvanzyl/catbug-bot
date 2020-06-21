import { Message } from "discord.js"

import { CatbugBot } from "./catbug-bot"
import { CommandArgs } from "./command-args"
import { Resolvable } from "./resolvable"

export interface BotCommand<T extends CommandArgs> {
    name: string | string[]
    description: string
    longDescription: string
    list: boolean
    buildArgs(args: string[]): Resolvable.Result<T>
    execute(bot: CatbugBot, message: Message, args: T): Promise<void>
}
