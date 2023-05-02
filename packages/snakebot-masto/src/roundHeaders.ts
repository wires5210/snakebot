import _ from 'lodash'
import { OutgoingRound } from 'snakebot-core'

const headerPattern = /^➡️ (.+) - GAME (\d+) (END )?⬅️/

export type HeaderData = {
    gameName: string
    gameId: number
    gameOver: boolean
}

export function hasHeader(tootContent: string): boolean {
    return headerPattern.test(tootContent)
}

export function getHeader(tootContent: string): HeaderData | undefined {
    const match = tootContent.match(headerPattern)
    if (match == null) return undefined

    const gameName = match[1]
    const gameId = Number(match[2])
    const gameOver = match.at(3) !== undefined

    return { gameName, gameId, gameOver }
}

export function addHeader(round: OutgoingRound, gameName: string, gameId: number): OutgoingRound {
    const copy = _.cloneDeep(round)
    const header = `➡️ ${gameName} - GAME ${gameId} ${round.gameOver ? 'END ' : ''}⬅️ #bot`

    copy.toots[0].content = header + '\n\n' + copy.toots[0].content

    return copy
}
