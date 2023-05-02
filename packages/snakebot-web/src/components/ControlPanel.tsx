import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useContext, useEffect, useState } from 'react'
import { stateContext } from '../stateContext'
import Button from './Button'
import styles from './ControlPanel.module.css'
import utilStyles from '../utils.module.css'
import Input, { validateInteger } from './Input'
import { SnakeGame } from 'snakebot-core'

const ControlPanel = () => {
    const state = useContext(stateContext)
    const [gameId, setGameId] = useState(1)

    useEffect(() => {
        const l = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return
            if (e.key == 'Enter') {
                void state?.startNextRound()
                e.preventDefault()
            }
        }
        document.addEventListener('keydown', l)
        return () => document.removeEventListener('keydown', l)
    }, [state])

    return (
        <div className={clsx(styles.control_panel, utilStyles.vertical_list)}>
            <Input label="Game ID:" defaultValue="1" validate={validateInteger} onSet={val => setGameId(Number(val))} />
            <Button onClick={() => void state?.startGame(SnakeGame, gameId)}>Start game</Button>
            <hr />

            <div className={utilStyles.horizontal_list}>
                <Button
                    onClick={() => {
                        void state?.startNextRound()
                    }}
                    disabled={!state?.currentGame || state.gameOver}
                >
                    Next round
                </Button>

                <Button
                    onClick={() => {
                        state?.revertRound()
                    }}
                    disabled={!state?.currentGame || state.rounds.length <= 1}
                >
                    Revert round
                </Button>
            </div>

            <Button onClick={() => state?.resetPoll()} disabled={!state?.canResetPoll()}>
                Reset poll
            </Button>
            <span className={utilStyles.subtle_text}>(btw: use number keys to vote, enter to start next round)</span>
        </div>
    )
}

export default observer(ControlPanel)
