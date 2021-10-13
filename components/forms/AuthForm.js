import React from 'react'
import styles from './authForm.module.css'

const AuthForm = (props) => {
    const { formSubmitHandler, nameChangeHandler, emailChangeHandler, passwordChangeHandler, answerChangeHandler, aboutChangeHandler, userNameChangeHandler,
        name, email, password, answer, loading, page, about, username, profileUpdate } = props;

    return (
        <form onSubmit={formSubmitHandler}>

            {profileUpdate && <div className={styles.form__label_input}>
                <label className={styles.form__label} htmlFor="username">Username:</label>
                <input onChange={userNameChangeHandler} value={username || ''} className={styles.form__input} placeholder='Enter Username' id='username' type="text" />
            </div>}

            {profileUpdate && <div className={styles.form__label_input}>
                <label className={styles.form__label} htmlFor="about">About:</label>
                <input onChange={aboutChangeHandler} value={about || ''} className={styles.form__input} placeholder='Enter about yourself...' id='about' type="text" />
            </div>}

            {page !== 'login' && <div className={styles.form__label_input}>
                <label className={styles.form__label} htmlFor="name">Name:</label>
                <input onChange={nameChangeHandler} value={name || ''} className={styles.form__input} placeholder='Enter Name' id='name' type="text" />
            </div>
            }

            <div className={styles.form__label_input}>
                <label className={styles.form__label} htmlFor="email">Email:</label>
                <input disabled={profileUpdate} onChange={emailChangeHandler} value={email || ''} className={styles.form__input} placeholder='Enter email' id='email' type="email" />
            </div>


            <div className={styles.form__label_input}>
                <label className={styles.form__label} htmlFor="password">Password:</label>
                <input onChange={passwordChangeHandler} value={password || ''} className={styles.form__input} placeholder='Enter password' id='password' type="password" autoComplete="on" />
            </div>

            {
                page !== 'login' && <>
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
            }

            <button disabled={profileUpdate ? loading : page === 'login' ? !email || !password || loading : !name || !email || !password || !answer || loading} className={`${styles.btn} ${styles.btn__submit}`}>{loading ? 'Loading...' : 'Submit'}</button>
        </form>
    )
}

export default AuthForm;
