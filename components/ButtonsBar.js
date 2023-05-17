import { View, Text, StyleSheet, TouchableHighlight } from 'react-native'
import { connect, useDispatch } from 'react-redux'
import { clearDataChange, setCurrentColorStep, setCurrentStep } from '../state/dataSlice'


const styles = StyleSheet.create({
    statusBar: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonsBar: color => ({
        borderRadius: 3,
        backgroundColor: color,
        minWidth: "18%",
        height: 60,
        margin: 4,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        padding: 3,
        elevation: 5,
        shadowColor: '#52006A',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        flex: 3,
    }),
    selectedButtons: {
        // backgroundColor: 'snow', //#cacaca
        borderColor: '#f8f8f8',
        borderWidth: 1,
        elevation: 0,
        color: 'black',
        opacity: 10
    },
    textBtnBar: {
        color: 'white',
        fontSize: 13.5,
        fontWeight: 700,
    },
})

const colorStepBtn = {
    green: {
        name: 'green',
        color: '#E53935'
    },
    yellow: {
        name: 'yellow',
        color: '#FF8A70'
    },
    pink: {
        name: 'pink',
        color: '#E9DA7E'
    },
    red: {
        name: 'red',
        color: '#62D16E'
    },
    purple: {
        name: 'purple',
        color: 'grey'
    }
}

function ButtonsBar({ steps, currentStep }) {
    const dispatch = useDispatch()

    const setDataState = async (newStep) => {
        await dispatch(clearDataChange())
        await dispatch(setCurrentStep(newStep))
        await dispatch(setCurrentColorStep(newStep.theme))
    }

    const setColor = (val) => {
        switch (val) {
            case colorStepBtn.green.name:
                return colorStepBtn.green.color
                break;
            case colorStepBtn.yellow.name:
                return colorStepBtn.yellow.color
                break;
            case colorStepBtn.pink.name:
                return colorStepBtn.pink.color
                break;
            case colorStepBtn.red.name:
                return colorStepBtn.red.color
                break;
            case colorStepBtn.purple.name:
                return colorStepBtn.purple.color
                break;
            default:
                console.log('color not defined')
        }
    }
    console.log(steps)
    return (
        <View style={styles.statusBar}>
            {steps.map((step) => (
                <TouchableHighlight
                    key={step.id}
                    style={[styles.buttonsBar(setColor(step.theme)), currentStep.id === step.id && styles.selectedButtons]}
                    onPress={() => setDataState(step)}
                >
                    <Text
                        style={[styles.textBtnBar, currentStep.id === step.id && { color: 'black' }]}
                        allowFontScaling={true}
                        maxFontSizeMultiplier={1}
                    > {step.name} </Text>
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

