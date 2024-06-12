import { useEffect, useState } from "react";
import { Linking, Modal, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import Constants from 'expo-constants';
import { StyleSheet } from "react-native";




function NewVersion({ }) {
    const [show, setShow] = useState(false)
    const version = useSelector((state) => state.newVersion)
    const ver = Constants.manifest.version

    const refreshApp = () => {
        Linking.openURL(version?.url)
        setShow(!show)
    }

    const get = async () => {
        if (String(ver) < String(version)) {
            setShow(true)
        }
    }

    useEffect(() => {
        get()
    }, [version])

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={show}
                onRequestClose={() => setShow(!show)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text
                            style={styles.textStr}
                            allowFontScaling={true}
                            maxFontSizeMultiplier={1}
                        >Все файно! </Text>
                        <Text style={{ fontSize: 17 }}>Є нова версія додатка!!</Text>
                        <Text style={styles.textStyle}>Оновити зараз?</Text>
                        <View style={styles.btnBlock}>
                            <TouchableOpacity
                                onPress={() => setShow(!show)}
                                style={styles.buttonClose}
                            >
                                <Text
                                    style={styles.modalText}
                                    allowFontScaling={true}
                                    maxFontSizeMultiplier={1}
                                >Пізніше</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => refreshApp()}
                                style={styles.buttonModal}
                            >
                                <Text
                                    style={styles.modalText}
                                    allowFontScaling={true}
                                    maxFontSizeMultiplier={1}
                                >Оновити</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default NewVersion


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: '#00002329',
    },
    modalView: {
        width: 300,
        flexDirection: 'column',
        margin: 1,
        backgroundColor: "white",
        borderRadius: 10,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 5,
        paddingTop: 5,
        alignItems: "center",
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        minHeight: '15%',
        maxHeight: '70%',
    },

    btnBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        width: "100%"
    },

    buttonModal: {
        borderRadius: 3,
        textAlign: "center",
        backgroundColor: "#45aa45",
        width: 110,
        alignSelf: 'flex-end',
        height: 35,
        elevation: 3,
        justifyContent: 'center',
    },

    buttonClose: {
        borderRadius: 3,
        height: 35,
        elevation: 3,
        width: 110,
        alignSelf: 'flex-end',
        backgroundColor: "#999999e6",
        justifyContent: 'center',
    },
    textStyle: {
        fontWeight: 500,
        fontSize: 18,
        color: '#555555',
        marginBottom: 40,
        paddingLeft: 5,
        paddingRight: 5,
    },
    textStr: {
        fontWeight: 600,
        fontSize: 21,
    },
    modalText: {
        textAlign: "center",
        alignSelf: 'center',
        color: 'snow',
        fontSize: 15,
        fontWeight: 700
    },

})