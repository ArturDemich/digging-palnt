import { useEffect, useState, forwardRef, useImperativeHandle, useRef, useCallback } from "react"
import { StyleSheet, Text, TextInput, View } from "react-native"
import { connect, useDispatch } from "react-redux"
import { setModalAllPlants, setModalInput } from "../../state/dataSlice"
import { setNextStepThunk } from "../../state/dataThunk"


const styles = StyleSheet.create({
    input: {
        height: 30,
        width: 40,
        margin: 12,
        borderWidth: 1,
        borderColor: 'black',
        textAlign: 'center',
        alignSelf: 'flex-start',
    },
    infoBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: '#b0acb0',
    },
    orderInfoBlock: {
        flexDirection: 'row'
    },
    orderNames: {
        alignSelf: 'center',
        width: 200,
        padding: 3,

    },
    qtyInfo: {
        alignSelf: 'center',
        marginLeft: 5,
        fontSize: 14,
        fontWeight: 700,
    },
    textClient: {
        fontSize: 11,
        fontWeight: 500,
    },
    textNumOrder: {
        fontSize: 12,
        fontWeight: 700,
    },
})

function RenderModalOrders({ orders, plant, modalInput, cancelTrigger, trigger, currentStep, token, currentStorageId }) {
    const { product, characteristic, unit } = plant
    const item = orders.item
    const qtyInfo = item.qty
    const dispatch = useDispatch()
    const [qtyInput, setQtyInput] = useState(item.qty)
    const [modalQty, setModalQty] = useState()
    const [modalOrderId, setModalOrderId] = useState()

    const setModalState = () => {
        const orders = {
            orderId: item.orderId,
            qty: Number(qtyInput)
        }
        dispatch(setModalInput(orders))
    }



    const checkInput = (value) => {
        if (Number(value) || value === '') {
            if (Number(value) > Number(qtyInfo)) {
                alert('Кількість рослин не може бути більша ніж в замовленні')
            } else {
                setQtyInput(value)
            }
        } else {
            alert('Введіть кількіть викопаних рослин - цифрами')
        }
    }

    const seachModalData = useCallback((order) => {
        order.forEach((elem) => {
            if (elem.orderId === item.orderId) {
                setModalQty(elem.qty)
                setModalOrderId(elem.orderId)
            }
        })
    }, [modalInput])

    useEffect(() => {
        if (modalInput.length) {
            seachModalData(modalInput)
        }
        return () => cancelTrigger()
    }, [modalInput])


    if (trigger) {
        dispatch(setNextStepThunk(
            token[0].token,
            currentStorageId,
            currentStep.id,

            modalInput.orderId,

            product.id,
            characteristic.id,
            unit.id,
            modalInput.qty
        ))
    }
    console.log('2', modalQty, modalInput.length)

    return (
        <View style={styles.infoBlock}>
            <View style={styles.orderInfoBlock}>
                <View style={styles.orderNames}>
                    <Text style={styles.textNumOrder}>{item.orderNo}</Text>
                    <Text style={styles.textClient}>{item.customerName}</Text>
                </View>
                <Text style={styles.qtyInfo}>- {qtyInfo} шт</Text>
            </View>
            <View>
                <TextInput
                    style={styles.input}
                    onChangeText={checkInput}
                    value={String(qtyInput)}
                    inputMode='numeric'
                    keyboardType="numeric"
                    selection={{ start: 9, end: 9 }}
                    onBlur={() => setModalState()}
                    autoFocus={false}
                />
            </View>
        </View>
    )
}

const mapStateToProps = state => ({
    token: state.token,
    currentStep: state.currentStep,
    currentStorageId: state.currentStorageId,
    modalInput: state.modalInput

})

export default connect(mapStateToProps)(RenderModalOrders)