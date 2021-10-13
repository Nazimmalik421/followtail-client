import React from 'react'
import styles from './profileCard.module.css'
// import moment from 'moment';


const ProfileCard = (props) => {

    const { user } = props;
    console.log(user)

    return (
        <div className={styles.profilecard__container}>

            <div className={styles.profile__img__container_outline}>
                <div className={styles.profile__img__container}>
                    <img className={styles.profile__img} src={user && user.image && user.image.url}
                        alt={user && user.name} />
                </div>
            </div>
            <div className={styles.profilename_and_about}>
                <h1 className={styles.username}>
                    {user && user.name}
                </h1>
                <div className={styles.about}>
                    {user && user.about || 'Not available'}
                </div>
            </div>
            <div className={styles.followers__container}>
                <div className={`${styles.followers} ${styles.follow__heading}`}>
                    <div>Followers</div>
                    {user && user.followers && user.followers.length}
                </div>
                <div className={`${styles.following} ${styles.follow__heading}`}>
                    <div>Following</div>
                    {user && user.following && user.following.length}
                </div>
                {/* <div className={styles.joined}>
                    <div>Joined On</div>
                    {moment(user && user.createdAt).fromNow()}
                </div> */}
            </div>
            <button className={styles.button__follow}>FOLLOW</button>

        </div>
    )
}

export default ProfileCard
