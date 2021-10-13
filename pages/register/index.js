import React, { useState, useContext } from 'react'
import { UserContext } from '../../context'
import Link from 'next/link'
import { useRouter } from 'next/router'

import axios from 'axios'
import { toast } from 'react-toastify'
import AuthForm from '../../components/forms/AuthForm'
import RegisterSuccessModal from './registerSuccessModal/registerSuccessModal'
import styles from './register.module.css'

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setpassword] = useState('')
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
        setpassword(e.target.value)
    }
    const answerChangeHandler = (e) => {
        setAnswer(e.target.value)
    }

    const formSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API}/register`, {   //Before defining default URL
                // const { data } = await axios.post(`/register`, {
                name,
                email,
                password,
                answer
            });

            if (data.error) {
                toast.error(data.error)
                setLoading(false)
            } else {
                setName('')
                setEmail('')
                setpassword('')
                setAnswer('')
                setOk(data.ok)
                setLoading(false)
            }
        } catch (err) {
            toast.error(err.response.data)
            setLoading(false)
        }
    };

    //If user is loggedIn and tries to manually type /login in browser then this logic will prevent them to go on register page
    if (state && state.token) router.push('/user/dashboard')

    return (
        <div className={styles.register__container}>
            <div className={styles.container}>
                <h1 className={styles.register__heading}>Register</h1>

                <div className={styles.form__container}>

                    <AuthForm
                        name={name}
                        email={email}
                        password={password}
                        answer={answer}
                        loading={loading}
                        formSubmitHandler={formSubmitHandler}
                        nameChangeHandler={nameChangeHandler}
                        emailChangeHandler={emailChangeHandler}
                        passwordChangeHandler={passwordChangeHandler}
                        answerChangeHandler={answerChangeHandler}
                    />

                </div>

                <Link href='/login'>
                    <a className={styles.login__link} >Already registred? Login</a>
                </Link>

                {ok && <RegisterSuccessModal closeModal={() => setOk(false)} />}

            </div>
        </div>
    )
}

export default Register;
