import { Message } from "discord.js"

import { BotCommand } from "../bot-command"
import { CatbugBot } from "../catbug-bot"
import { Resolvable } from "../resolvable"
import { TextBasedChannel, secondsToDistance } from "../utils"
import { DebugCommandArgs } from "./debug-command-args"

async function sendShardsStatus(bot: CatbugBot, channel: TextBasedChannel): Promise<void> {
    bot.client.shard?.broadcastEval("[this.guilds.cache.size, process.uptime()]").then((results) => {
        let totalGuilds = 0
        results.forEach((item) => {
            totalGuilds += item[0]
        })
        const totalShards = bot.client.shard?.count
        const message = CatbugBot.genericCatbugEmbed()
            .setTitle("Shard Status")
            .setDescription(
                `There are currently ${totalShards} shard${totalShards !== 1 ? `s` : ``} ` +
                    `serving a total of ${totalGuilds} guild${totalGuilds !== 1 ? `s` : ``}`,
            )
        Object.keys(results).forEach((key) => {
            const guilds = results[Number(key)][0]
            const uptime = secondsToDistance(results[Number(key)][1])
            message.addField(
                `Shard ${key}`,
                `Serving ${guilds} guild${guilds !== 1 ? `s` : ``}, up for ${uptime}`,
                true,
            )
        })
        channel.send(message)
    })
}

async function sendAllDebugInfo(bot: CatbugBot, channel: TextBasedChannel): Promise<void> {
    await sendShardsStatus(bot, channel)
}

const DebugCommand = new (class implements BotCommand<DebugCommandArgs> {
    name = "debug"

    description = ""

    longDescription = ""

    list = false

    /* eslint-disable-next-line class-methods-use-this  */
    buildArgs(args: string[]): Resolvable.Result<DebugCommandArgs> {
        return new Resolvable.Success(new DebugCommandArgs(args))
    }

    /* eslint-disable-next-line class-methods-use-this  */
    async execute(bot: CatbugBot, message: Message, args: DebugCommandArgs): Promise<void> {
        if (args.wanted.length === 0) {
            await sendAllDebugInfo(bot, message.channel)
        } else if (args.wanted.includes("shards")) {
            await sendShardsStatus(bot, message.channel)
        }
    }
})()

export { DebugCommand }
