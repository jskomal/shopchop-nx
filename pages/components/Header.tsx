import Link from 'next/link'

import styles from '../../styles/Header.module.css'

function Header() {
  return (
    <header className={styles.header}>
      <h1>
        <Link href='/'>ShopChop</Link>
      </h1>
      <p className={styles.tagline}>Shop Smart, Shop S-Mart</p>
      <hr className={styles.hr} />
    </header>
  )
}

export default Header
