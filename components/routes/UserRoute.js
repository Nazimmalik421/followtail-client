import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import { UserContext } from '../../context';
import { useRouter } from 'next/router';
import { SyncOutlined } from '@ant-design/icons'
import styles from './userRouter.module.css'

const UserRoute = ({ children }) => {
    const [ok, setOk] = useState(false)
    const router = useRouter();
    const [state] = useContext(UserContext)

    useEffect(() => {
        if (state && state.token) getCurrentUser()  //This function only executes when there's state and token
    }, [state && state.token])

    const getCurrentUser = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API}/current-user`, {

                //Before setting the default baseURL we have to write it like this and Headers also to be added explicitly
                // const res = await axios.get(`${process.env.NEXT_PUBLIC_API}/current-user`, {
                //     headers: { 'Authorization': `Bearer ${state.token}` }
            });
            if (res.data.ok) setOk(true)
            //If this function is not called then we will never land on login page bcz this Fn only run when state & state.token is true
        } catch (err) {
            router.push('/login')
        }
    }
    //To work around above logic we need to call the above Fn manually
    process.browser && state === null && setTimeout(() => {
        getCurrentUser()
    }, 1000)

    return (
        <>
            {!ok ? <div className={styles.spinner}>
                <SyncOutlined spin className={`${styles.loading__spinner}`} />
            </div> : <>{children}</>}
        </>
    )
}

export default UserRoute;
