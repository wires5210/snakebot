import { Game, Image, OutgoingRound, PollResult, PollResults, reconstructToString } from 'snakebot-core'
import { makeAutoObservable, runInAction } from 'mobx'

export type TootData = {
    content: string
    pollResults?: PollResults
    image?: Image
}

export type RoundData = {
    toots: TootData[]
}

export class State {
    currentGame?: Game<unknown>
    currentGameId?: number

    reconstructedRounds: string[] = []
    rounds: RoundData[] = []
    gameOver = false

    constructor() {
        makeAutoObservable(this)
    }

    async startGame<T>(game: Game<T>, gameId: number): Promise<void> {
        this.reconstructedRounds = []
        const outgoingRound = await game.makeFirstRound(gameId)
        const incomingRound = this.roundify(outgoingRound)

        runInAction(() => {
            this.gameOver = false
            this.currentGame = game as Game<unknown>
            this.rounds = [incomingRound]
            this.currentGameId = gameId
        })
    }

    async startNextRound(): Promise<void> {
        if (this.gameOver) {
            throw new Error('u got game over already smh')
        }

        const lastRound = this.rounds.at(-1)
        if (!this.currentGame || this.currentGameId == undefined || !lastRound) {
            throw new Error('start a game first smh')
        }

        const data = await this.currentGame.reconstruct(lastRound, this.currentGameId)
        const outgoingRound = await this.currentGame.makeSubsequentRound(data)
        const incomingRound = this.roundify(outgoingRound)

        const reconstructedPrev = await reconstructToString(this.currentGame, this.currentGameId, this.rounds.at(-1)!)

        runInAction(() => {
            this.gameOver ||= outgoingRound.gameOver
            this.rounds.push(incomingRound)
            this.reconstructedRounds.push(reconstructedPrev)
        })
    }

    revertRound(): void {
        if (this.rounds.length <= 1) return

        this.gameOver = false
        this.rounds.pop()
        this.reconstructedRounds.pop()
    }

    /// i genuinely don't know what to call these anymore help
    private roundify(round: OutgoingRound): RoundData {
        return {
            toots: round.toots.map(t => ({
                ...t,
                pollResults: t.pollOptions?.map(option => ({ option, votes: 0 })),
            })),
        }
    }

    addVote(pollResult: PollResult): void {
        pollResult.votes += 1
    }

    canResetPoll(): boolean {
        return this.rounds.at(-1)?.toots.some(t => t.pollResults !== undefined) ?? false
    }

    resetPoll(): void {
        this.rounds.at(-1)?.toots.forEach(toot => {
            toot.pollResults?.forEach(result => {
                result.votes = 0
            })
        })
    }
}
