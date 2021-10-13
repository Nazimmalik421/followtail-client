import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../../context';
import { toast } from 'react-toastify';
import Link from 'next/link';
import AuthForm from '../../components/forms/AuthForm';
import styles from './loginForm.module.css';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setpassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [state, setState] = useContext(UserContext);

    const router = useRouter();

    const emailChangeHandler = (e) => {
        setEmail(e.target.value)
    }
    const passwordChangeHandler = (e) => {
        setpassword(e.target.value)
    }
    // console.log(email, password)

    const formSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API}/login`, {
                email,
                password,
            });

            if (data.error) {
                toast.error(data.error)
                setLoading(false)
            } else {
                // console.log(data)
                setState({ user: data.user, token: data.token })
                //Save data into local storage
                window.localStorage.setItem('authDetails', JSON.stringify(data))
                router.push('/user/dashboard')
            }
        } catch (err) {
            console.log(err)
            toast.error(err.response.data)
            setLoading(false)
        }
    };

    //If user is loggedIn and tries to manually type /login in browser then this logic will prevent them to go on login page
    if (state && state.token) router.push('/user/dashboard')

    return (
        <div className={styles.login__container}>
            <div className={styles.container}>
                <h1 className={styles.login__heading}>Login</h1>

                <div className={styles.form__container}>

                    <AuthForm
                        email={email}
                        password={password}
                        loading={loading}
                        formSubmitHandler={formSubmitHandler}
                        emailChangeHandler={emailChangeHandler}
                        passwordChangeHandler={passwordChangeHandler}
                        page='login'
                    />

                </div>

                <div className={styles.link__container}>
                    <Link href='/register'>
                        <a className={styles.register__link} >Not registered?</a>
                    </Link>
                    <Link href='/forgot-password'>
                        <a className={styles.register__link} >Forgot password?</a>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login;
