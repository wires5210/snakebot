import { SnakeDirection, GridContents } from './SnakeGrid.js'

export type SnakePollOption = '⬆️ Move up' | '⬇️ Move down' | '⬅️ Move left' | '➡️ Move right'

export const pollOptions: readonly SnakePollOption[] = ['⬆️ Move up', '⬇️ Move down', '⬅️ Move left', '➡️ Move right']

export function getDirectionFromPoll(from: SnakePollOption): SnakeDirection {
    return from.split(' ')[2] as SnakeDirection
}

export function makePoll(grid: GridContents): SnakePollOption[] {
    const result = [...pollOptions]

    // remove the opposite direction from the list of options
    // the .unshift in the latter two cases ensures that
    // the current direction is always the first option
    // not needed in the first two cases, since it already ends up there anyways
    switch (grid.direction) {
        case 'up':
            result.splice(1, 1)
            break

        case 'down':
            result.splice(0, 1)
            break

        case 'left':
            result.splice(3, 1)
            result.unshift(result.splice(2, 1)[0])
            break

        case 'right':
            result.splice(2, 1)
            result.unshift(result.splice(2, 1)[0])
            break
    }

    return result
}
