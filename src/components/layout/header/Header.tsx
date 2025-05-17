import { Typography } from '@mui/material'
import '../../../App.scss'

import { useAppDispatch, useAppSelector } from "../../../hooks"
import { userSelector } from '../../../redux/modules/user'

import styles from './Header.module.scss'
import { NavLink } from 'react-router'


function Header() {
  const user = useAppSelector(userSelector)
  const dispatch = useAppDispatch()
  console.log(user)
  return (
    <div className={styles.header}>
      <div className={styles.header__content}>
          <Typography variant="h3" component="h3"><NavLink to={'/'}>Poster</NavLink></Typography>
        
          <Typography variant="h5" component="h5"><NavLink to={'/'}>News</NavLink></Typography>
          <Typography variant="h5" component="h5"><NavLink to={'/profile'}>{ user.data && user.data !== null ? user.data?.username : 'Login' }</NavLink></Typography>
      </div>
    </div>
  )
}

export default Header