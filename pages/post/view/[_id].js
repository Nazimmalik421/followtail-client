import React, { useContext } from 'react'
import axios from 'axios'
import PublicPost from '../../../components/userPostCards/publicPosts/PublicPosts'
import styles from '../../index.module.css'
import Head from 'next/head';

const SinglePost = (props) => {
    const { post } = props;

    const imageSource = post => {
        if (post.image) {
            return post.image.url
        } else {
            '/images/working-desk.jpg'
        }
    }

    const head = () => (
        <Head>
            <title>MERN: Fullstack social network developed using Mongo, Express, React.js frame work called Next.js and Node.js</title>
            <meta name='description' content={post.content} />
            <meta property='og:description' content='Fedup using facebook and its undesired tracking of your activites?' />
            <meta property='og:type' content='website' />
            <meta property='og:site_name' content='FollowTail' />
            <meta property='og:url' content={`http://FollowTail.com/post/view/${post._id}`} />
            <meta property='og:image:secure_url' content={imageSource(post)} />
        </Head>
    )


    return (
        <>
            {head()}
            <div className={styles.homepage}>
                <h1 className={styles.homepage__heading}>Post</h1>
                <PublicPost post={post} />
            </div>
        </>
    )
}

export async function getServerSideProps(ctx) { //This context gives us req & res object access
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/post/${ctx.params._id}`);
    return {
        props: {
            post: data
        }
    }
}

export default SinglePost;
