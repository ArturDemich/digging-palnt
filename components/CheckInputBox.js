import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch } from "react-redux";
import { clearDataChangeItem, setDataChange } from "../state/dataSlice";



const CheckInputBox = ({ orderId, selectedAllOrder, prodactElem, currentStep, shipmentMethod, customerName, orderNo}) => {
    const dispatch = useDispatch()

    const { characteristic, product, qty, unit, storage } = prodactElem
    const [plantCheckBox, setPlantCheckBox] = useState(selectedAllOrder)
    const [qtyState, setQty] = useState(qty)

    const checkInput = (value) => {
        if (Number(value) || value === '') {
            if (Number(value) > Number(qty)) {
                alert('Кількість рослин не може бути більша ніж в замовленні')
            } else {
                setQty(value)
            }
        } else {
            alert('Введіть кількіть викопаних рослин - цифрами')
        }
    }
    
    const setModalState = () => {
        const orders = {
            storageId: storage.id,
            currentstepId: currentStep.id,
            orderId: orderId,
            productid: product.id,
            characteristicid: characteristic.id,
            unitid: unit.id,
            actionqty: Number(qtyState),
            totalQty: Number(qty),
            productName: product.name,
            characteristicName: characteristic.name,
            shipmentMethod: shipmentMethod,
            customerName: customerName,
            orderNo: orderNo,
            currentStorage: storage.name
        }
        dispatch(setDataChange(orders))
    }

    const inputOnBlur = () => {
        if (qtyState === '') {
            setQty(qty)
        } else {
            setModalState()
            setPlantCheckBox(true)
        }
    }    

    const clearDataByCheckBox = () => {
        if (plantCheckBox === false ) {
            dispatch(clearDataChangeItem({
                orderId: orderId,
                productid: product.id,
                characteristicid: characteristic.id,
                storageId: storage.id,
            }))
        }
    }

    useEffect(() => {        
        if (selectedAllOrder === true && plantCheckBox === true) {
            setModalState()
        } else if (plantCheckBox === true) {
            setModalState()
        } else {
            clearDataByCheckBox()
        }
    }, [selectedAllOrder, plantCheckBox])
    
    
    return (
        <View style={styles.changeinfo}>
             <View style={styles.changeinfoblock}>
                 <Text
                     style={styles.quantity}
                     allowFontScaling={true}
                     maxFontSizeMultiplier={1}
                 >
                     Викопано:
                 </Text>
                 <TextInput
                     style={styles.input}
                     onChangeText={checkInput}
                     value={String(qtyState)}
                     inputMode='numeric'
                     keyboardType="numeric"
                     onBlur={(val) => inputOnBlur()}
                     autoFocus={false}
                     onFocus={() => setQty('')}
                     allowFontScaling={true}
                     maxFontSizeMultiplier={1}
                 />
             </View>
             <Checkbox
                 value={plantCheckBox}
                 color='#45aa45'
                 onValueChange={() => {
                     setPlantCheckBox(!plantCheckBox)
                 }}
                 style={styles.checkBox}
             />
        </View>
    )
}

export default CheckInputBox;


const styles = StyleSheet.create({
    changeinfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    changeinfoblock: {
        flexDirection: 'row'
    },
    input: {
        height: 28,
        width: 40,
        margin: 7,
        borderWidth: 1,
        borderColor: 'black',
        textAlign: 'center',
        alignSelf: 'flex-start',
    },
    checkBox: {
        alignSelf: 'center',
        height: 32,
        width: 32,
    },
    quantity: {
        height: 'auto',
        textAlignVertical: 'center',
        alignSelf: 'center',
        paddingBottom: 5,
        fontSize: 14,
        fontWeight: 600
    },
})