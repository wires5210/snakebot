import { createContext } from 'react'
import { State } from './state'

export const stateContext = createContext<State | undefined>(undefined)
