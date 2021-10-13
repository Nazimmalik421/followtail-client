import React from 'react'
import Link from 'next/link'
import styles from './registerSuccessModal.module.css'

const RegisterSuccessModal = (props) => {
    const { profileUpdate, closePopup } = props;

    return (
        <div className={styles.modal__overlay}>
            <div className={styles.modal}>
                <h1 className={styles.modal__Heading}>Congrats! 🥳</h1>
                <hr />
                <p className={styles.register__message}>
                    {
                        profileUpdate ? 'Your profile has been updated🎊' : 'You have been registered successfully✌'
                    }
                </p>
                {
                    !profileUpdate && <Link href='/login'>
                        <a className={`${styles.btn} ${styles.btn__login}`}>Login</a>
                    </Link>
                }

                {!profileUpdate && <Link href='/register'>
                    <a onClick={props.closeModal} className={`${styles.btn} ${styles.btn__close}`}>Close</a>
                </Link>}

                {profileUpdate && <Link href='/user/profile/update'>
                    <a onClick={closePopup} className={`${styles.btn} ${styles.btn__close}`}>Close</a>
                </Link>}
            </div>
        </div>
    )
}

export default RegisterSuccessModal;
