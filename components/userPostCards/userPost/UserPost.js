import React, { useContext } from 'react'
import Link from 'next/link'
import renderHTML from 'react-render-html'
import moment from 'moment'
import PostImages from '../postImages/PostImages'
import { imageSource } from '../../../functions'
import { UserContext } from '../../../context'
import styles from './userPost.module.css'
import { HeartOutlined, HeartFilled, CommentOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'

const UserPost = (props) => {
    const { post, postDeleteHandler, setDel, unlikeHandler, likeHandler, handleComment, commentsCount = 10, deleteCommentHandler,
    } = props;
    const [state] = useContext(UserContext);
    const router = useRouter()


    return (
        <>
            {post && post.postedBy && < div key={post._id} className={styles.postarea__container} >
                <div className={styles.post__container}>
                    {state && state.user.role === 'Admin' && <button onClick={() => {postDeleteHandler(post); setDel(true)}} className={styles.admin__postdelete}>Delete Post</button>}
                    <div className={styles.post__header}>
                        <div className={styles.profile__container}>
                            <img className={styles.profile__img} src={imageSource(post.postedBy)} alt={post.username} />
                            {/* <Avatar className={styles.profile__img}>{post.postedBy.name[0]}</Avatar> */}
                            {/* <Avatar src={imageSource(post)} className={styles.profile__img} /> */}
                        </div>
                        <span>{post.postedBy.name}</span>
                        <span>{moment(post.createdAt).fromNow()}</span>
                    </div>

                    <div className={styles.post__body}>
                        <div className={styles.post__content}>{renderHTML(post.content)}</div>
                    </div>

                    {post.image && <PostImages url={post.image.url} />}

                    <div className={styles.post__footer}>
                        <div className={styles.post__likes_n_comment}>

                            {
                                state && state.user && post.likes && post.likes.includes(state.user._id) ? <HeartFilled onClick={() => unlikeHandler(post._id)} />
                                    : <HeartOutlined onClick={() => likeHandler(post._id)} />
                            }

                            <div className={styles.post__likes}>{post.likes.length} likes</div>
                            <CommentOutlined onClick={() => handleComment(post)} />
                            <div className={styles.post__comments}>
                                <Link href={`/post/${post._id}`} >
                                    <a >{post.comments.length} comments</a>
                                </Link>
                            </div>
                        </div>
                        {
                            state && state.user && state.user._id === post.postedBy._id &&
                            <div className={styles.edit__delete}>
                                <EditOutlined onClick={() => router.push(`/user/post/${post._id}`)} className={styles.btn__edit} />
                                <DeleteOutlined onClick={() => { postDeleteHandler(post); setDel(true); }} className={styles.btn__delete} />
                            </div>
                        }
                    </div>
                </div>
                {/*Display 2 comments */}
                {post.comments && post.comments.length > 0 && (
                    <div className={styles.comments__container}>
                        {
                            post.comments.slice(0, commentsCount).map(indComment => {
                                return < li key={indComment._id} className={styles.comments__list} >
                                    <div className={styles.comments__details}>
                                        <div className={styles.comments__card}>
                                            <div className={`${styles.commentor_profile_container} ${styles.profile__container}`}>
                                                <img className={styles.profile__img} src={imageSource(indComment.postedBy)} alt={post.username} />
                                            </div>
                                            <div className={styles.comments__name_text}>
                                                <div className={styles.commentor__name}>{indComment.postedBy.name}</div>
                                                <div className={styles.comment}>{indComment.text}</div>
                                            </div>
                                        </div>
                                        <div className={styles.time__deletbtn}>
                                            <div className={styles.comment__time}>{moment(indComment.created).fromNow()}</div>
                                            {state && state.user && state.user._id === indComment.postedBy._id && (
                                                <DeleteOutlined onClick={() => { deleteCommentHandler(post._id, indComment); setDel(true); }} className={styles.btn__delete__comment} />
                                            )}
                                        </div>
                                    </div>
                                </li>
                            })
                        }
                    </div>
                )
                }
            </div>}

        </>
    )

}

export default UserPost;
