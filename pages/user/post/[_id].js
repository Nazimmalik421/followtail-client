import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import UserRoute from "../../../components/routes/UserRoute";
import PostForm from "../../../components/forms/createPostForm/PostForm";
import axios from 'axios'
import styles from './editPost.module.css'
import { toast } from 'react-toastify'

const EditPost = () => {
    const [post, setPost] = useState()

    const [content, setContent] = useState('')
    const [image, setImage] = useState({})
    const [uploading, setUploading] = useState(false)

    const router = useRouter();
    const _id = router.query._id;


    useEffect(() => {
        if (_id) editPostHandler()
    }, [_id])

    const editPostHandler = async () => {

        try {
            //requesting server with this post _id to read the post from server and adding post into data
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/user-post/${_id}`)
            setPost(data)
            setContent(data.content)
            setImage(data.image)
        } catch (err) {
            console.log(err)
        }
    }

    const contentSubmitHandler = async (e) => {
        e.preventDefault()

        try {
            const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API}/update-post/${_id}`, { content, image })
            if (data.error) {
                toast.error(data.error)
            } else {
                toast.success('Post Updated!')
                router.push('/user/dashboard')
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleImage = async (e) => {
        const file = e.target.files[0];
        let formData = new FormData()   //This form data is available in browser environment
        // formData.append('content', content) //Sending content and image to our backend
        formData.append('image', file)  //The 1st arg is key/name and 2nd is actual value which is file
        setUploading(true)
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API}/upload-image`, formData)
            console.log('UPLOADED IMAGE DAT=>', data)

            setImage({ url: data.url, public_id: data.public_id })
            setUploading(false)
            console.log('IMAGE AFTER UPLOADING', image)
        } catch (err) {
            console.log(err)
            setUploading(false)
        }

    }

    return (
        <UserRoute>
            <div className={styles.updatepost__container}>
                <div className={styles.newsfeed}>
                    <h1 className={styles.newsfeed__heading}>Update Post</h1>
                </div>

                <div className={styles.createpostform__container}>
                    <PostForm content={content} setContent={setContent} contentSubmitHandler={contentSubmitHandler}
                        handleImage={handleImage} uploading={uploading} image={image} />
                </div>
            </div>

        </UserRoute>
    )
}

export default EditPost;
