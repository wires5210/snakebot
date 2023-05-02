import _ from 'lodash'
import { PollResult, PollResults } from './Game'

export function highestVoted(pollResults: PollResults): PollResult {
    return _.maxBy(pollResults, r => r.votes)!
}
