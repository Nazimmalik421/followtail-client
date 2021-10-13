import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../context'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './nav.module.css'
import { CaretDownOutlined } from '@ant-design/icons'

const Nav = () => {

    const [currentLink, setCurrentLink] = useState('')
    const [open, setOpen] = useState(false)
    const [state, setState] = useContext(UserContext)
    const router = useRouter()

    useEffect(() => {
        //This process.browser will be true if we are in the client mode else will be false. Then setting state
        process.browser && setCurrentLink(window.location.pathname)

        //Will run useEffect whenever url changes in the browser
    }, [process.browser && window.location.pathname])

    const logoutHandler = () => {

        window.localStorage.removeItem('authDetails');
        setState(null)
        router.push('/login')
    }

    const dropdownHandler = () => {
        setOpen(prevState => !prevState)
        // console.log('CLICKED')
    }



    return (
        <div className={styles.nav__container}>
            <div className={styles.logo__Container}>
                <Link href="/">
                    <a className={`${styles.nav__logo}`}>FollowTail</a>
                </Link>
            </div>

            <nav className={styles.nav}>

                {
                    state === null ?
                        <>
                            <Link href="/login">
                                <a className={`${styles.nav__item} ${currentLink === '/login' ? 'active' : ''}`}>Login</a>
                            </Link>

                            <Link href="/register">
                                <a className={`${styles.nav__item} ${currentLink === '/register' ? 'active' : ''}`}>Register</a>
                            </Link>
                        </>
                        :
                        <>

                            <div className={styles.dropdown} onClick={dropdownHandler}>

                                <a className={`${styles.profile__name}`} >
                                    {state && state.user && state.user.name} <span><CaretDownOutlined /></span>
                                </a>

                                {open && <div className={styles.submenu}>
                                    <ul>
                                        <li className={styles.dropdown__items}>
                                            <Link href="/user/dashboard">
                                                <a className={`${styles.nav__item__dropdown}`}>
                                                    Dashboard
                                                </a>
                                            </Link>
                                        </li>
                                        <li className={styles.dropdown__items}>
                                            <Link href="/user/profile/update">
                                                <a className={`${styles.nav__item__dropdown}`}>
                                                    Profile
                                                </a>
                                            </Link>
                                        </li>
                                        {
                                            state.user.role === 'Admin' && <li className={styles.dropdown__items}>
                                                <Link href="/admin">
                                                    <a className={`${styles.nav__item__dropdown}`}>
                                                        Admin
                                                    </a>
                                                </Link>
                                            </li>
                                        }
                                        <li className={styles.dropdown__items}>
                                            <a onClick={logoutHandler} className={styles.nav__item__dropdown}>Logout</a>
                                        </li>
                                    </ul>
                                </div>}

                            </div>
                        </>
                }

            </nav>
        </div>
    )
}

export default Nav
