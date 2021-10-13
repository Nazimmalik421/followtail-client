import React, { useState, useContext } from 'react'
import { UserContext } from '../../context'
import { useRouter } from 'next/router'

import axios from 'axios'
import { toast } from 'react-toastify'
import ForgotPassForm from '../../components/forms/ForgotPassForm'
import RegisterSuccessModal from '../register/registerSuccessModal/registerSuccessModal'
import styles from './forgotPass.module.css'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [answer, setAnswer] = useState('')
    const [ok, setOk] = useState(false)
    const [loading, setLoading] = useState(false)

    const router = useRouter()
    const [state] = useContext(UserContext)

    const nameChangeHandler = (e) => {
        setName(e.target.value)
    }
    const emailChangeHandler = (e) => {
        setEmail(e.target.value)
    }
    const passwordChangeHandler = (e) => {
        setNewPassword(e.target.value)
    }
    const answerChangeHandler = (e) => {
        setAnswer(e.target.value)
    }

    const formSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API}/forgot-password`, {   //Before defining default URL
                email,
                newPassword,
                answer
            });
            console.log('FORGOT PASS DATA=>', data)
            if (data.error) {
                toast.error(data.error)
                setLoading(false)
            }
            if (data.success) {
                setEmail('')
                setNewPassword('')
                setAnswer('')
                setOk(data.ok)
                setLoading(false)
                toast.success(data.success)
            }
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    };

    //If user is loggedIn and tries to manually type /login in browser then this logic will prevent them to go on register page
    if (state && state.token) router.push('/')

    return (
        <div className={styles.register__container}>
            <div className={styles.container}>
                <h1 className={styles.register__heading}>Reset Password</h1>

                <div className={styles.form__container}>

                    <ForgotPassForm
                        email={email}
                        newPassword={newPassword}
                        answer={answer}
                        loading={loading}
                        formSubmitHandler={formSubmitHandler}
                        nameChangeHandler={nameChangeHandler}
                        emailChangeHandler={emailChangeHandler}
                        passwordChangeHandler={passwordChangeHandler}
                        answerChangeHandler={answerChangeHandler}
                    />

                </div>

                {ok && <RegisterSuccessModal closeModal={() => setOk(false)} />}

            </div>
        </div>
    )
}

export default ForgotPassword;
