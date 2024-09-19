import { DataService } from "./dataService"
import * as SecureStore from 'expo-secure-store'
import {
  setDigStorages, setStepOrders,
  setSteps, setToken, setCurrentStep,
  setGroupOrders,
  setNotifications,
  setTotalQty,
  setCurrentColorStep,
  setBTPermission,
  setNewVersion,
  setLodingOrders,
  setLodingPlants
} from "./dataSlice"
import { Platform } from "react-native"
import { useBluetoothPermissions } from "../hooks/useBTPermission"


export const getOrdersStep = () => async (dispatch, getState) => {
  try {
    dispatch(setLodingOrders(true))
    const state = getState();
    const stepId = state.currentStep; 
    const storageId = state.currentStorageId; 
    const token = state.token[0]?.token;
    
    const res = await DataService.getStepOrders(stepId.id, storageId.id, token)
    if (res.success) {
      dispatch(setStepOrders(res))

      let productQty = 0
      res.data.forEach(elem => elem.products.forEach(el => productQty += el.qty))
      const total = {
        orders: res.data.length,
        plants: productQty
      }
      dispatch(setTotalQty(total))
      dispatch(setLodingOrders(false))
    } else {
      console.log('Something went wrong!', res.errors)
    }
  } catch (error) {
    console.log("GetStep_ORDERS ERROR Thunk: " + JSON.stringify(error));
  }
}

export const getGroupOrdersThunk = () => async (dispatch, getState) => {
  try {
    dispatch(setLodingPlants(true))
    const state = getState();
    const stepId = state.currentStep; 
    const storageId = state.currentStorageId; 
    const token = state.token[0]?.token;
    
    const res = await DataService.getGroupOrders(stepId.id, storageId.id, token)
    if (res.success) {
      dispatch(setGroupOrders(res))

      let productQty = 0
      res.data.forEach(elem => elem.orders.forEach(el => productQty += el.qty))
      const total = {
        orders: 0,
        plants: productQty
      }
      dispatch(setTotalQty(total))
      dispatch(setLodingPlants(false))
    } else {
      console.log('Something went wrong!', res.errors)
    }
  } catch (error) {
    console.log("GetStep_GroupORDERS ERROR Thunk: " + JSON.stringify(error));
  }
}

export const getDigStorages = (token) => async (dispatch) => {
  const permission = await useBluetoothPermissions()
  dispatch(setBTPermission(permission))
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
    await SecureStore.setItemAsync('getStepOrders', res.api.getStepOrders)
    await SecureStore.setItemAsync('getSteps', res.api.getSteps)
    await SecureStore.setItemAsync('getStorages', res.api.getStorages)
    await SecureStore.setItemAsync('getToken', res.api.getToken)
    await SecureStore.setItemAsync('setNextOrderStep', res.api.setNextOrderStep)
    await dispatch(setNewVersion(res.version))
    return await res
  } catch (error) {
    console.log("Get_VERSION ERROR Thunk: " + JSON.stringify(error));
  }
}

export const getTokenThunk = (log, pass) => async (dispatch) => {
  try {
    const res = await DataService.getToken(log, pass)

    if (res.success) {
      dispatch(setToken(res.data))
      if (Platform.OS === 'web') {
        await localStorage.setItem('token', JSON.stringify(res.data))
      } else {
        await SecureStore.setItemAsync('token', JSON.stringify(res.data))
      }
    } else {
      alert(res.errors[0])
    }
  } catch (error) {
    console.log("Get_TOKEN ERROR Thunk: " + JSON.stringify(error));
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
    console.log("Get_Notifi ERROR Thunk: " + JSON.stringify(error));
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
    console.log("Get_NextStep ERROR ThunkSet: " + JSON.stringify(error));
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
    console.log("updateNotifi ERROR ThunkSet: " + JSON.stringify(error));
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
    console.log("deleteNotifi ERROR ThunkSet: " + JSON.stringify(error));
  }
}

