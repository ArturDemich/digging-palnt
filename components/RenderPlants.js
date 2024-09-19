import React, { memo } from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import { useDispatch, connect } from 'react-redux'
import { setSearchText } from '../state/dataSlice'
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons'
import CheckInputBox from './CheckInputBox'
import shortid from 'shortid'



const RenderPlants = memo(({ orderId, selectedAllOrder, prodactElem, currentStep, shipmentMethod, customerName, currentColor, scrollToTop}) => {
    const dispatch = useDispatch()
    const { characteristic, lastChange, product, qty, storage } = prodactElem    

    const searchPoint = async (value) => {
        await dispatch(setSearchText(value))
        await scrollToTop()
    }        
    
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
                    <CheckInputBox 
                        orderId={orderId} selectedAllOrder={selectedAllOrder} 
                        prodactElem={prodactElem} currentStep={currentStep} 
                        shipmentMethod={shipmentMethod} customerName={customerName} 
                         key={shortid.generate()} /> 
                        : null}
                </View>
            </View>
        </View>
    )
}, (prevProps, nextProps) => {
    return prevProps.currentStep != nextProps.currentStep 
})

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
        paddingLeft: 5,
        paddingRight: 5,
    },
    textStr: {
        fontWeight: 600,
    },
    costLineWrapper: {
        height: 'auto',
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        paddingLeft: 3,
        paddingRight: 3,
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
    location: {
        height: 'auto',
        textAlignVertical: 'center',
        lineHeight: 25,
        alignSelf: 'center',
        paddingBottom: 5,
        fontSize: 14,
        fontWeight: 500,        
    },    
    changeDate: {
        alignSelf: 'flex-end',
        fontSize: 11,
        fontWeight: 900,
        color: '#c5c5c5'
    },
    toucheble: color => ({
        elevation: 2,
        shadowColor: color,
        paddingTop: 6,
        paddingBottom: 5,
        paddingLeft: 7,
        paddingRight: 7,
        borderRadius: 3,        
    }),
})