import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import UserPost from '../../components/userPostCards/userPost/UserPost';
import styles from './post.module.css'
import { CaretLeftOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import Link from 'next/link';
import ConfirmationModal from '../../components/confirmationModal/ConfirmationModal';

const PostComments = () => {
    const [post, setPost] = useState({});

    const [del, setDel] = useState(false);
    const [loading, setLoading] = useState(false);
    const [postDelete, setPostDelete] = useState([]);

    //delete comment
    const [postDeleteId, setPostDeleteId] = useState('')
    const [deleteComment, setDeleteComment] = useState('')

    const router = useRouter()
    const _id = router.query._id;

    useEffect(() => {
        if (_id) fetchPost()
    }, [_id])

    const fetchPost = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/user-post/${_id}`);
            setPost(data)
        } catch (err) {
            console.log(err)
        }
    }

    const likeHandler = async (postId) => {
        try {
            const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API}/like-post`, { _id: postId })
            console.log('LIKED DATA', data)
            fetchPost()
        } catch (err) {
            console.log(err)
        }
    }
    const unlikeHandler = async (postId) => {
        try {
            const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API}/unlike-post`, { _id: postId })
            console.log('UNLIKED DATA', data)
            fetchPost()
        } catch (err) {
            console.log(err)
        }
    }

    const postDeleteConfirm = () => {
        postDeleteHandler(postDelete);
        setDel(false);
    }
    const cancelDeleteHandler = () => {
        setDel(false);
        setLoading(false);
    }
    const postDeleteHandler = async (deletePost) => {
        setPostDelete(deletePost);
        setLoading(true);
        try {
            if (!del) return;
            const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_API}/delete-post/${deletePost._id}`);
            toast.error('Post deleted!');
            router.push('/user/dashboard')
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    }

    const commentDeleteConfirm = () => {
        deleteCommentHandler(postDeleteId, deleteComment)
        setDel(false);
    }
    const deleteCommentHandler = async (postId, comment) => {
        setDeleteComment(comment)
        setPostDeleteId(postId)
        setLoading(true)

        if (!del) return;
        try {
            const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API}/remove-comment`, { postId, comment })
            console.log('COMMENET REMOVED', data)
            toast.error('Comment deleted!');
            fetchPost()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <div className={styles.post__container}>
                <div className={styles.comments}>
                    <h1 className={styles.comments__heading}>Comments</h1>
                </div>
                <UserPost post={post} unlikeHandler={unlikeHandler} likeHandler={likeHandler} commentsCount={100}
                    postDeleteHandler={postDeleteHandler} postDeleteConfirm={postDeleteConfirm} cancelDeleteHandler={cancelDeleteHandler}
                    setDel={setDel}
                    deleteCommentHandler={deleteCommentHandler}
                />
                {/* <pre>{JSON.stringify(post, null, 4)}</pre> */}
                <Link href='/user/dashboard'>
                    <a><CaretLeftOutlined className={styles.back__btn} /></a></Link>
            </div>
            {del && <ConfirmationModal
                commentDeleteConfirm={commentDeleteConfirm}
                deleteComment={true}
                cancelDeleteHandler={cancelDeleteHandler}
                postDeleteConfirm={postDeleteConfirm}
            />}
        </>
    )
}

export default PostComments;
