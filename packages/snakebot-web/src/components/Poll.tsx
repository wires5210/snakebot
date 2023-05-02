import { PollResult, PollResults } from 'snakebot-core'
import clsx from 'clsx'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useCallback, useContext, useEffect } from 'react'
import { stateContext } from '../stateContext'
import styles from './Poll.module.css'

type PollProps = {
    results: PollResults
    canVote: boolean
}

const Poll = ({ results, canVote }: PollProps) => {
    const state = useContext(stateContext)

    const onClick = useCallback(
        (option: PollResult) => {
            if (canVote) state?.addVote(option)
        },
        [state, canVote]
    )

    useEffect(() => {
        if (!canVote) return

        const l = (e: KeyboardEvent) => {
            const option = Number(e.key)
            if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return
            if (isNaN(option)) return
            if (option > results.length || option < 1) return

            state?.addVote(results[option - 1])
            e.preventDefault()
        }

        document.addEventListener('keydown', l)
        return () => document.removeEventListener('keydown', l)
    }, [results, state, canVote])

    const voteCount = _.sumBy(results, r => r.votes)
    let scaledResults = results.map(r => (r.votes / voteCount) * 100)
    if (voteCount == 0) {
        scaledResults = results.map(_ => 0)
    }

    const resultPercentages = scaledResults.map(r => r.toFixed(0))

    return (
        <div className={styles.poll}>
            {results.map((r, index) => (
                <div
                    key={r.option}
                    onClick={() => onClick(r)}
                    className={clsx(styles.poll_option, canVote && styles.poll_option_votable)}
                >
                    <div
                        className={styles.poll_option_fill_bar}
                        style={{ transform: `scaleX(${scaledResults[index]}%)` }}
                    />
                    <div className={styles.poll_option_inner}>
                        <div className={styles.poll_option_name}>
                            <span>{r.option}</span>
                        </div>
                        <div className={styles.poll_option_votes}>
                            <span>
                                {r.votes} ({resultPercentages[index]}%)
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default observer(Poll)
