import React from 'react'
import styles from './authForm.module.css'

const ForgotPassForm = (props) => {
    const { formSubmitHandler, emailChangeHandler, passwordChangeHandler, answerChangeHandler,
        email, newPassword, answer, loading } = props;

    return (
        <form onSubmit={formSubmitHandler}>

            <div className={styles.form__label_input}>
                <label className={styles.form__label} htmlFor="email">Email:</label>
                <input onChange={emailChangeHandler} value={email} className={styles.form__input} placeholder='Enter email' id='email' type="email" />
            </div>


            <div className={styles.form__label_input}>
                <label className={styles.form__label} htmlFor="password">New Password:</label>
                <input onChange={passwordChangeHandler} value={newPassword} className={styles.form__input} placeholder='Enter new password' id='password' type="password" autoComplete="on" />
            </div>

            <>
                <div className={styles.form__label_input}>
                    <label className={styles.form__label} >Pick a question</label>
                    <select className={styles.form__label}>
                        <option>What is your favourite color?</option>
                        <option>What is your best friends name?</option>
                        <option>What city you were born?</option>
                    </select>

                    <div className={styles.form__label_input}>
                        <label className={styles.form__label} >You can use this to reset you password if forgot.</label>
                        <input onChange={answerChangeHandler} value={answer} className={styles.form__input} placeholder='Enter answer' type="text" />
                    </div>
                </div>
            </>

            <button disabled={!email || !newPassword || !answer || loading} className={`${styles.btn} ${styles.btn__submit}`}>{loading ? 'Loading...' : 'Submit'}</button>
        </form>
    )
}

export default ForgotPassForm;
