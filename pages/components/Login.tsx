import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

import loginStyles from '../../styles/Login.module.css'

function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [errorText, setErrorText] = useState('\u00a0')
  const submitRef = useRef(null)

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
          ref={submitRef}
        >
          Submit
        </button>
      )}
      {isLoggedIn && (
        <button className={loginStyles.button}>
          <Link href='/create'>Create a Shopping List</Link>
        </button>
      )}
      {isLoggedIn && (
        <button className={loginStyles.button}>
          <Link href='/myLists'>See Saved Lists</Link>
        </button>
      )}
    </div>
  )
}

export default Login
