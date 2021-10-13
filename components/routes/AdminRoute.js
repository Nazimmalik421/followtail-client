import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import { UserContext } from '../../context';
import { useRouter } from 'next/router';
import { SyncOutlined } from '@ant-design/icons'
import styles from './userRouter.module.css'

const AdminRoute = ({ children }) => {
    const [ok, setOk] = useState(false)
    const router = useRouter();
    const [state] = useContext(UserContext)

    useEffect(() => {
        if (state && state.token) getCurrentAdmin()  //This function only executes when there's state and token
    }, [state && state.token])

    const getCurrentAdmin = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API}/current-admin`, {

            });
            if (res.data.ok) setOk(true)
            //If this function is not called then we will never land on login page bcz this Fn only run when state & state.token is true
        } catch (err) {
            router.push('/')
        }
    }
    //To work around above logic we need to call the above Fn manually
    process.browser && state === null && setTimeout(() => {
        getCurrentAdmin()
    }, 1000)

    return (
        <>
            {!ok ? <div className={styles.spinner}>
                <SyncOutlined spin className={`${styles.loading__spinner}`} />
            </div> : <>{children}</>}
        </>
    )
}

export default AdminRoute;
