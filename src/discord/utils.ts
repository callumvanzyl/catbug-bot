import { DMChannel, NewsChannel, TextChannel } from "discord.js"

export type TextBasedChannel = TextChannel | DMChannel | NewsChannel

export function secondsToDistance(seconds: number): string {
    if (seconds > 3599) {
        const h = Math.trunc(seconds / 3600)
        const m = Math.trunc((seconds - h * 3600) / 60)
        const s = Math.round(seconds) - h * 3600 - m * 60
        return `${h} hr${h !== 1 ? `s` : ``} ${m} min${m !== 1 ? `s` : ``} ${s} sec${s !== 1 ? `s` : ``}`
    }
    if (seconds > 59) {
        const m = Math.trunc(seconds / 60)
        const s = Math.round(seconds) - m * 60
        return `${m} min${m !== 1 ? `s` : ``} ${s} sec${s !== 1 ? `s` : ``}`
    }
    const s = Math.round(seconds)
    return `${s} sec${s !== 1 ? `s` : ``}`
}
