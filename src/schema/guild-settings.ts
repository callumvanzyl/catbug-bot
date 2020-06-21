import { Guild } from "discord.js"
import { Type, createSchema, typedModel } from "ts-mongoose"

const GuildSettingsSchema = createSchema(
    {
        guildId: Type.string({ required: true, unique: true }),
        prefix: Type.string({ required: true, default: "!cb" }),
    },
    { collection: "guild_settings" },
)

const GuildSettings = typedModel("GuildSettings", GuildSettingsSchema, undefined, undefined, {
    async createSettingsForGuild(guild: Guild) {
        const settings = new GuildSettings({ guildId: guild.id })
        try {
            return await settings.save()
        } catch (error) {
            return Promise.reject(error)
        }
    },

    async getPrefixByGuild(guild: Guild) {
        const settings = await this.findOne({ guildId: guild.id })
        if (!settings) return undefined
        return settings.prefix
    },

    async getSettingsByGuild(guild: Guild) {
        const settings = await this.findOne({ guildId: guild.id })
        if (!settings) return undefined
        return settings
    },
})

export { GuildSettings }
