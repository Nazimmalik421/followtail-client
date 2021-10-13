import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { UserContext } from '../context'
import PublicPost from '../components/userPostCards/publicPosts/PublicPosts'
import styles from './index.module.css'
import Head from 'next/head';
import Link from 'next/link'
import io from 'socket.io-client'

const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, {path: '/socket.io'}, {
    reconnection: true
})

const Home = (props) => {
    const { posts } = props;
    const [state, setState] = useContext(UserContext)
    const [newsFeed, setNewsFeed] = useState([])

    useEffect(() => {
        // console.log('SOCKET IO ON JOIN', socket)
        socket.on('new-post', (newPost) => {
            setNewsFeed([newPost, ...posts])
        })
    }, [])

    const collection = newsFeed.length > 0 ? newsFeed : posts;

    const head = () => (
        <Head>
            <title>MERN: Fullstack social network developed using Mongo, Express, React.js frame work called Next.js and Node.js</title>
            <meta name='description' content='A course I enrolled in to learn fullstack development' />
            <meta property='og:description' content='Fedup using facebook and its undesired tracking of your activites?' />
            <meta property='og:type' content='website' />
            <meta property='og:site_name' content='FollowTail' />
            <meta property='og:url' content='http://FollowTail.com' />
            <meta property='og:image:secure_url' content='http://FollowTail.com/images/default.jpg' />
        </Head>
    )

    return (
        <>
            {head()}
            <div className={styles.homepage}>
                <h1 className={styles.homepage__heading}>Home</h1>
                {/* <pre>{JSON.stringify(posts, null, 4)}</pre> */}
                {collection.map(post => (
                    <Link href={`/post/view/${post._id}`} key={post._id} className={styles.singlepost__link}>
                        <a>
                            <PublicPost post={post} />
                        </a>
                    </Link>
                ))}

            </div>
        </>
    )
}

export async function getServerSideProps() {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/posts`);
    // console.log(data)
    return {
        props: {
            posts: data
        }
    }
}

export default Home;
