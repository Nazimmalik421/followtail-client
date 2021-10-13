import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/index';
import { CaretLeftOutlined } from '@ant-design/icons';
import styles from './following.module.css'
import axios from 'axios';

const Following = () => {

    const [state, setState] = useContext(UserContext)

    const [people, setPeople] = useState([])
    const router = useRouter()

    useEffect(() => {
        if (state && state.token) fetchFollowingUsers()
    }, [state && state.token])

    const fetchFollowingUsers = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/following-users`)

            setPeople(data)
        } catch (err) {
            console.log(err)
        }
    }

    const unfollowUserHandler = async (unFllwUser) => {
        console.log('UNFOLLOW THIS USER', unFllwUser)
        //
        try {
            const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API}/unfollow-user`, { _id: unFllwUser._id })

            //update local storage, keep token
            let auth = JSON.parse(localStorage.getItem('authDetails'));
            auth.user = data;
            localStorage.setItem('authDetails', JSON.stringify(auth));

            //update context
            setState({ ...state, user: data });

            //Update people state
            let filteredPeople = people.filter(person => person._id !== unFllwUser._id);
            setPeople(filteredPeople);

            //Success msg 
            toast.error(`You unfollowed '${unFllwUser.name}'`)

        } catch (err) {
            console.log(err)
        }
    }

    const imageSource = (user) => {
        if (user.image) {
            return user.image.url;
        } else {
            return '/images/default.png'
        }
    }

    return (
        <div className={styles.followinguser__container}>
            {
                people.map(user => <div key={user._id} className={styles.user__card}>
                    <div className={styles.user__profile_container} >
                        <img className={styles.user__profile_img} src={imageSource(user)} alt={user.name[0]} />
                    </div>

                    <div className={styles.user__details}>

                        <div className={styles.user__name}>
                            {user.name}
                            <hr className={styles.hr} />
                        </div>
                        <div className={styles.user__about}>
                            {user.about}
                        </div>
                        <button onClick={() => unfollowUserHandler(user)} className={styles.button__follow}>Unfollow</button>
                    </div>


                </div>)
            }

            <Link href='/user/dashboard'>
                <a className={styles.backbutton}><CaretLeftOutlined /></a>
            </Link>
            {/* <pre>{JSON.stringify(people, null, 4)}</pre> */}
        </div>
    )
}

export default Following;
