import { ShardingManager } from "discord.js"

import { Logger } from "./logger"

export class BotSharder {
    readonly shardingManager: ShardingManager

    constructor(readonly numberOfShards = 1) {
        this.shardingManager = new ShardingManager("./src/discord/catbug-bot-shard.ts", {
            totalShards: numberOfShards,
            execArgv: ["-r", "ts-node/register"],
            token: process.env.BOT_TOKEN,
        })
    }

    spawn(): void {
        Logger.logInfoToConsole(`Launching ${this.numberOfShards} Catbug shards`)
        this.shardingManager.on("shardCreate", (shard) => {
            Logger.logSuccessToConsole(`Launched Catbug shard ${shard.id}`)
        })
        this.shardingManager.spawn(this.numberOfShards)
    }
}
