import { Message } from "discord.js"
import FuzzySet from "fuzzyset.js"

import { BotCommand } from "./bot-command"
import { CatbugBot } from "./catbug-bot"
import { CommandArgs } from "./command-args"
import { DebugCommand } from "./commands/debug"
import { PrefixCommand } from "./commands/prefix"
import { Resolvable } from "./resolvable"

export class CommandCoordinator {
    static readonly commands = CommandCoordinator.buildCommandList()

    static readonly fuzzySet = CommandCoordinator.buildFuzzySet(CommandCoordinator.commands)

    static async execute(bot: CatbugBot, message: Message, commandName: string, args: string[]): Promise<void> {
        const command = CommandCoordinator.findCommand(commandName)

        if (!command) {
            const feedback = CatbugBot.genericCatbugEmbed()
            const alternative = CommandCoordinator.fuzzySet.get(commandName)?.[0][1]
            feedback.setDescription(
                `\`${commandName}\` isn't recognized as a valid command!\n` +
                    `${alternative !== undefined ? `Did you mean \`${alternative}\`?` : ""}`,
            )
            await message.channel.send(feedback)
            return
        }

        const buildArgsResult = command.buildArgs(args)
        if (buildArgsResult instanceof Resolvable.Failure) {
            const feedback = CatbugBot.genericCatbugEmbed()
            feedback.setDescription(buildArgsResult.error.message)
            await message.channel.send(feedback)
            return
        }

        await command.execute(bot, message, buildArgsResult.result)
    }

    private static findCommand(commandName: string | string[]): BotCommand<CommandArgs> {
        return CommandCoordinator.commands.filter((command) => [command.name].flat().includes(commandName))[0]
    }

    private static buildCommandList(): BotCommand<CommandArgs>[] {
        return [DebugCommand, PrefixCommand]
    }

    private static buildFuzzySet(commands: BotCommand<CommandArgs>[]): FuzzySet {
        return FuzzySet(commands.map((c) => c.name) as string[])
    }
}
