import { CommandArgs } from "../command-args"

export class PrefixCommandArgs extends CommandArgs {
    constructor(public newPrefix: string) {
        super()
    }
}
