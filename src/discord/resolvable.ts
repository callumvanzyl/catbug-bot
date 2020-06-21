/* eslint-disable-next-line @typescript-eslint/no-namespace,max-classes-per-file */
export namespace Resolvable {
    export type Result<T> = Success<T> | Failure<T>

    export class Success<T> {
        constructor(readonly result: T) {}
    }

    export class Failure<T> {
        constructor(readonly error: Error) {}
    }
}
