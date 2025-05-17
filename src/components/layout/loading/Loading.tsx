import { CircularProgress} from '@mui/material'
import '../../../App.scss'
import styles from './Loading.module.scss'

function Loading() {
  return (
    <div className={styles.loading__wrapper}>
      <CircularProgress size={50} color='inherit' />
    </div>
  )
}

export default Loading