import styles from '../../styles/Header.module.css'

function Header() {
  return (
    <header className={styles.header}>
      <h1>ShopChop</h1>
      <p className={styles.tagline}>Shop Smart, Shop S-Mart</p>
      <hr />
    </header>
  )
}

export default Header
