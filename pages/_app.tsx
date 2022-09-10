import type { AppProps } from 'next/app'
import { useState } from 'react'

import { TItem } from '../types'
import currentListContext from '../context/currentListContext'
import Header from './components/Header'

import '../styles/globals.css'

type TCurrentListContext = {
  list: TItem[]
  setList: React.Dispatch<React.SetStateAction<TItem[]>>
}

function MyApp({ Component, pageProps }: AppProps) {
  const [list, setList] = useState<TItem[]>([])
  const listBinder = { list, setList }
  return (
    <currentListContext.Provider value={listBinder}>
      <div className='App'>
        <Header />
        <Component {...pageProps} />
      </div>
    </currentListContext.Provider>
  )
}

export default MyApp
