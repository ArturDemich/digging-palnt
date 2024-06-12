import { View, Text, StyleSheet, TouchableOpacity, FlatList, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { connect, useDispatch } from 'react-redux'
import { setStorageId } from '../state/dataSlice'
import CurrentVersion from '../components/CurrentVersion'


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flex: 1,
        marginTop: Platform.OS === 'ios' ? -45 : 0,
    },
    containerView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#d8fff2',
    },
    text: {
        color: 'black',
        fontSize: 20,
        marginBottom: 15,
        marginTop: 25
    },
    button: {
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: "#45aa45",
        minWidth: "63%",
        minHeight: 50,
        elevation: 3,
        shadowOffset: { width: -3, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        shadowColor: 'black',
        justifyContent: 'center',
    },
    textBtn: {
        color: 'white',
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 800,
    }
})


function MainScreen({ navigation, digStorages }) {
    const dispatch = useDispatch()
    function renderFildsButton({ item }) {
        return (
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    dispatch(setStorageId(item))
                    navigation.navigate('Поле', { title: item.name })
                }}
            >
                <Text
                    key={item.id}
                    style={styles.textBtn}
                    allowFontScaling={true}
                    maxFontSizeMultiplier={1}
                > {item.name} </Text>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerView}>
                <Text
                    style={styles.text}
                    allowFontScaling={true}
                    maxFontSizeMultiplier={1}
                > Виберіть поле </Text>
                <FlatList
                    data={digStorages}
                    renderItem={renderFildsButton}
                    keyExtractor={item => item.id.toString()}
                    style={{ padding: 10 }}
                />
            </View>
            <CurrentVersion />
        </SafeAreaView>
    )
}

const mapStateToProps = (state) => ({
    digStorages: state.digStorages
})

export default connect(mapStateToProps)(MainScreen)

