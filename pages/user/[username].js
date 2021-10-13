import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { UserContext } from '../../context/index';
import { CaretLeftOutlined } from '@ant-design/icons';
import styles from './following.module.css'
import axios from 'axios';
import ProfileCard from '../../components/userProfileCard/ProfileCard';

const Username = () => {

    const [state, setState] = useContext(UserContext)
    const [user, setUser] = useState({})
    const router = useRouter()

    useEffect(() => {
        if (router.query.username) fetchUser()
    }, [router.query.username])

    const fetchUser = async () => {
        // console.log(router.query.username)
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/user/${router.query.username}`)
            // console.log('RESPONSE router.query.username', data)
            setUser(data)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className={styles.followinguser__container}>

            {/* <pre>{JSON.stringify(user, null, 4)}</pre> */}
            <ProfileCard user={user}  />
            <Link href='/user/dashboard'>
                <a className={styles.backbutton}><CaretLeftOutlined /></a>
            </Link>
        </div>
    )
}

export default Username;
