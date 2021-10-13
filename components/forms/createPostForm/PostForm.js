import React from 'react'
// import ReactQuill from 'react-quill';//It doesnt support SSR therefore it wont work like this import
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css';
import styles from './createPostForm.module.css'
import { CameraOutlined, LoadingOutlined } from '@ant-design/icons';

const PostForm = (props) => {
    const { content, setContent, contentSubmitHandler, handleImage, uploading, image } = props;

    const contentChangeHandler = (e) => {
        setContent(e)
    }

    return (
        <div className={styles.card}>
            <div className={styles.card__body}>
                <form>
                    <ReactQuill
                        theme='snow' onChange={contentChangeHandler} value={content} className={styles.ReactQuill} placeholder='Write something...' />
                </form>
            </div>

            <div className={styles.card__Footer}>
                <button disabled={!content} onClick={contentSubmitHandler} className={styles.btn__submit}>POST</button>

                <label >
                    {image && image.url ?
                        <div className={styles.image__container}>
                            <img className={styles.image__preview} src={image.url} alt="uploaded image" />
                        </div>
                        : uploading ? <LoadingOutlined className={styles.camera__icon} /> : <CameraOutlined className={styles.camera__icon} />}

                    <input onChange={handleImage} type="file" accept='images/*' hidden />
                </label>
            </div>

        </div>
    )
}

export default PostForm;
