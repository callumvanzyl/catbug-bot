import { Message } from "discord.js"

import { GuildSettings } from "../../schema/guild-settings"
import { BotCommand } from "../bot-command"
import { CatbugBot } from "../catbug-bot"
import { Logger } from "../logger"
import { Resolvable } from "../resolvable"
import { PrefixCommandArgs } from "./prefix-command-args"

const prefixMinLength = 2
const prefixMaxLength = 10

const PrefixCommand = new (class implements BotCommand<PrefixCommandArgs> {
    name = "prefix"

    description = ""

    longDescription = ""

    list = true

    /* eslint-disable-next-line class-methods-use-this  */
    buildArgs(args: string[]): Resolvable.Result<PrefixCommandArgs> {
        if (args.length !== 1) {
            return new Resolvable.Failure(new Error("Invalid parameters"))
        }

        if (args[0].length < prefixMinLength || args[0].length > prefixMaxLength) {
            return new Resolvable.Failure(
                new Error(`Prefix must be between ${prefixMinLength} and ${prefixMaxLength} characters long`),
            )
        }

        return new Resolvable.Success(new PrefixCommandArgs(args[0]))
    }

    /* eslint-disable-next-line class-methods-use-this  */
    async execute(bot: CatbugBot, message: Message, args: PrefixCommandArgs): Promise<void> {
        const feedback = CatbugBot.genericCatbugEmbed()
        try {
            await GuildSettings.updateOne({ guildId: message.guild?.id }, { $set: { prefix: args.newPrefix } })
            feedback.setDescription(`Your prefix has been updated to \`${args.newPrefix}\``)
            await message.channel.send(feedback)
        } catch (error) {
            Logger.logErrorToConsole(
                `Failed to set prefix to ${args.newPrefix} in guild ${message.guild?.id}: ${error.message}`,
            )
            feedback.setDescription("Your prefix could not be updated, please try again later")
            await message.channel.send(feedback)
        }
    }
})()

export { PrefixCommand }
