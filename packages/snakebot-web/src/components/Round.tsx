import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import styles from './Round.module.css'
import utilStyles from '../utils.module.css'
import Toot from './Toot'
import { useContext } from 'react'
import { stateContext } from '../stateContext'
import { RoundData } from '../state'

type RoundProps = {
    round: RoundData
    index: number
    canVote: boolean
    gameOver?: boolean
}

const Round = ({ round, index, canVote, gameOver }: RoundProps) => {
    const state = useContext(stateContext)
    const reconstructed = state?.reconstructedRounds.at(index)

    return (
        <div className={clsx(styles.round, utilStyles.horizontal_list, utilStyles.align_items_center)}>
            <div className={clsx(utilStyles.vertical_list, styles.round_inner)}>
                {round.toots.map((t, i) => (
                    <Toot key={i} toot={t} canVote={canVote} />
                ))}
            </div>

            <div className={styles.sidebar_outer}>
                <div className={styles.sidebar}>
                    {reconstructed && (
                        <p className={utilStyles.subtle_text}>
                            reconstructs into: <br />
                            {reconstructed}
                        </p>
                    )}
                    {gameOver && <span>Game over!</span>}
                </div>
            </div>
        </div>
    )
}

export default observer(Round)
