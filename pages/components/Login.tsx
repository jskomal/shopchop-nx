import { useState } from 'react'
import Link from 'next/link'

import loginStyles from '../../styles/Login.module.css'
import Header from './Header'

function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')

  const validatePassword = (input: string) => {
    if (input === process.env.NEXT_PUBLIC_PASSWORD) {
      setIsLoggedIn(true)
    }
  }
  return (
    <div className={loginStyles.container}>
      {!isLoggedIn && (
        <input
          type='password'
          placeholder='Top Secret Password'
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
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
        <button className={loginStyles.button}>
          <Link href='/create'>Create a Shopping List</Link>
        </button>
      )}
      {isLoggedIn && (
        <button className={loginStyles.button}>
          <Link href='/my-lists'>Shop</Link>
        </button>
      )}
    </div>
  )
}

export default Login
