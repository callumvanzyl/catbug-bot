import { initConfig } from "./config"
import { BotSharder } from "./discord/bot-sharder"
import { Logger } from "./discord/logger"

async function main(): Promise<void> {
    Logger.logInfoToConsole(`Catbug Bot ${process.env.npm_package_version}`)

    initConfig()

    const botSharder = new BotSharder(Number(process.env.BOT_SHARDS))
    botSharder.spawn()
}

main()
