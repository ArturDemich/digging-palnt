import { View, Text, StyleSheet, TouchableHighlight } from 'react-native'
import { connect, useDispatch } from 'react-redux'
import { clearDataChange, setCurrentColorStep, setCurrentStep } from '../state/dataSlice'
import { getGroupOrdersThunk, getOrdersStep } from '../state/dataThunk'


const styles = StyleSheet.create({
    statusBar: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonsBar: color => ({
        borderRadius: 3,
        backgroundColor: color,
        minWidth: "18%",
        height: 45,
        margin: 4,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: 'black',
        shadowOffset: { width: -1, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        flex: 3,
    }),
    selectedButtons: {
        borderColor: '#79c05c',
        borderWidth: 3,
        borderRadius: 15,
        elevation: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 0,
        shadowColor: '#009688',

    },
    textBtnBar: {
        color: 'white',
        fontSize: 12,
        fontWeight: 700,
        alignSelf: 'center',
    },
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

function ButtonsBar({route, steps, currentStep}) {
    const dispatch = useDispatch()

    const setDataState = async (newStep) => {
        console.log('ButtonsBar', route)
        await dispatch(clearDataChange())        
        await dispatch(setCurrentStep(newStep))
        await dispatch(setCurrentColorStep(newStep.theme))
        await dispatch(route.name === 'Замовлення' ?  getOrdersStep(newStep) : getGroupOrdersThunk())
    }

    const setColor = (val) => {
        switch (val) {
            case colorStepBtn.green.id:
                return colorStepBtn.green.color
                break;
            case colorStepBtn.yellow.id:
                return colorStepBtn.yellow.color
                break;
            case colorStepBtn.pink.id:
                return colorStepBtn.pink.color
                break;
            case colorStepBtn.red.id:
                return colorStepBtn.red.color
                break;
            case colorStepBtn.purple.id:
                return colorStepBtn.purple.color
                break;
            default:
                console.log('color not defined')
        }
    }

    const setStepName = (val) => {
        switch (val) {
            case colorStepBtn.green.id:
                return colorStepBtn.green.name
            case colorStepBtn.yellow.id:
                return colorStepBtn.yellow.name
            case colorStepBtn.pink.id:
                return colorStepBtn.pink.name
            case colorStepBtn.red.id:
                return colorStepBtn.red.name
            case colorStepBtn.purple.id:
                return colorStepBtn.purple.name
            default:
                alert('Step Name not defined')
        }
    }
    
    return (
        <View style={styles.statusBar}>
            {steps.map((step) => (
                <TouchableHighlight
                    key={step.id}
                    style={[styles.buttonsBar(setColor(step.id)), currentStep.id === step.id && styles.selectedButtons]}
                    onPress={() => setDataState(step)}
                >
                    <Text
                        style={[styles.textBtnBar]}
                        allowFontScaling={true}
                        maxFontSizeMultiplier={1}
                    > {setStepName(step.id)} </Text>
                </TouchableHighlight>
            ))}
        </View>
    )
}

const mapStateToProps = (state) => ({
    steps: state.steps,
    currentStep: state.currentStep
})

export default connect(mapStateToProps)(ButtonsBar)

