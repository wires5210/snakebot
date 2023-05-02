import { observer } from 'mobx-react-lite'
import { ChangeEvent, useCallback, useState } from 'react'
import styles from './Input.module.css'
import utilStyles from '../utils.module.css'
import clsx from 'clsx'

type InputProps = {
    validate?: (text: string) => boolean
    defaultValue?: string
    label?: string
    onSet?: (text: string) => void
}

const Input = ({ validate, label, defaultValue, onSet }: InputProps) => {
    const [value, setValue] = useState(defaultValue ?? '')
    const onChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value
            if (!validate || validate(newValue)) onSet?.(newValue)
            setValue(newValue)
        },
        [validate, setValue]
    )

    const valid = !validate || validate(value)

    return (
        <div className={clsx(utilStyles.horizontal_list, utilStyles.align_items_center)}>
            {label && <span>{label}</span>}
            <input
                spellCheck={false}
                className={clsx(styles.input, !valid && styles.input_invalid)}
                value={value}
                onChange={onChange}
            ></input>
        </div>
    )
}

export const validateInteger = (text: string): boolean => Number.isInteger(Number(text))
export default observer(Input)
