import React from 'react'
import { CloseOutlined } from '@ant-design/icons'
import styles from './commentModal.module.css'

const CommentModal = (props) => {
    const { setVisible, commentSubmitHandler, comment, commentChangeHandler, currentPost } = props;

    return (
        <div className={styles.commentmodal__container}>
            <div onClick={() => setVisible(false)} className={styles.commentmodal__overlay}>
            </div>
            <div className={styles.commentmodal__card}>
                <div className={styles.commentmodal__head}>
                    <h1 className={styles.commentmodal__title}>Comments</h1>
                    <CloseOutlined onClick={() => setVisible(false)} className={styles.commentmodal__btn} />
                </div>
                <hr className={styles.hr} />
                <div className={styles.commentmodal__body}>
                    <form onSubmit={(e) => commentSubmitHandler(e, currentPost)}>
                        <input autoFocus={true} onChange={commentChangeHandler} value={comment} className={styles.commentmodal__comment} type="text" placeholder='Write comment...' />
                        <button className={styles.comment__submit}>Submit</button>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default CommentModal
