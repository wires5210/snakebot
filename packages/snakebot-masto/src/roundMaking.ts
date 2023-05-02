import _ from 'lodash'
import { mastodon } from 'masto'
import { Game, IncomingRound, IncomingPost, OutgoingRound, PollResults } from 'snakebot-core'
import { htmlToPlaintext } from './utils'

function makeIncomingToot(from: mastodon.v1.Status): IncomingPost {
    let poll: PollResults | undefined
    if (from.poll) {
        poll = from.poll.options.map(o => ({
            option: o.title,
            votes: o.votesCount!,
        }))
    }

    return {
        content: htmlToPlaintext(from.content),
        pollResults: poll,
    }
}

export function constructRound(toot: mastodon.v1.Status, descendants: mastodon.v1.Status[]): IncomingRound {
    const tootChain: mastodon.v1.Status[] = [toot, ..._.sortBy(descendants, d => new Date(d.createdAt))]

    return {
        toots: tootChain.map(t => makeIncomingToot(t)),
    }
}

export async function getSubsequentRound<T>(
    game: Game<T>,
    lastRound: IncomingRound,
    gameId: number
): Promise<OutgoingRound> {
    const data = await game.reconstruct(lastRound, gameId)
    return await game.makeSubsequentRound(data)
}

export async function getFirstRound<T>(game: Game<T>, gameId: number): Promise<OutgoingRound> {
    return game.makeFirstRound(gameId)
}
