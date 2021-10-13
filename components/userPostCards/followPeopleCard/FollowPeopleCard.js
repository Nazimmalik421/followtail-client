import { useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../../../context';
import styles from './followPeopleCard.module.css'
import Link from 'next/link';

const FollowPeopleCard = (props) => {
    const [state] = useContext(UserContext)
    const router = useRouter()

    const { people, followUserHandler, unfollowUserHandler } = props;

    const imageSource = (user) => {
        if (user.image) {
            return user.image.url;
        } else {
            return '/images/default.png'
        }
    }

    return (
        <>
            {
                people.map(user => {
                    return <div key={user._id} className={styles.user__card}>
                        <div className={styles.user__profile_container} >
                            <img className={styles.user__profile_img} src={imageSource(user)} alt={user.name[0]} />
                        </div>
                        {/* {JSON.stringify(user)} */}
                        <div className={styles.user__details}>

                            <div className={styles.user__name}>
                                <Link href={`/user/${user.name}`}><a>{user.name}</a></Link>
                                <hr className={styles.hr} />
                            </div>
                            <div className={styles.user__about}>
                                {user.about}
                            </div>
                            {
                                state && state.user && user.followers && user.followers.includes(state.user._id) ? (
                                    <button onClick={() => unfollowUserHandler(user)} className={styles.button__follow}>Unfollow</button>
                                ) : (
                                    <button onClick={() => followUserHandler(user)} className={styles.button__follow}>Follow</button>
                                )
                            }
                        </div>


                    </div>
                }
                )
            }
        </>
    )
}

export default FollowPeopleCard
