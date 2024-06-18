import axios from 'axios';

export default axios.create(
    {
        baseURL: `http://192.168.0.41:8000/`,
        headers: {
            post: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                withCredentials: true,
            }
        }
    } );