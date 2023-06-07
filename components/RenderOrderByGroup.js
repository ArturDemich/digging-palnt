import Checkbox from "expo-checkbox"
import { memo, useEffect, useState } from "react"
import { SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native"
import { connect, useDispatch } from "react-redux"
import { DataService } from "../state/dataService"
import { clearDataChangeItem, setDataChange } from "../state/dataSlice"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons'


const styles = StyleSheet.create({
    viewContainer: {
        marginBottom: 5,
        paddingTop: 10,
        flex: 1,
        flexDirection: 'column',
        borderTopWidth: 2,
        borderTopColor: '#b0acb0',
    },
    infoBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        
    },
    input: {
        height: 30,
        width: 40,
        borderWidth: 1,
        borderColor: 'black',
        textAlign: 'center',
        alignSelf: 'center',
        marginRight: 12,
    },
    orderInfoBlock: {
        flexDirection: 'row',
        paddingBottom: 2,
        paddingTop: 2,
        paddingRight: 2,
        flex: 1
    },
    orderInfoChange: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    orderNames: {
        alignSelf: 'center',
        width: 200,
        padding: 3,
    },
    qtyInfo: {
        alignSelf: 'center',
        marginLeft: 0,
        fontSize: 14,
        fontWeight: 700,
    },
    infoComent: {
        flexDirection: 'row',
        width: '100%'
    },
    textClient: {
        fontSize: 11,
        fontWeight: 500,
    },
    nameClient: {
        fontSize: 13,
        fontWeight: 900,
        color: '#30302f'
    },
    textDataChange: {
        fontSize: 10,
        fontWeight: 900,
        color: '#c5c5c5',
        alignSelf: 'flex-end',
    },
    textStrong: {
        fontSize: 13,
        fontWeight: 700,
    },
    checkBox: {
        alignSelf: 'center',
        height: 28,
        width: 28,
    },
})

function RenderOrderByGroup({ order, selectedAll, plant, currentStep, currentStorageId, token }) {
    const dispatch = useDispatch()
    const { orderId, orderNo, customerName, qty, shipmentDate, shipmentMethod, lastChange } = order
    const { characteristic, product, unit } = plant
    const [orderCheckBox, setOrderCheckBox] = useState(selectedAll)
    const [qtyInput, setQtyInput] = useState(qty)
    const [comentInfo, setComentInfo] = useState('0') 

    const getInfo = async () => {
        const res = await DataService.getOrderInfo(token, orderId)
        setComentInfo(res.data[0].comment)
    }

    const setModalState = () => {
        const orders = {
            storageId: currentStorageId,
            currentstepId: currentStep.id,
            orderId: orderId,
            productid: product.id,
            characteristicid: characteristic.id,
            unitid: unit.id,
            actionqty: Number(qtyInput)
        }
        dispatch(setDataChange(orders))
    }

    const checkInput = (value) => {
        if (Number(value) || value === '') {
            if (Number(value) > Number(qty)) {
                alert('Кількість рослин не може бути більша ніж в замовленні')
            } else {
                setQtyInput(value)
            }
        } else {
            alert('Введіть кількіть викопаних рослин - цифрами')
        }
    }

    const inputOnBlur = () => {
        if (qtyInput === '') {
            setQtyInput(qty)
        } else {
            setModalState()
            setOrderCheckBox(true)
        }
    }

    useEffect(() => {
        getInfo()
        if (selectedAll === true && orderCheckBox === true) {
            setModalState()
        } else if (orderCheckBox === false) {
            dispatch(clearDataChangeItem({
                orderId: orderId,
                productid: product.id,
                characteristicid: characteristic.id,
            }))
        } else if (orderCheckBox === true) {
            setModalState()
        }
    }, [selectedAll, orderCheckBox])
   
    return (
        <SafeAreaView style={styles.viewContainer}>
            <Text
                style={styles.nameClient}
                allowFontScaling={true}
                maxFontSizeMultiplier={1}
                >{customerName}</Text>
            <View style={styles.infoBlock}>
                <View style={styles.orderInfoBlock}>
                    <View style={styles.orderNames}>
                        <FontAwesome5 name="truck-loading" size={13} color="black" >
                            <Text
                                style={styles.textStrong}
                                allowFontScaling={true}
                                maxFontSizeMultiplier={1}
                            > {shipmentMethod}</Text>
                        </FontAwesome5>                        
                        
                        <MaterialCommunityIcons name="truck-delivery-outline" size={18} color="black" >
                        <Text
                            style={styles.textClient}
                            allowFontScaling={true}
                            maxFontSizeMultiplier={1}
                        > {shipmentDate}</Text>
                        </MaterialCommunityIcons>
                        <MaterialCommunityIcons name="clipboard-list-outline" size={15} color="black">
                        <Text
                            style={styles.textClient}
                            allowFontScaling={true}
                            maxFontSizeMultiplier={1}
                        > {orderNo}</Text>
                        </MaterialCommunityIcons>
                    </View>
                    <Text
                        style={styles.qtyInfo}
                        allowFontScaling={true}
                        maxFontSizeMultiplier={1}
                    > {qty} шт</Text>
                </View>
                <View style={{ alignSelf: 'center', flex: 1, flexDirection: 'column' }} >
                    {currentStep.rightToChange ?
                        <View style={styles.orderInfoChange}>
                            <TextInput
                                style={styles.input}
                                onChangeText={checkInput}
                                value={String(qtyInput)}
                                inputMode='numeric'
                                keyboardType="numeric"
                                onBlur={(val) => inputOnBlur()}
                                autoFocus={false}
                                onFocus={() => setQtyInput('')}
                                allowFontScaling={true}
                                maxFontSizeMultiplier={1}
                            />
                            <Checkbox
                                value={orderCheckBox}
                                color='#45aa45'
                                onValueChange={() => {
                                    setOrderCheckBox(!orderCheckBox)
                                }}
                                style={styles.checkBox}
                            />
                        </View> : null}
                    <Text style={styles.textDataChange}
                        allowFontScaling={true}
                        maxFontSizeMultiplier={1}
                    >змінено: {lastChange} </Text>
                </View>
            </View>
            <View style={styles.infoComent}>  
                <MaterialCommunityIcons name="comment-text-outline" size={16} color="black" >           
                    <Text
                        style={styles.textClient}
                        allowFontScaling={true}
                        maxFontSizeMultiplier={1}
                    ><Text style={{ fontWeight: 800 }}> - {comentInfo} </Text></Text> 
                </MaterialCommunityIcons>   
            </View>
        </SafeAreaView>
    )
}

const mapStateToProps = state => ({
    currentStep: state.currentStep,
    currentStorageId: state.currentStorageId,
    token: state.token,
    groupOrders: state.groupOrders
})

export default connect(mapStateToProps)(memo(RenderOrderByGroup))