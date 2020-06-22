import "../config"

import { Client, Guild, Message, TextChannel } from "discord.js"
import FuzzySet from "fuzzyset.js"
import mongoose from "mongoose"

import { GuildSettings } from "../schema/guild-settings"
import { BotCommand } from "./bot-command"
import { CatbugEmbeds } from "./catbug-embeds"
import { CommandArgs } from "./command-args"
import { DebugCommand } from "./commands/debug"
import { PrefixCommand } from "./commands/prefix"
import { Logger } from "./logger"

export class CatbugBot {
    static readonly commands = CatbugBot.buildCommandList()

    static readonly fuzzySet = CatbugBot.buildFuzzySet(CatbugBot.commands)

    readonly client: Client

    readonly logger: Logger

    readonly shardId: number

    constructor() {
        this.client = new Client()
        if (!this.client.shard) process.exit(1)
        this.client.on("message", (message) => this.onMessageSent(message))
        this.client.on("guildCreate", (guild) => CatbugBot.onJoinGuild(guild))
        this.logger = new Logger()
        const [shardId] = this.client.shard.ids
        this.shardId = shardId
    }

    async init(): Promise<boolean> {
        Logger.logInfoToConsole(`Shard ${this.shardId} is connecting to MongoDB`)
        try {
            await mongoose.connect(process.env.MONGO_URL, {
                useCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            Logger.logSuccessToConsole(`Shard ${this.shardId} successfully connected to MongoDB`)
        } catch (error) {
            Logger.logErrorToConsole(`Shard ${this.shardId} could not connect to MongoDB: ${error.message}`)
            process.exit(1)
        }

        Logger.logInfoToConsole(`Shard ${this.shardId} is logging into Discord`)
        try {
            await this.client.login(process.env.BOT_TOKEN)
            Logger.logSuccessToConsole(`Shard ${this.shardId} successfully logged into Discord`)
        } catch (error) {
            Logger.logErrorToConsole(`Shard ${this.shardId} could not log into Discord: ${error.message}`)
            process.exit(1)
        }

        return true
    }

    // COMMANDS
    private async execute(message: Message, commandName: string, args: string[]): Promise<void> {
        const command = CatbugBot.findCommand(commandName)

        if (!command) {
            const feedback = CatbugEmbeds.genericCatbugEmbed()
            const alternative = CatbugBot.fuzzySet.get(commandName)?.[0][1]
            feedback.setDescription(
                `\`${commandName}\` isn't recognized as a valid command!\n` +
                    `${alternative !== undefined ? `Did you mean \`${alternative}\`?` : ""}`,
            )
            await message.channel.send(feedback)
            return
        }

        let buildArgsResult
        try {
            buildArgsResult = await command.buildArgs(args)
            await command.execute(this, message, buildArgsResult)
        } catch (error) {
            const feedback = CatbugEmbeds.genericCatbugEmbed()
            feedback.setDescription(error.message)
            await message.channel.send(feedback)
        }
    }

    private static findCommand(commandName: string | string[]): BotCommand<CommandArgs> {
        return CatbugBot.commands.filter((command) => [command.name].flat().includes(commandName))[0]
    }

    private static buildCommandList(): BotCommand<CommandArgs>[] {
        return [DebugCommand, PrefixCommand]
    }

    private static buildFuzzySet(commands: BotCommand<CommandArgs>[]): FuzzySet {
        return FuzzySet(commands.map((c) => c.name) as string[])
    }
    // END OF COMMANDS

    // EVENT HANDLERS
    private static async onJoinGuild(guild: Guild): Promise<void> {
        if (!guild.available) {
            await guild.leave()
            return
        }

        let writableChannel
        try {
            writableChannel = CatbugBot.findFirstWritableChannel(guild)
        } catch (error) {
            Logger.logErrorToConsole(error.message)
            await guild.leave()
            return
        }

        const existingSettings = await GuildSettings.getSettingsByGuild(guild)
        if (!existingSettings) {
            try {
                await GuildSettings.createSettingsForGuild(guild)
                Logger.logSuccessToConsole(`Successfully initialised in guild ${guild.id}`)
            } catch (error) {
                Logger.logErrorToConsole(error.message)
                await writableChannel.send(CatbugEmbeds.internalErrorCatbugEmbed())
                await guild.leave()
            }
        }
    }

    private async onMessageSent(message: Message): Promise<void> {
        if (!message.guild || message.author.bot) return

        const prefix = await GuildSettings.getPrefixByGuild(message.guild)
        if (!prefix) {
            Logger.logErrorToConsole(`GuildSettings was not found for guild ${message.guild.id}`)
            return
        }

        if (!message.content.startsWith(prefix)) return

        const args = message.content.slice(prefix.length).trim().split(/ +/g)
        const shifted = args.shift()
        if (!shifted) return
        const commandName = shifted.toLowerCase()

        await this.execute(message, commandName, args)
    }
    // END OF EVENT HANDLERS

    // UTILS
    private static findFirstWritableChannel(guild: Guild): TextChannel {
        const channels = guild.channels.cache
            .filter((channel) => channel.type === "text")
            .filter((channel) => {
                if (!guild.me) return false
                const permissions = channel.permissionsFor(guild.me)
                return Boolean(permissions && permissions.has("SEND_MESSAGES"))
            })

        if (channels.size === 0) throw new Error(`No writable channels were found in guild ${guild.id}`)
        return channels.first() as TextChannel
    }
    // END OF UTILS
}
