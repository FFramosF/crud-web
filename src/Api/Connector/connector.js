import axios from 'axios';
const baseURL = 'http://localhost:8080';

export const connector = (path, method, data, params, responseType = 'json', ContentType = 'application/json; charset=utf-8;')  => {
    return new Promise((resolve, reject) => {
        const url = `${baseURL}/${path}`;
        const requestData = {
            url,
            data,
            method,
            params,
            responseType, headers: {'content-type': ContentType, 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS"}
        };
        axios.request(requestData).then((response) => {
            resolve(response);
        }).catch((err) => {
            reject(err);
        });
    })
}