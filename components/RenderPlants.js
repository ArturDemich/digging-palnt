import Checkbox from 'expo-checkbox'
import React, { useEffect, useState } from 'react'
import { Text, TextInput, StyleSheet, View } from 'react-native'
import { useDispatch, connect } from 'react-redux'
import { clearDataChangeItem, setDataChange, setSearchText } from '../state/dataSlice'
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'



function RenderPlants({ orderId, selectedAllOrder, prodactElem, currentStep, orders, currentColor, scrollToTop }) {
    const dispatch = useDispatch()
    const { characteristic, lastChange, product, qty, unit, storage } = prodactElem
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
            actionqty: Number(qtyState)
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

    const searchPoint = async (value) => {
        await dispatch(setSearchText(value))
        scrollToTop()
    } 

    useEffect(() => {
        if (selectedAllOrder === true && plantCheckBox === true) {
            setModalState()
        } else if (plantCheckBox === false) {
            dispatch(clearDataChangeItem({
                orderId: orderId,
                productid: product.id,
                characteristicid: characteristic.id,
                storageId: storage.id,
            }))
        } else if (plantCheckBox === true) {
            setModalState()
        }
    }, [selectedAllOrder, plantCheckBox, orders])

    return (
        <View style={styles.infoBlock}>
            <View style={styles.costLineWrapper}>
                <Text style={styles.plantName}
                    allowFontScaling={true}
                    maxFontSizeMultiplier={1}
                >{product.name}</Text>
                <View style={styles.info}>
                    <Text
                        style={styles.characteristics}
                        allowFontScaling={true}
                        maxFontSizeMultiplier={1}
                    >{characteristic.name}</Text>
                    <Text
                        style={styles.changeDate}
                        allowFontScaling={true}
                        maxFontSizeMultiplier={1}
                    >змінено: {lastChange}</Text>
                </View>
                <View style={styles.info}>
                    <View>
                        <MaterialCommunityIcons name="pine-tree" size={20} color="black">
                            <MaterialCommunityIcons name="shovel" size={15} color="black" />
                            <Text
                                style={styles.quantity}
                                allowFontScaling={true}
                                maxFontSizeMultiplier={1}
                            > {qty} шт</Text>
                        </MaterialCommunityIcons>
                        <TouchableOpacity style={styles.toucheble(currentColor)} onPress={() => searchPoint(storage?.id)}>
                            <Entypo name="location" size={20} color="black">
                                <Text 
                                    style={styles.location}
                                    allowFontScaling={true}
                                    maxFontSizeMultiplier={1}
                                    > {storage?.name}</Text>
                            </Entypo>
                        </TouchableOpacity>
                    </View>
                    {currentStep.rightToChange ?
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
                        </View> : null}
                </View>
            </View>
        </View>
    )
}

const mapStateToProps = state => ({
    currentStep: state.currentStep,
    orders: state.stepOrders,
    currentColor: state.currentColorStep,
})
export default connect(mapStateToProps)(RenderPlants)


const styles = StyleSheet.create({
    infoBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        borderTopWidth: 2,
        borderTopColor: '#b0acb0',
    },
    textStr: {
        fontWeight: 600,
    },
    costLineWrapper: {
        height: 'auto',
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        paddingLeft: 5,
        paddingRight: 5,
    },
    plantName: {
        height: 'auto',
        width: 'auto',
        fontSize: 15,
        fontWeight: '500',
        paddingTop: 5,
        textShadowRadius: 2
    },
    characteristics: {
        height: 'auto',
        fontSize: 13,
        textAlignVertical: 'center',
        paddingLeft: 10,
        flex: 1
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    quantity: {
        height: 'auto',
        textAlignVertical: 'center',
        alignSelf: 'center',
        paddingBottom: 5,
        fontSize: 14,
        fontWeight: 600
    },
    changeinfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'flex-end',
    },
    changeinfoblock: {
        flexDirection: 'row',
        alignSelf: 'center'
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
        height: 28,
        width: 28,
    },
    changeDate: {
        alignSelf: 'flex-end',
        fontSize: 11,
        fontWeight: 900,
        color: '#c5c5c5'
    },
    location: {
        height: 'auto',
        textAlignVertical: 'center',
        lineHeight: 25,
        alignSelf: 'center',
        paddingBottom: 5,
        fontSize: 14,
        fontWeight: 500,        
    },  
    toucheble: color => ({
        elevation: 2,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 5,    
        shadowColor: color,
        paddingTop: 6,
        paddingBottom: 5,
        paddingLeft: 7,
        paddingRight: 7,
        borderRadius: 3,        
    }),
})