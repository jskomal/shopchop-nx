import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Header from './components/Header'
import Login from './components/Login'

const Home: NextPage = () => {
  const [errorText, setErrorText] = useState('\u00a0')

  const handleErrorText = (input: string) => {
    setErrorText(input)
    setTimeout(() => {
      setErrorText('\u00a0')
    }, 3000)
  }

  return (
    <>
      <Head>
        <title>ShopChop</title>
        <meta name='A Shopping List App' content='Powered with Next JS and Supabase' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <p>{errorText}</p>
      <Login />
    </>
  )
}

export default Home
