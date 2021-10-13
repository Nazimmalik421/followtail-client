import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { SyncOutlined } from '@ant-design/icons';
import PostForm from '../../components/forms/createPostForm/PostForm';
import UserRoute from '../../components/routes/UserRoute';
import { UserContext } from '../../context';
import UserPostCards from '../../components/userPostCards/UserPostCards';
import axios from 'axios';
import ConfirmationModal from '../../components/confirmationModal/ConfirmationModal';
import styles from './dashboard.module.css';
import { toast } from 'react-toastify';
import FollowPeopleCard from '../../components/userPostCards/followPeopleCard/FollowPeopleCard';
import SearchUser from '../../components/searchUser/SearchUser';
import CommentModal from '../../components/commentModal/CommentModal';
import { Pagination } from 'antd';
import io from 'socket.io-client'

const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, { path: '/socket.io' }, {
    reconnection: true
})

const Dashboard = () => {

    const [state, setState] = useContext(UserContext);
    //STATE
    const [content, setContent] = useState('');
    const [image, setImage] = useState({});
    const [uploading, setUploading] = useState(false);
    //POSTS
    const [posts, setPosts] = useState([]);
    const [del, setDel] = useState(false);
    const [postDelete, setPostDelete] = useState([]);
    const [loading, setLoading] = useState(false);
    //PEOPLE
    const [people, setPeople] = useState([]);
    //COMMENTS
    const [comment, setComment] = useState('');
    const [visible, setVisible] = useState(false);
    const [currentPost, setCurrentPost] = useState({});

    //PAGINATION
    const [postNumbers, setPostsNumbers] = useState(0)
    const [page, setPage] = useState(1)
    // console.log(page)

    //DELETECOMMENT
    const [postDeleteId, setPostDeleteId] = useState('')
    const [deleteComment, setDeleteComment] = useState('')
    const [deletingComment, setDeletingComment] = useState(false)

    useEffect(() => {
        if (state && state.token) {
            newsfeed();
            findPeople();
        };
    }, [state && state.token, page]);

    useEffect(() => {

        const fetchPostNumber = async () => {
            try {

                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/total-post`)
                setPostsNumbers(data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchPostNumber()
    }, [])

    const newsfeed = async () => {

        try {
            //This will only show the posts for user we are following
            // const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/user-posts`);
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/newsfeed/${page}`);
            // console.log('USER POSTS=>', data)
            setPosts(data);
        } catch (err) {
            console.log(err);
        }
    }
    const findPeople = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/find-people`);
            // console.log('PEOPLE TO FOLLOW', data)
            setPeople(data);
        } catch (err) {
            console.log(err);
        }
    }
    const contentSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API}/create-post`, { content, image });//This content will be send to backend as request body
            // console.log('CREATE POST RES =>', data);
            if (data.error) {
                toast.error(data.error);
            } else {
                setPage(1)//If we are on page other than 1 and we upload post then we wont see that post bcz we are not on page 1. so setting page 1
                newsfeed();
                toast.success('Post created');
                setContent('');
                setImage({});
                //socket    
                socket.emit('new-post', data)
            }
        } catch (err) {
            console.log(err);
        }
    }
    const handleImage = async (e) => {
        const file = e.target.files[0];
        let formData = new FormData();   //This form data is available in browser environment
        // formData.append('content', content) //Sending content and image to our backend
        formData.append('image', file);  //The 1st arg is key/name and 2nd is actual value which is file
        // console.log([...formData])
        setUploading(true);
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API}/upload-image`, formData);
            // console.log('UPLOADED IMAGE DAT=>', data);
            setImage({ url: data.url, public_id: data.public_id });
            setUploading(false);
            // console.log('IMAGE AFTER UPLOADING', image)
        } catch (err) {
            console.log(err);
            setUploading(false);
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
            newsfeed();
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }

    }
    const followUserHandler = async (user) => {
        // console.log('FOLLOWING THIS USER', user);
        try {
            const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API}/follow-user`, { _id: user._id });
            // console.log('handler Follow response', data)

            //update local storage, keep token
            let auth = JSON.parse(localStorage.getItem('authDetails'));
            auth.user = data;
            localStorage.setItem('authDetails', JSON.stringify(auth));

            //update context
            setState({ ...state, user: data });

            //Update people state
            let filteredPeople = people.filter(person => person._id !== user._id);
            setPeople(filteredPeople);

            //Rerender newsfeed post as per following people
            newsfeed()
            //Success msg 
            toast.success(`Now you are following '${user.name}'`)

        } catch (err) {
            console.log(err);
        }
    }

    const likeHandler = async (postId) => {
        // console.log('THIS POST GOT A LIKE', postId)
        try {
            const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API}/like-post`, { _id: postId })
            // console.log('LIKED DATA', data)
            newsfeed()
        } catch (err) {
            console.log(err)
        }
    }
    const unlikeHandler = async (postId) => {
        // console.log('UNLIKE THIS POST', postId)
        try {
            const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API}/unlike-post`, { _id: postId })
            // console.log('UNLIKED DATA', data)
            newsfeed()
        } catch (err) {
            console.log(err)
        }
    }

    const handleComment = (post) => {
        // console.log('POST FROM COMMENT', post)
        setCurrentPost(post)
        setVisible(true)
    }

    const commentSubmitHandler = async (e, curPost) => {
        e.preventDefault()
        // console.log('ADD COMMENT TO THIS POST', curPost._id)
        // console.log('SAVE COMMENT TO DATABASE', comment)

        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API}/add-comment`, { postId: curPost._id, comment });
            // console.log('ADD COMMENT RES=>', data)
            setComment('');
            setVisible(false);
            newsfeed();
        } catch (err) {
            console.log(err)
        }
    }

    // removeCommentHandler 
    const commentDeleteConfirm = () => {
        deleteCommentHandler(postDeleteId, deleteComment)
        setDel(false);
    }
    const deleteCommentHandler = async (postId, comment) => {
        setPostDeleteId(postId)
        setDeleteComment(comment)
        setLoading(true)
        setDeletingComment(true)

        if (!del) return;
        try {
            const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API}/remove-comment`, { postId, comment })
            // console.log('COMMENET REMOVED', data)
            toast.error('Comment deleted!');
            newsfeed()
            setLoading(false)
        } catch (err) {
            console.log(err)
        }
    }
    const commentChangeHandler = (e) => {

        setComment(e.target.value)

    }

    return (
        <UserRoute>
            <div className={styles.dashboard__child_wrapper}>

                <div className={styles.dashboard__container}>
                    <div className={styles.newsfeed}>
                        <h1 className={styles.newsfeed__heading}>NewsFeed</h1>
                    </div>

                    <div className={styles.createpostform__container}>
                        <PostForm content={content} setContent={setContent} contentSubmitHandler={contentSubmitHandler}
                            handleImage={handleImage} uploading={uploading} image={image} />
                    </div>

                    <UserPostCards handleComment={handleComment} likeHandler={likeHandler} unlikeHandler={unlikeHandler}
                        setDel={setDel} postDeleteHandler={postDeleteHandler} posts={posts}
                        commentDeleteConfirm={commentDeleteConfirm} deleteCommentHandler={deleteCommentHandler}
                    />

                    <Pagination showSizeChanger={false} current={page} total={(postNumbers / 3) * 10} onChange={value => setPage(value)} className={styles.pagination} />

                    {del && <ConfirmationModal commentDeleteConfirm={commentDeleteConfirm} deletingComment={deletingComment} cancelDeleteHandler={cancelDeleteHandler} postDeleteConfirm={postDeleteConfirm} />}

                    {loading && <div className={styles.spinner}><SyncOutlined spin className={`${styles.loading__spinner}`} /></div>}
                </div>
                <div className={styles.sidebar__container}>
                    <SearchUser />
                    <br />
                    {/* <pre>{JSON.stringify(people, null, 4)}</pre> */}
                    <div className={styles.following__container}>
                        {
                            state && state.user && state.user.following && <Link href='/user/following'>
                                <a className={styles.following__numbers}>{state.user.following.length} Following</a>
                            </Link>
                        }
                    </div>
                    <FollowPeopleCard followUserHandler={followUserHandler} people={people} />
                </div>

                {visible && <CommentModal currentPost={currentPost}
                    comment={comment} commentSubmitHandler={commentSubmitHandler}
                    setVisible={setVisible} commentChangeHandler={commentChangeHandler} />}
            </div>

        </UserRoute>
    )
}

export default Dashboard;
