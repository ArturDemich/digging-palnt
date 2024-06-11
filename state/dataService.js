import axios from "axios";
import { Buffer } from 'buffer'

const username = 'alex';
const password = '';
const tok = `${username}:${password}`
const encodedToken = Buffer.from(tok).toString('base64')


const FB_API_URL = 'https://us-central1-digger-3000.cloudfunctions.net/dataDiggerWeb'
const NOTIFICATIONS_URL = 'https://landshaft.info/modules/viber/digger4.php'
const SEVE_TOKEN_URL = 'https://us-central1-digger-3000.cloudfunctions.net/saveToken'
const IP = '194.42.195.241'

export class DataService {

    static getStepOrders(stepId, storageId, token) {
        let stepOrders = axios.post(FB_API_URL, {
            URL: `http://${IP}:41001/UTP/hs/api/getStepOrders`,
            encodedToken: encodedToken,
            data: {
                token: token,
                stepId: stepId,
                storageId: storageId,
            }
        })
            .then((response) => response.data)
            .catch((error) => {
                alert(error)
                console.log(error);
            })
        return stepOrders
    }

    static getGroupOrders(stepId, storageId, token) {
        let groupOrders = axios.post(FB_API_URL, {
            URL: `http://${IP}:41001/UTP/hs/api/getStepOrders`,
            encodedToken: encodedToken,
            data: {
                token: token,
                stepId: stepId,
                storageId: storageId,
                groupByOrder: false
            }
        })
            .then((response) => response.data)
            .catch((error) => {
                alert(error)
                console.log(error);
            })
        return groupOrders
    }

    static getStoragesDig(token) {

        return axios.post(FB_API_URL, {
            URL: `http://${IP}:41001/UTP/hs/api/getStorages`,
            encodedToken: encodedToken,
            data: {
                token: token
            }
        })
            .then((response) => response.data)
            .catch((error) => {
                alert(error)
                console.log(error);
            })
    }


    static getSteps(token) {

        return axios.post(FB_API_URL, {
            URL: `http://${IP}:41001/UTP/hs/api/getSteps`,
            encodedToken: encodedToken,
            data: {
                token: token
            }
        })
            .then((response) => response.data)
            .catch((error) => {
                alert(error)
                console.log(error);
            })
    }


    static getToken(log, pass) {

        return axios.post(FB_API_URL, {
            URL: `http://${IP}:41001/UTP/hs/api/getToken`,
            encodedToken: encodedToken,
            data: {
                login: log,
                password: pass
            }
        })
            .then((response) => response.data)
            .catch((error) => {
                alert(error.response.data)
                console.log(error);
            })
    }


    static setNextStepGroup(token, dataOrders) {

        let stepOrders = axios.post(FB_API_URL, {
            URL: `http://${IP}:41001/UTP/hs/api/setNextOrderStep`,
            encodedToken: encodedToken,
            data: {
                token: token,
                stepdata: dataOrders
            }
        })
            .then((response) => response.data)
            .catch((error) => {
                alert(error)
                console.log(error);
            })

        return stepOrders
    }

    /////////////////////////
    static getNotifi(token) {

        return axios.post(NOTIFICATIONS_URL, { method: 'getNotifications', token: token },
            {
                headers: { 'Accept': '*/*' }
            })
            .then((response) => response.data)
            .catch((error) => {
                alert(error)
                console.log(error);
            })
    }
    static updateNotifi(token, messageid, mstatus) {

        return axios.post(NOTIFICATIONS_URL, {
            method: 'updateNotificationStatus',
            token: token,
            messageid: messageid,
            status: mstatus,
        })
            .then((response) => response.data)
            .catch((error) => {
                alert(error.response.data)
                console.log(error);
            })
    }

    static deleteNotifi(token, messageid) {

        return axios.post(NOTIFICATIONS_URL, {
            method: 'deleteNotification',
            token: token,
            messageid: messageid,
        })
            .then((response) => response.data)
            .catch((error) => {
                alert(error.response.data)
                console.log(error);
            })
    }

    static sendTokenDevice = (userTok, deviceTok, log) => {
        axios.post(SEVE_TOKEN_URL, {
            userToken: userTok,
            deviceToken: deviceTok,
            loged: log
        })
            .then((response) => console.log(response.data))
            .catch(error => {
                if (error.response) {
                    console.error('Статус відповіді:', error.response.status);
                    console.error('Дані відповіді:', error.response.data);
                    console.error('Заголовки відповіді:', error.response.headers);
                } else if (error.request) {
                    console.error('Запит відправлений, але не отримано відповіді:', error.request);
                } else {
                    console.error('Сталася помилка при виконанні запиту:', error.message);
                }
            });
    }

}

