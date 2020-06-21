import { CommandArgs } from "../command-args"

export class DebugCommandArgs extends CommandArgs {
    constructor(public wanted: string[]) {
        super()
    }
}
