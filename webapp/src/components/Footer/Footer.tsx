import Link from 'next/link'
import { NavLink } from 'theme-ui'

import styles from './Footer.module.scss'

const Footer = () => (
    <div className={styles.footer}>
        <Link href="/"><NavLink className={styles.footer__link}>Search</NavLink></Link>
        <Link href="/about"><NavLink className={styles.footer__link}>About</NavLink></Link>
    </div>
);

export default Footer;