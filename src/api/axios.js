import axios from 'axios';

export default axios.create( {
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        post: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            withCredentials: true,
        }
    }
} );