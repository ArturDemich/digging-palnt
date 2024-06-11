import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableHighlight, SafeAreaView, TextInput, ActivityIndicator, Image, Platform } from 'react-native'
import { connect, useDispatch } from 'react-redux'
import { getNewVersion, getTokenThunk } from '../state/dataThunk'
import * as SecureStore from 'expo-secure-store'
import logoIcon from '../assets/logoIcon.png'
import CurrentVersion from '../components/CurrentVersion'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#d8fff2',
        gap: 70
    },
    text: {
        fontSize: 20,
        textAlign: "center",
        color: 'white',
        fontWeight: "500",
    },
    button: {
        marginTop: 3,
        borderRadius: 5,
        backgroundColor: "#45aa45",
        width: 140,
        minHeight: 45,
        elevation: 5,
        shadowColor: '#52006A',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        display: "flex",
        justifyContent: "center",
    },
    input: {
        height: 40,
        width: 210,
        margin: 12,
        padding: 10,
        backgroundColor: "white",
        elevation: 1,
        shadowColor: '#52006A',
        shadowOffset: { width: -2, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        borderRadius: 3,
    },
    containerView: {
        alignItems: "center",
        backgroundColor: "#dbdcdd",
        borderRadius: 7,
        padding: 15,
        elevation: 10,
        shadowColor: '#52006A',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    logo: {
        height: 65,
        width: 250,
        marginTop: 50
    },
})

function LoginScreen() {
    const dispatch = useDispatch()

    const [login, onChangeLogin] = useState('')
    const [password, onChangePass] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getValueAuth()
        console.log('loginTest')
        dispatch(getNewVersion())
    }, [])

    const getToken = async () => {
        setLoading(true)
        await saveAuth(password, login)
        await dispatch(getTokenThunk(login, password))
        setLoading(false)
    }

    const saveAuth = async (pass, login) => {
        if (Platform.OS === 'web') {
            await localStorage.setItem('pass', pass)
            await localStorage.setItem('login', login)
        } else {
            await SecureStore.setItemAsync('pass', pass)
            await SecureStore.setItemAsync('login', login)
        }
    }

    const getValueAuth = async () => {
        let pass
        let login
        if (Platform.OS === 'web') {
            pass = await localStorage.getItem('pass')
            login = await localStorage.getItem('login')
        } else {
            pass = await SecureStore.getItemAsync('pass')
            login = await SecureStore.getItemAsync('login')
        }
        if (pass && login) {
            onChangeLogin(login)
            onChangePass(pass)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image source={logoIcon} style={styles.logo} />
            {loading ?
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#45aa45" />
                </View> :
                <View style={styles.containerView}>
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeLogin}
                        value={login}
                        placeholder="Введіть користувача"
                        placeholderTextColor={'gray'}
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangePass}
                        value={password}
                        placeholder="Введіть пароль"
                        secureTextEntry={true}
                        placeholderTextColor={'gray'}
                    />
                    <TouchableHighlight
                        style={styles.button}
                        onPress={() => getToken()}
                    >
                        <Text
                            style={styles.text}
                            allowFontScaling={true}
                            maxFontSizeMultiplier={1}
                        > Увійти </Text>
                    </TouchableHighlight>
                </View>}
            <CurrentVersion />
        </SafeAreaView>
    );
};

const mapStateToProps = (state) => ({
    digStorages: state.digStorages,
    token: state.token
})

export default connect(mapStateToProps)(LoginScreen)

