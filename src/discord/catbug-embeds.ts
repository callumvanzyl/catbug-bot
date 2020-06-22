import { MessageEmbed } from "discord.js"

export class CatbugEmbeds {
    static genericCatbugEmbed(): MessageEmbed {
        return new MessageEmbed()
            .setColor("#72daef")
            .setFooter(`Need help? Visit catb.ug/help`, process.env.BOT_ICON_URL)
    }

    static internalErrorCatbugEmbed(): MessageEmbed {
        return CatbugEmbeds.genericCatbugEmbed()
            .setTitle("An Error Occurred")
            .setDescription("Please contact `Callum#1337` for assistance")
    }
}
