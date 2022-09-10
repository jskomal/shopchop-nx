import React, { useState, useEffect } from 'react'
import Link from 'next/link'

import loginStyles from '../../styles/Login.module.css'

function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [errorText, setErrorText] = useState('\u00a0')

  useEffect(() => {
    const isAuth = sessionStorage.getItem('isLoggedIn')
    if (typeof isAuth === 'string') {
      setIsLoggedIn(true)
    }
  }, [])

  const handleErrorText = (input: string) => {
    setErrorText(input)
    setTimeout(() => {
      setErrorText('\u00a0')
    }, 3000)
  }

  const validatePassword = (input: string) => {
    if (input === process.env.NEXT_PUBLIC_PASSWORD) {
      setIsLoggedIn(true)
      sessionStorage.setItem('isLoggedIn', JSON.stringify(true))
    } else {
      handleErrorText('Incorrect Password')
    }
  }

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      validatePassword(passwordInput)
    }
  }

  return (
    <div className={loginStyles.container}>
      <p className={loginStyles.errorText}>{errorText}</p>
      {!isLoggedIn && (
        <input
          type='password'
          placeholder='Top Secret Password'
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          onKeyUp={handleSubmit}
          className={loginStyles.input}
        />
      )}
      {!isLoggedIn && (
        <button
          className={loginStyles.button}
          onClick={() => validatePassword(passwordInput)}
        >
          Submit
        </button>
      )}
      {isLoggedIn && (
        <Link href='/create'>
          <button className={loginStyles.button}>Create a Shopping List </button>
        </Link>
      )}
      {isLoggedIn && (
        <Link href='/myLists'>
          <button className={loginStyles.button}>See Saved Lists</button>
        </Link>
      )}
    </div>
  )
}

export default Login
