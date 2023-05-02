import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import styles from './Button.module.css'

type ButtonProps = {
    onClick?: () => void
    children: string
    disabled?: boolean
}
const Button = ({ onClick, children, disabled }: ButtonProps) => (
    <div
        className={clsx(styles.button, disabled && styles.button_disabled)}
        onClick={() => {
            !disabled && onClick?.()
        }}
    >
        {children}
    </div>
)

export default observer(Button)
