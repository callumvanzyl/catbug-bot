import "../config"

import { Client, Guild, Message, MessageEmbed, TextChannel } from "discord.js"
import mongoose from "mongoose"

import { GuildSettings } from "../schema/guild-settings"
import { CommandCoordinator } from "./command-coordinator"
import { Logger } from "./logger"

export class CatbugBot {
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

    static genericCatbugEmbed(): MessageEmbed {
        return new MessageEmbed()
            .setColor("#72daef")
            .setFooter(`Need help? Visit catb.ug/help`, process.env.BOT_ICON_URL)
    }

    static internalErrorCatbugEmbed(): MessageEmbed {
        return CatbugBot.genericCatbugEmbed()
            .setTitle("An Error Occurred")
            .setDescription("Please contact `Callum#1337` for assistance")
    }

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
                await writableChannel.send(CatbugBot.internalErrorCatbugEmbed())
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

        await CommandCoordinator.execute(this, message, commandName, args)
    }

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
}
