import stringifyObject from 'stringify-object'

export type PollOptions = string[]
export type PollResult = {
    option: string
    votes: number
}

export type PollResults = PollResult[]

export type IncomingPost = {
    content: string
    pollResults?: PollResults
}

export type IncomingRound = {
    toots: IncomingPost[]
}

export type Image = {
    width: number
    height: number
    draw: (ctx: OffscreenCanvasRenderingContext2D) => void
    altText: string
}

export type OutgoingPost = {
    content: string
    pollOptions?: PollOptions
    image?: Image
}

export type OutgoingRound = {
    toots: OutgoingPost[]
    gameOver: boolean
}

export type Game<TGameState> = {
    name: string
    /**
     * Create the first round of the game.
     */
    makeFirstRound: (gameId: number) => Promise<OutgoingRound>
    /**
     * Create a {@link TGameState} from posts.
     */
    reconstruct: (from: IncomingRound, gameId: number) => Promise<TGameState>
    /**
     * Create a round from a {@link TGameState}.
     */
    makeSubsequentRound: (data: TGameState) => Promise<OutgoingRound>
}

export async function reconstructToString(game: Game<unknown>, gameId: number, round: IncomingRound): Promise<string> {
    const reconstructed = await game.reconstruct(round, gameId)
    return stringifyObject(reconstructed, { singleQuotes: true })
}
