import { useState, useContext } from 'react';
import { UserContext } from '../../context';
import FollowPeopleCard from '../userPostCards/followPeopleCard/FollowPeopleCard';
import axios from 'axios';
import styles from './searchUser.module.css';
import { SearchOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const SearchUser = () => {
    const [state, setState] = useContext(UserContext);
    const [query, setQuery] = useState('');
    const [searchResult, setSearchResult] = useState([])

    const searchUser = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/search-user/${query}`)
            console.log('SEARCH USER RES=>', data)
            setSearchResult(data)
        } catch (err) {
            console.log(err)
        }
    }

    const searchUserChangeHandler = e => {
        setQuery(e.target.value)
        //this logic will help me to remove the searched user from card if I cleared the input to search other user
        if (e.target.value === '') {
            setSearchResult([])
        }
    }

    const followUserHandler = async (user) => {
        try {
            const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API}/follow-user`, { _id: user._id });

            //update local storagee when user follow someone, keep token
            let auth = JSON.parse(localStorage.getItem('authDetails'));
            auth.user = data;
            localStorage.setItem('authDetails', JSON.stringify(auth));

            //update context with latest states
            setState({ ...state, user: data });

            //Update people state
            let filteredPeople = searchResult.filter(person => person._id !== user._id);
            setSearchResult(filteredPeople);

            //Success msg 
            toast.success(`Now you are following '${user.name}'`)

        } catch (err) {
            console.log(err);
        }
    }
    const unfollowUserHandler = async (unFllwUser) => {
        try {
            const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API}/unfollow-user`, { _id: unFllwUser._id })

            //update local storage when user unfollow someone, keep token
            let auth = JSON.parse(localStorage.getItem('authDetails'));
            auth.user = data;
            localStorage.setItem('authDetails', JSON.stringify(auth));

            //update context with latest states
            setState({ ...state, user: data });

            //Update people state
            let filteredPeople = searchResult.filter(person => person._id !== unFllwUser._id);
            setSearchResult(filteredPeople);

            //Success msg 
            toast.error(`You unfollowed '${unFllwUser.name}'`)

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <form onSubmit={searchUser} className={styles.searchuser__form}>
                <input className={styles.searchuser__input} type="search" placeholder='Search user' onChange={searchUserChangeHandler} />
                <button className={styles.searchuser__btn}><SearchOutlined /></button>
            </form>

            {searchResult && searchResult.map(user => (
                <FollowPeopleCard followUserHandler={followUserHandler}
                    unfollowUserHandler={unfollowUserHandler} key={user._id} people={searchResult} />
            ))}
        </>
    )
}

export default SearchUser;
