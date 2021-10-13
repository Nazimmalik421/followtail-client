import React, { useState } from 'react'
import styles from './confirmationModal.module.css'


const ConfirmationModal = (props) => {
    const { cancelDeleteHandler, postDeleteConfirm, deletingComment, commentDeleteConfirm } = props;

    return (
        <div className={styles.modal__overlay}>
            <div className={styles.modal}>
                <p className={styles.register__message}>
                    {deletingComment ? 'Are you sure you want to delete this comment?' : 'Are you sure you want to delete this post?'}
                </p>
                <button onClick={deletingComment ? commentDeleteConfirm : postDeleteConfirm} className={`${styles.btn} ${styles.btn__delete}`}>Delete</button>
                <button onClick={cancelDeleteHandler} className={`${styles.btn} ${styles.btn__cancel}`}>Cancel</button>
            </div>
        </div>
    )
}

export default ConfirmationModal;
