import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from '../../../context'
import { useRouter } from 'next/router'
import RegisterSuccessModal from '../../register/registerSuccessModal/registerSuccessModal'
import { CameraOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios'
import { toast } from 'react-toastify'
import AuthForm from '../../../components/forms/AuthForm'
import styles from './update.module.css'

const Register = () => {
    const [username, setUsername] = useState('')
    const [about, setAbout] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setpassword] = useState('')
    const [answer, setAnswer] = useState('')
    const [ok, setOk] = useState(false)
    const [loading, setLoading] = useState(false)
    const [popUp, setPopUp] = useState(false)

    //Profile image
    const [image, setImage] = useState({})
    const [uploading, setUploading] = useState(false)

    const router = useRouter()
    const [state, setState] = useContext(UserContext)

    useEffect(() => {

        if (state && state.user) {
            setUsername(state.user.username)
            setAbout(state.user.about)
            setName(state.user.name)
            setEmail(state.user.email)
            setImage(state.user.image)
        }
    }, [state && state.user])

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
    const userNameChangeHandler = (e) => {
        setUsername(e.target.value)
    }
    const aboutChangeHandler = (e) => {
        setAbout(e.target.value)
    }
    const closePopup = () => {
        setPopUp(prevState => !prevState)
    }

    const formSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API}/profile-update`, {   //Before defining default URL
                // const { data } = await axios.post(`/register`, {
                username,
                about,
                name,
                email,
                password,
                answer,
                image
            });
            console.log('UPDATE RESPONSE =>', data)
            if (data.error) {
                toast.error(data.error)
                setLoading(false)
            } else {

                //Update local storage, update user, keep token
                let authDetails = JSON.parse(localStorage.getItem('authDetails'))
                authDetails.user = data;    //Setting response data from server into our local storage
                localStorage.setItem('authDetails', JSON.stringify(authDetails))
                //Update context
                setState({ ...state, user: data })

                setOk(true)
                setLoading(false)
                setPopUp(true)
            }
        } catch (err) {
            toast.error(err.response.data)
            setLoading(false)
        }
    };

    const handleImage = async (e) => {
        const file = e.target.files[0];
        let formData = new FormData()   //This form data is available in browser environment
        // formData.append('content', content) //Sending content and image to our backend
        formData.append('image', file)  //The 1st arg is key/name and 2nd is actual value which is file
        setUploading(true)
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API}/upload-image`, formData)
            setImage({ url: data.url, public_id: data.public_id })
            setUploading(false)
        } catch (err) {
            console.log(err)
            setUploading(false)
        }
    }

    return (
        <div className={styles.register__container}>
            <div className={styles.container}>
                <h1 className={styles.register__heading}>Profile Update</h1>
                {/* PROFILE IMAGE */}
                <label className={styles.image__uploading_container} >
                    {image && image.url ?
                        <div className={styles.image__container}>
                            <img className={styles.image__preview} src={image.url} alt="upload image" />
                        </div>
                        : uploading ? <LoadingOutlined className={styles.camera__icon} /> : <CameraOutlined className={styles.camera__icon} />}

                    <input onChange={handleImage} type="file" accept='images/*' hidden />
                </label>

                <div className={styles.form__container}>

                    <AuthForm
                        profileUpdate={true}
                        about={about}
                        username={username}
                        name={name}
                        email={email}
                        password={password}
                        answer={answer}
                        loading={loading}
                        aboutChangeHandler={aboutChangeHandler}
                        userNameChangeHandler={userNameChangeHandler}
                        formSubmitHandler={formSubmitHandler}
                        nameChangeHandler={nameChangeHandler}
                        emailChangeHandler={emailChangeHandler}
                        passwordChangeHandler={passwordChangeHandler}
                        answerChangeHandler={answerChangeHandler}
                    />

                </div>

            </div>
            {popUp && <RegisterSuccessModal closePopup={closePopup} profileUpdate={true} />}
        </div>
    )
}

export default Register;
