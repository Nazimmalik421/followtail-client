
import React from 'react'
import styles from './postImages.module.css'

const PostImages = (props) => {
    const { url } = props;
    return (
        <div className={styles.post__image}>
            <div className={styles.post_image__container} style={{
                backgroundImage: 'url(' + url + ')',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: 'cover',
                height: '60vh'
            }}>
            </div>
        </div>
    )
}

export default PostImages
