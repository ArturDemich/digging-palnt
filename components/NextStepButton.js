import { View, Text, StyleSheet, TouchableHighlight, ActivityIndicator } from 'react-native'
import { connect, useDispatch } from 'react-redux'
import { getGroupOrdersThunk, getOrdersStep, setNextStepGroupThunk } from '../state/dataThunk'
import { MaterialIcons } from '@expo/vector-icons'
import { clearDataChange } from '../state/dataSlice'
import { useState } from 'react'


const styles = StyleSheet.create({
    containerNBTN: {
        elevation: 5,
        //shadowColor: '#d70000',
        //shadowOffset: { width: 0, height: 0 },
       //shadowOpacity: 0.9,
       // shadowRadius: 25, 
        position: 'absolute', 
        right: 12, 
        bottom: 5
    },
    textBtn: {
        color: 'white',
        fontSize: 14,
        fontWeight: 900,
    },
    buttonStep: color => ({
        borderRadius: 3,
        backgroundColor: color,
        height: 40,
        padding: 5,               
        opacity: 0.95,
        elevation: 5,
        shadowColor: '#d70000',
        shadowOffset: { width: 0, height: 0 },        
        shadowOpacity: 0.9,
        shadowRadius: 3, 
    }),
    loding: {
        width: 70,
        alignContent: 'center',
    },
    none: {
        display: 'none'
    }
})

const colorStepBtn = {
    green: {
        id: 'b5ffdb30-cdb0-11ed-836c-00c12700489e',
        name: 'Нове',
        color: '#00721B'
    },
    yellow: {
        id: 'b5ffdb2c-cdb0-11ed-836c-00c12700489e',
        name: 'В роботі',
        color: '#1FBB43'
    },
    pink: {
        id: 'b5ffdb2e-cdb0-11ed-836c-00c12700489e',
        name: 'Викопано',
        color: '#83E499'
    },
    red: {
        id: 'b5ffdb2d-cdb0-11ed-836c-00c12700489e',
        name: 'В дорозі',
        color: '#C2DBC7'
    },
    purple: {
        id: 'b5ffdb2f-cdb0-11ed-836c-00c12700489e',
        name: 'На Базі',
        color: '#A8AFAA'
    }
}

function NextStepButton({ path, currentStorageId, token, currentStep, dataChange }) {
    const dispatch = useDispatch()
    const [loding, setLoding] = useState(false)

    const sendData = async (pathValue) => {
        setLoding(true)
        await dispatch(setNextStepGroupThunk(token[0].token, dataChange))
        await dispatch(clearDataChange())
        if (pathValue === "Замовлення") {
            await dispatch(getOrdersStep(currentStep, currentStorageId.id, token[0].token))
        } else if (pathValue === "Рослини Замовлення") {
            await dispatch(getGroupOrdersThunk(currentStep, currentStorageId.id, token[0].token))
        }
    }

    const setNextStepName = (val) => {
        switch (val) {
            case colorStepBtn.green.id:
                return name = colorStepBtn.yellow.name
            case colorStepBtn.yellow.id:
                return name = colorStepBtn.pink.name
            case colorStepBtn.pink.id:
                return name = colorStepBtn.red.name
            case colorStepBtn.red.id:
                return name = colorStepBtn.purple.name
            case colorStepBtn.purple.id:
                return null
            default:
                alert('Step Name not defined')
        }
    }

    const setNextStepColor = (val) => {
        switch (val) {
            case colorStepBtn.green.id:
                return colorStepBtn.yellow.color
            case colorStepBtn.yellow.id:
                return colorStepBtn.pink.color
            case colorStepBtn.pink.id:
                return colorStepBtn.red.color
            case colorStepBtn.red.id:
                return colorStepBtn.purple.color
            case colorStepBtn.purple.id:
                return 'gray'
            default:
                alert('Step Color not defined')
        }
    }
    
    return (
        <View>
            {dataChange.length > 0 ? 
                <View style={styles.containerNBTN} >
                    
                    <TouchableHighlight
                        style={[styles.buttonStep(setNextStepColor(currentStep.id)), dataChange.length === 0 && styles.none]}
                        onPress={() => sendData(path).then(() => setLoding(false))}
                    >
                        {loding ? 
                            <View style={styles.loding}>
                                <ActivityIndicator size="large" color="snow" />
                            </View> :
                            <MaterialIcons name="done-outline" size={20} color="snow" style={{ flex: 1 }} >
                                <Text
                                    style={styles.textBtn}
                                    allowFontScaling={true}
                                    maxFontSizeMultiplier={1}
                                > {setNextStepName(currentStep.id)} </Text>
                            </MaterialIcons>}
                    </TouchableHighlight>
                </View> : 
            null}
        </View>
    )
}

const mapStateToProps = (state) => ({
    currentStep: state.currentStep,
    dataChange: state.dataChange,
    token: state.token,
    currentStorageId: state.currentStorageId
})

export default connect(mapStateToProps)(NextStepButton)

