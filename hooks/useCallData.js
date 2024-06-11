import { useDispatch } from "react-redux"
import { getDigStorages, getStep } from "../state/dataThunk"
import useDeviceToken from "./useDeviceToken"


const useCallData = () => {
    const dispatch = useDispatch()
    const { registerDeviceToken } = useDeviceToken()

    const callData = async (token) => {
        console.log('callDataHook')
        await dispatch(getDigStorages(token))
        await dispatch(getStep(token))
        await registerDeviceToken(token, true)
    }

    return { callData }
}

export default useCallData