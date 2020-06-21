import { resolve } from "path"

import dotEnv from "dotenv"

const throwIfNot = <T, K extends keyof T>(obj: Partial<T>, prop: K, msg?: string): T[K] => {
    if (obj[prop] === undefined || obj[prop] === null) {
        throw new Error(msg || `Environment is missing variable ${prop}`)
    } else {
        return obj[prop] as T[K]
    }
}

declare global {
    /* eslint-disable-next-line @typescript-eslint/no-namespace */
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "dev" | "prod"
            BOT_SHARDS: string
            BOT_TOKEN: string
            BOT_ICON_URL: string
            MONGO_URL: string
        }
    }
}

export function initConfig(): void {
    if (process.env.NODE_ENV === "dev") {
        dotEnv.config({
            path: resolve(__dirname, "../.env.dev"),
        })
    }

    ;["BOT_SHARDS", "BOT_TOKEN", "BOT_ICON_URL", "MONGO_URL"].forEach((v) => {
        throwIfNot(process.env, v)
    })
}
