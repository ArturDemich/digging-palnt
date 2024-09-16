import React, {useCallback, useRef, useState } from 'react'
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ButtonsBar from '../components/ButtonsBar'
import NextStepButton from '../components/NextStepButton'
import QuantityOrders from '../components/QuantityOrders'
import OrderFlatList from '../components/OrderFlatList'
import { useFocusEffect } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { clearStepOrders } from '../state/dataSlice'
//import PrinterModal from '../components/printer/PrinterModal'

function OrdersScreen({ route }) {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const isFirstRender = useRef(true);
    
    const setLoadingTrue = useCallback(() => setLoading(true), []);
    const setLoadingFalse = useCallback(() => setLoading(false), []);

    const setFirstRender = () => {
        isFirstRender.current = false;
    }
    
    useFocusEffect(
        useCallback(() => {
          // Цей код виконується, коли екран отримує фокус
          console.log('Screen is focused');
    
         // return () => dispatch(clearStepOrders()) 
        }, [])
      );
    console.log('Order', route)
    return (
        <SafeAreaView style={styles.container}>
            <QuantityOrders route={route} />
            {loading ?
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#45aa45" />
                </View> :
                <OrderFlatList setLoadingTrue={setLoadingTrue} setLoadingFalse={setLoadingFalse} isFirstRender={isFirstRender} setFirstRender={setFirstRender} route={route}/>
            }
            <NextStepButton path={route.name} />
            {/* <PrinterModal /> */}
            <ButtonsBar />
        </SafeAreaView>
    )
}

export default OrdersScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 3,
        marginTop: Platform.OS === 'ios' ? -45 : 0,
    },
    loader: {
        height: 'auto',
        width: '100%',
        justifyContent: 'center',
        flex: 1
    },
})