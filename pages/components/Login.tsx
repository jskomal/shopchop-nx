import { useState } from 'react'
import Link from 'next/link'

import loginStyles from '../../styles/Login.module.css'

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
      <input
        type='password'
        name='password'
        placeholder='Please input your password'
        value={passwordInput}
        onChange={(e) => setPasswordInput(e.target.value)}
        className={loginStyles.input}
      />
      <button
        className={loginStyles.button}
        onClick={() => validatePassword(passwordInput)}
      >
        Submit
      </button>
      {isLoggedIn && (
        <button>
          <Link href='/create'>Create a Shopping List</Link>
        </button>
      )}
      <button>
        <Link href='/my-lists'>Shop</Link>
      </button>
    </div>
  )
}

export default Login
