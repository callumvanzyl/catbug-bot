import { secondsToDistance } from "./utils"

const secondsToDistanceCases = Array.of<[number, string]>(
    [0, "0 secs"],
    [1, "1 sec"],
    [2, "2 secs"],
    [60, "1 min 0 secs"],
    [61, "1 min 1 sec"],
    [62, "1 min 2 secs"],
    [3600, "1 hr 0 mins 0 secs"],
    [3601, "1 hr 0 mins 1 sec"],
    [3602, "1 hr 0 mins 2 secs"],
    [3660, "1 hr 1 min 0 secs"],
    [3661, "1 hr 1 min 1 sec"],
    [3662, "1 hr 1 min 2 secs"],
    [7200, "2 hrs 0 mins 0 secs"],
    [19830, "5 hrs 30 mins 30 secs"],
)

describe(".secondsToDistance util function", () => {
    test.each(secondsToDistanceCases)('.secondsToDistance(%i) should be "%s"', (seconds: number, expected: string) => {
        expect(secondsToDistance(seconds)).toBe(expected)
    })
})
