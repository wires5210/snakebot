import { Game, Image, OutgoingRound, OutgoingPost } from '../Game.js'
import { highestVoted } from '../utils.js'
import { SnakeGrid, SnakeMoveResult } from './SnakeGrid.js'
import { getDirectionFromPoll, makePoll, SnakePollOption } from './poll.js'
import { drawSnek } from './drawSnek.js'
import { dedent } from 'ts-dedent'
import { hiddenDecode, hiddenEncode } from './hiddenEncode.js'

function makeRound(grid: SnakeGrid, gameStatus: SnakeMoveResult): OutgoingRound {
    const hiddenGrid = hiddenEncode(grid.stringify())

    let content: string
    switch (gameStatus) {
        case 'u survived':
            content = dedent`✨ ${grid.points} points   

                             📊 ⬇️ Vote to move - poll in the replies!

                             --${hiddenGrid}--`
            break

        case 'u died':
            content = dedent`😞 Game over..

                             🏆 You got ${grid.points} points.`
            break

        case 'u won':
            content = dedent`🎉 YOU WIN !!!

                             🏆 You got ${grid.points} points.`
    }

    const image = makeImage(grid)
    const pollOptions = makePoll(grid)

    const toots: OutgoingPost[] = [
        {
            content,
            image,
        },
    ]

    if (gameStatus == 'u survived') {
        toots.push({
            content: 'Vote on where to move next :]',
            pollOptions,
        })
    }

    return {
        toots,
        gameOver: gameStatus != 'u survived',
    }
}

function makeImage(grid: SnakeGrid): Image {
    const width = 512
    const height = 288
    return {
        draw: ctx => drawSnek(grid, ctx, width, height),
        altText: `A board for the game Snake, of size ${grid.columnCount}x${grid.rowCount}.`,
        width,
        height,
    }
}

export const SnakeGame: Game<SnakeGrid> = {
    name: 'Snake 🐍',

    async makeFirstRound(_gameId) {
        const grid = SnakeGrid.makeDefault()

        return makeRound(grid, 'u survived')
    },

    async reconstruct(from) {
        const text = from.toots[0].content

        const hiddenGridText = text.match(/--(.+)--/)![1]
        const gridText = hiddenDecode(hiddenGridText)
        const grid = SnakeGrid.unstringify(gridText)

        const poll = from.toots[1].pollResults!
        grid.direction = getDirectionFromPoll(highestVoted(poll).option as SnakePollOption)

        return grid
    },

    async makeSubsequentRound(grid) {
        const newGrid = new SnakeGrid(grid)
        const result = newGrid.moveSnake()

        return makeRound(newGrid, result)
    },
}
