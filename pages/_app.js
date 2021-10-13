import { UserProvider } from "../context";
import Nav from "../components/navbar/Nav";
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import '../styles/global.css'


function MyApp({ Component, pageProps }) {
    
    return (
        <UserProvider>
            <Head>
                <link rel="stylesheet" href="/css/styles.css" />
            </Head>
            <Nav />
            <ToastContainer className='toast__font' position='top-center' />
            <Component {...pageProps} />
        </UserProvider>
    )
}

export default MyApp;