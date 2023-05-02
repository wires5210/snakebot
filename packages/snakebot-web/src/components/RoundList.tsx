import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'
import styles from './RoundList.module.css'
import utilStyles from '../utils.module.css'
import Round from './Round'
import { RoundData } from '../state'

type RoundListProps = {
    rounds: RoundData[]
}

const RoundList = ({ rounds }: RoundListProps) => {
    const listRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!listRef.current) return

        const observer = new MutationObserver(() => {
            listRef.current?.scrollTo({ top: 0 })
        })
        observer.observe(listRef.current, { childList: true })
        return () => observer.disconnect()
    }, [listRef])

    return (
        <div
            ref={listRef}
            className={clsx(styles.round_list, utilStyles.vertical_list, utilStyles.larger_gap, utilStyles.full_height)}
        >
            {rounds.length > 0 ? (
                [...rounds]
                    .reverse()
                    .map((r, index) => (
                        <Round
                            round={r}
                            index={rounds.length - index - 1}
                            key={rounds.length - index}
                            canVote={index == 0}
                        />
                    ))
            ) : (
                // literally just a hack so that the control panel wouldn't
                // shift to the middle of the screen when there isn't any game to display
                <Round
                    round={{ toots: [{ content: 'start a game using the panel on the left..' }] }}
                    index={0}
                    canVote={false}
                />
            )}
        </div>
    )
}

export default observer(RoundList)
