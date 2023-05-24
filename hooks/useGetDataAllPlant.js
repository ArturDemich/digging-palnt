import { useFocusEffect } from "@react-navigation/native"
import { useCallback, useEffect, useState } from "react"
import { connect, useDispatch, useSelector } from "react-redux"
import { getGroupOrdersThunk } from "../state/dataThunk"



export function useGetDataAllPlant() {
    const [loading, setLoading] = useState(true)
    const storageId = useSelector(state => state.currentStorageId)
    const currentStep = useSelector(state => state.currentStep)
   // const groupOrders = useSelector(state => state.groupOrders)
    const totalPlantQty = useSelector(state => state.totalPlantQty)
    const token = useSelector(state => state.token)
    const dispatch = useDispatch()

    const getGroupOrders = async () => {
        setLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 200))
        await dispatch(getGroupOrdersThunk(currentStep, storageId, token[0].token))
    }

    console.log('hook', storageId)

    useEffect(() => {
        getGroupOrders().then(() => setLoading(false))
    }, [currentStep])

    return { loading, storageId, token, currentStep, totalPlantQty, getGroupOrders }
}


