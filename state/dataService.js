import axios from "axios";
import * as SecureStore from 'expo-secure-store'
import { Buffer } from 'buffer'

const username = 'alex';
const password = '';
const tok = `${username}:${password}`
const encodedToken = Buffer.from(tok).toString('base64')


const NOTIFICATIONS_URL = 'https://landshaft.info/modules/viber/digger4.php'
const SEVE_TOKEN_URL = 'https://us-central1-digger-3000.cloudfunctions.net/saveToken'
const NEW_V_URL = 'https://digger-3000-default-rtdb.europe-west1.firebasedatabase.app/newVersion.json?print=pretty'

export class DataService {

    static getNewVersion() {
        let newVersion = axios.get(NEW_V_URL)
            .then((response) => response.data)
            .catch((error) => {
                alert(error)
                console.log(error);
            })
        return newVersion
    }

    static async getStepOrders(stepId, storageId, token) {
        let url = await SecureStore.getItemAsync('getStepOrders')
        let stepOrders = await axios.post(url ? url : null, {
            token: token,
            stepId: stepId,
            storageId: storageId,
        }, {
            headers: { 'Authorization': 'Basic ' + encodedToken }
        })
            .then((response) => response.data)
            .catch((error) => {
                alert(error)
                console.log(error);
            })
        return stepOrders
    }

    static async getGroupOrders(stepId, storageId, token) {
        let url = await SecureStore.getItemAsync('getStepOrders')
        let groupOrders = await axios.post(url ? url : null, {
            token: token,
            stepId: stepId,
            storageId: storageId,
            groupByOrder: false
        }, {
            headers: { 'Authorization': 'Basic ' + encodedToken }
        })
            .then((response) => response.data)
            .catch((error) => {
                alert(error)
                console.log(error);
            })
        return groupOrders
    }

    static async getStoragesDig(token) {
        let url = await SecureStore.getItemAsync('getStorages')
        return await axios.post(url ? url : null, { token: token }, {
            headers: { 'Authorization': 'Basic ' + encodedToken }
        })
            .then((response) => response.data)
            .catch((error) => {
                alert(error)
                console.log(error);
            })
    }

    static async getSteps(token) {
        let url = await SecureStore.getItemAsync('getSteps')
        return await axios.post(url ? url : null, { token: token }, {
            headers: { 'Authorization': 'Basic ' + encodedToken }
        })
            .then((response) => response.data)
            .catch((error) => {
                alert(error)
                console.log(error);
            })
    }


    static async getToken(log, pass) {
        //let url = await SecureStore.getItemAsync('getToken')
        console.log('getTok')
        return await axios.post(url, { login: log, password: pass }, {
            headers: { 'Authorization': 'Basic ' + encodedToken }
        })
            .then((response) => response.data)
            .catch((error) => {
                alert(error.response.data)
                console.log(error);
            })
    }

    static async setNextStepGroup(token, dataOrders) {
        let url = await SecureStore.getItemAsync('setNextOrderStep')
        let stepOrders = await axios.post(url ? url : null, {
            token: token,
            stepdata: dataOrders
        }, {
            headers: { 'Authorization': 'Basic ' + encodedToken }
        })
            .then((response) => response.data)
            .catch((error) => {
                alert(error)
                console.log(error);
            })

        return stepOrders
    }

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

