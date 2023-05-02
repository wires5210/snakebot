import { Game, Image, OutgoingRound, OutgoingPost } from '../Game'
import { highestVoted } from '../utils'
import { SnakeGrid, SnakeMoveResult } from './SnakeGrid'
import { getDirectionFromPoll, makePoll, SnakePollOption } from './poll'
import { drawSnek } from './drawSnek'
import stegosaurus from 'stegcloak'
import { dedent } from 'ts-dedent'

const stegPassword = 'whomst'
const steg = new stegosaurus(false, false)

function makeRound(grid: SnakeGrid, gameStatus: SnakeMoveResult): OutgoingRound {
    const encodedGrid = grid.stringify()
    const whitespaceGrid = steg.hide(encodedGrid, stegPassword, '- -')
    let content: string
    switch (gameStatus) {
        case 'u survived':
            content = dedent`✨ ${grid.points} points   

                             📊 ⬇️ Vote to move - poll in the replies!

                             -${whitespaceGrid}-`
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
        const steg = new stegosaurus(false, false)
        const text = from.toots[0].content

        const gridEncodedText = text.match(/-(.+)-/)![1]
        const gridText = steg.reveal(gridEncodedText, stegPassword)
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
