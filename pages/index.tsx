import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Login from './components/Login'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ShopChop</title>
        <meta name='A Shopping List App' content='Powered with Next JS and Supabase' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Login />
    </>
  )
}

export default Home
