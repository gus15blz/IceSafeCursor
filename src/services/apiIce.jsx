import axios from 'axios';

export const axiosInstance = axios.create ({
    baseURL: 'https://localhost:7223/',
    headers:{
        'Content-Type':'application/json'
    }
})