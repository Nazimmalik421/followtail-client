import { createContext, useState, useEffect } from "react";
import axios from 'axios'
import { useRouter } from "next/router";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [state, setState] = useState({ user: {}, token: '' })
    const router = useRouter()

    const token = state && state.token ? state.token : '';

    //setting base URL so that we dont have to write complete URL for every request
    // axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;

    //if the Bearer token is available we wanna include it in the headers
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    useEffect(() => {
        setState(JSON.parse(window.localStorage.getItem('authDetails')))
    }, [])

    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    }, function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        let res = error.response;
        if (res.status === 401 && res.config && !res.config._isRetryRequest) {
            setState(null)
            window.localStorage.removeItem('authDetails')
            router.push('/login')
        }
        return Promise.reject(error);
    });

    return (
        <UserContext.Provider value={[state, setState]}>
            {children}
        </UserContext.Provider>
    )
}