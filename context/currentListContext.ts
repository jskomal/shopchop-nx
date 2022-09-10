import { TItem } from './../types'
import { createContext } from 'react'

type TInitCurrentListContext = {
  list: TItem[]
  setList: React.Dispatch<React.SetStateAction<TItem[]>> // This is narrowed to a React.Dispatch Action in _app.tsx
}

const init: TInitCurrentListContext = {
  list: [],
  setList: () => {}
}

const currentListContext = createContext(init)

export default currentListContext
