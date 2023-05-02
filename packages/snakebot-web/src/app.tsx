import { observer, useLocalObservable } from 'mobx-react-lite'
import styles from './app.module.css'
import './index.css'
import utilStyles from './utils.module.css'
import { State } from './state'

import { stateContext as stateContext } from './stateContext'
import RoundList from './components/RoundList'
import ControlPanel from './components/ControlPanel'
import clsx from 'clsx'

const App = () => {
    const state = useLocalObservable(() => new State())
    return (
        <stateContext.Provider value={state}>
            <div className={clsx(styles.app, utilStyles.full_height)}>
                <div className={clsx(utilStyles.horizontal_list, utilStyles.full_height)}>
                    <ControlPanel />
                    <RoundList rounds={state.rounds} />
                </div>
            </div>
        </stateContext.Provider>
    )
}

export default observer(App)
