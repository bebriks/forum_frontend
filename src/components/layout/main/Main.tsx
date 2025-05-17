import '../../../App.scss'
import styles from './Main.module.scss'
import { ReactNode } from 'react'

function Body({ children }: { children: ReactNode }) {
  return (
    <div className={styles.main}>
      {children}
    </div>
  )
}

export default Body