import { DataService } from "./dataService"
import * as SecureStore from 'expo-secure-store'
import * as FileSystem from 'expo-file-system'
import RNFS from 'react-native-fs'
import {
  setDigStorages, setStepOrders,
  setSteps, setToken, setCurrentStep,
  setGroupOrders,
  setNotifications,
  setTotalQty,
  setCurrentColorStep
} from "./dataSlice"
import { Platform } from "react-native"


export const getOrdersStep = (stepId, storageId, token) => async (dispatch) => {
  try {
    const res = await DataService.getStepOrders(stepId.id, storageId, token)
    if (res.success) {
      dispatch(setStepOrders(res))

      let productQty = 0
      res.data.forEach(elem => elem.products.forEach(el => productQty += el.qty))
      const total = {
        orders: res.data.length,
        plants: productQty
      }
      dispatch(setTotalQty(total))
    } else {
      console.log('Something went wrong!', res.errors)
    }
  } catch (error) {
    console.log("GetStep_ORDERS ERROR Thunk: " + JSON.stringify(error));
  }
}

export const getGroupOrdersThunk = (stepId, storageId, token) => async (dispatch) => {
  try {
    const res = await DataService.getGroupOrders(stepId.id, storageId, token)
    if (res.success) {
      dispatch(setGroupOrders(res))

      let productQty = 0
      res.data.forEach(elem => elem.orders.forEach(el => productQty += el.qty))
      const total = {
        orders: 0,
        plants: productQty
      }
      dispatch(setTotalQty(total))
    } else {
      console.log('Something went wrong!', res.errors)
    }
  } catch (error) {
    console.log("GetStep_ORDERS ERROR Thunk: " + JSON.stringify(error));
  }
}

export const getDigStorages = (token) => async (dispatch) => {
  try {
    const res = await DataService.getStoragesDig(token)
    if (res.success) {
      dispatch(setDigStorages(res));
    } else {
      console.log('Something went wrong!', res.errors)
    }
  } catch (error) {
    console.log("GetDig_STORAGES ERROR Thunk: " + JSON.stringify(error));
  }
}

export const getStep = (token) => async (dispatch) => {
  try {
    const res = await DataService.getSteps(token)
    if (res.success) {
      dispatch(setSteps(res))
      dispatch(setCurrentStep(res.data[0]))
      dispatch(setCurrentColorStep(res.data[0].theme))
    } else {
      console.log('Something went wrong!', res.errors)
    }
  } catch (error) {
    console.log("Get_STEP ERROR Thunk: " + JSON.stringify(error));
  }
}

export const getNewVersion = () => async (dispatch) => {
  try {
    const res = await DataService.getNewVersion()
    return await res
  } catch (error) {
    console.log("Get_STEP ERROR Thunk: " + JSON.stringify(error));
  }
}

export const getTokenThunk = (log, pass) => async (dispatch) => {
  try {
    const res = await DataService.getToken(log, pass)
    console.log(res)
    if (res.success) {
      dispatch(setToken(res.data))
      if(Platform.OS === 'web') {
        await localStorage.setItem('token', JSON.stringify(res.data))
      } else {
        await SecureStore.setItemAsync('token', JSON.stringify(res.data))
      }
    } else {
      alert(res.errors[0])
    }
  } catch (error) {
    console.log("Get_STEP ERROR Thunk: " + JSON.stringify(error));
  }
}

export const getNotifiThunk = (token) => async (dispatch) => {
  try {
    const res = await DataService.getNotifi(token)
    if (res.success) {
      const filterNote = res.data.filter(elem => elem.is_automatic == 0)
      dispatch(setNotifications(filterNote));
    } else {
      alert(res.errors[0])
    }
  } catch (error) {
    console.log("Get_STEP ERROR Thunk: " + JSON.stringify(error));
  }
}

export const setNextStepGroupThunk = (token, dataOrders) => async () => {
  try {
    const res = await DataService.setNextStepGroup(token, dataOrders)
    if (res.errors.length > 0) {
      alert(res.errors[0])
    } else {
      console.log('Успішно!', res.success)
    }
  } catch (error) {
    console.log("Get_STEP ERROR ThunkSet: " + JSON.stringify(error));
  }
}

export const setOrderLabels = (token, dataOrders) => async () => {
  try {
    const res = await DataService.getOrderLabels(token, dataOrders)
    console.log('thunkLLLL', res)
    const fileContent = res; 

    // Створюємо папку для зберігання файлу
    const folderUri = `${RNFS.DownloadDirectoryPath}/printPd`; // Папка для зберігання PDF
    await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });

    // Визначаємо ім'я файлу
    const fileName = 'example.pdf'; // Замініть це на бажане ім'я файлу
    const fileUri = `${folderUri}${fileName}.pdf`

    await RNFS.writeFile(fileUri, fileContent, 'base64')
    // Повний шлях до файлу
    //const fileUriToSave = `${folderUri}${fileName}`;

    // Зберігаємо вміст в файл
   /*  await FileSystem.writeAsStringAsync(fileUriToSave, fileContent, {
      encoding: FileSystem.EncodingType.Base64, // Якщо вміст відомий як base64, встановіть це значення
    }); */
    /* if (res.errors?.length > 0) {
      alert(res.errors[0])
    } else {
      console.log('Успішно!', res)
    } */
  } catch (error) {
    console.log("Get_STEP ERROR ThunkSet: " + JSON.stringify(error));
  }
}


export const updateNotifiThunk = (token, messageid, mstatus) => async () => {
  try {
    const res = await DataService.updateNotifi(token, messageid, mstatus)
    if (res.errors.length > 0) {
      alert(res.errors[0])
    } else {
      console.log('Something went wrong!', res.errors)
    }
  } catch (error) {
    console.log("Get_STEP ERROR ThunkSet: " + JSON.stringify(error));
  }
}

export const deleteNotifiThunk = (token, messageid) => async () => {
  try {
    const res = await DataService.deleteNotifi(token, messageid)
    if (res.errors.length > 0) {
      alert(res.errors[0])
    } else {
      console.log('Something went wrong!', res.errors)
    }
  } catch (error) {
    console.log("Get_STEP ERROR ThunkSet: " + JSON.stringify(error));
  }
}