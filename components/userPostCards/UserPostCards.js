import React, { useContext } from 'react'
import { UserContext } from '../../context'
import { useRouter } from 'next/router'
import UserPost from './userPost/UserPost'

const UserPostCards = (props) => {
    const { posts, postDeleteHandler, setDel, unlikeHandler, likeHandler, handleComment, commentDeleteConfirm
        , deleteCommentHandler } = props;

    return (
        <>
            {
                posts && posts.map(post => <UserPost key={post._id} post={post} deleteCommentHandler={deleteCommentHandler}
                    postDeleteHandler={postDeleteHandler} setDel={setDel} unlikeHandler={unlikeHandler}
                    likeHandler={likeHandler} handleComment={handleComment} commentDeleteConfirm={commentDeleteConfirm} />)
            }
        </>
    )
}

export default UserPostCards;
