import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context';
import UserPostCards from '../../components/userPostCards/UserPostCards';
import axios from 'axios';
import ConfirmationModal from '../../components/confirmationModal/ConfirmationModal';
import styles from '../user/dashboard.module.css';
import { toast } from 'react-toastify';
import AdminRoute from '../../components/routes/AdminRoute'


const Admin = () => {

    const [state] = useContext(UserContext);

    //POSTS
    const [posts, setPosts] = useState([]);
    const [del, setDel] = useState(false);
    const [showMadal, setShowModal] = useState(false);
    const [postDelete, setPostDelete] = useState([]);

    useEffect(() => {
        if (state && state.token) {
            newsfeed();
        };
    }, [state && state.token]);

    const newsfeed = async () => {

        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/posts`);
            setPosts(data);
        } catch (err) {
            console.log(err);
        }
    }

    const postDeleteConfirm = () => {
        postDeleteHandler(postDelete);
        console.log('POST DELETED BY ADMIN', postDelete)
        setDel(false);
        setShowModal(false)
    }
    const cancelDeleteHandler = () => {
        setDel(false);
        setShowModal(false)
    }
    const postDeleteHandler = async (deletePost) => {
        setPostDelete(deletePost);
        setShowModal(true)
        try {
            if (!del) return;
            const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_API}/admin/delete-post/${deletePost._id}`);
            toast.error('Post deleted!');
            newsfeed();
        } catch (err) {
            console.log(err);
        }

    }

    return (
        <AdminRoute>
            <div className={styles.dashboard__child_wrapper}>

                <div className={styles.dashboard__container}>
                    <div className={styles.newsfeed}>
                        <h1 className={styles.newsfeed__heading}>Admin</h1>
                    </div>

                    <UserPostCards setDel={setDel} postDeleteHandler={postDeleteHandler} posts={posts}
                        cancelDeleteHandler={cancelDeleteHandler} postDeleteConfirm={postDeleteConfirm}
                    />

                </div>
            </div>

            {showMadal && <ConfirmationModal cancelDeleteHandler={cancelDeleteHandler} postDeleteConfirm={postDeleteConfirm} />}

        </AdminRoute>
    )
}

export default Admin;
