import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useRef, useState } from 'react'
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Platform, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, connect } from 'react-redux'
import ButtonsBar from '../components/ButtonsBar'
import NextStepButton from '../components/NextStepButton'
import RenderOrders from '../components/RenderOrders'
import { getOrdersStep } from '../state/dataThunk'
import { clearDataChange, clearStepOrders } from '../state/dataSlice'
import QuantityOrders from '../components/QuantityOrders'
//import PrinterModal from '../components/printer/PrinterModal'

const OrdersScreen = ({ orders, route, loading, filterOrders }) => {
    const dispatch = useDispatch()
    const flatListTopRef = useRef(null);
    const [refresh, setRefresh] = useState(false)

    const scrollToTop = () => {
        if (flatListTopRef.current) {
            flatListTopRef.current.scrollToOffset({offset: 0, animated: false})
        }
    }

    const keyExtractor = useCallback((item, index) => (item.orderId.toString() + index), [])
    const renderItem = useCallback(({ item }) => {
        return <RenderOrders order={item} scrollToTop={scrollToTop}/>
    }, [])

    const getOrders = async () => {        
        await new Promise((resolve) => setTimeout(resolve, 300))
        await dispatch(getOrdersStep())
    }

    const onRefresh = async () => {
        setRefresh(true)
        await dispatch(clearDataChange())
        await dispatch(getOrdersStep())
        setRefresh(false)
    }

    useFocusEffect(
        useCallback(() => {
            getOrders() 
            return () => {
                dispatch(clearDataChange())
                dispatch(clearStepOrders())
            }
        }, [])
    )
    console.log('Order loading', loading)
    return (
        <SafeAreaView style={styles.container}>
            <QuantityOrders route={route}/>
            {loading ?
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#45aa45" />
                </View> :
                orders.length === 0 ?
                    <View style={styles.costLineWrapper}>
                        <Text style={styles.noneData}>Немає замовлень з таким сатусом</Text>
                    </View> :
                    filterOrders === null ?
                        <View style={styles.costLineWrapper}>
                            <Text style={styles.noneData}>Не знайдено!</Text>
                        </View> :
                        <FlatList
                            ref={flatListTopRef}
                            data={filterOrders?.length > 0 ? filterOrders : orders}
                            renderItem={renderItem}
                            keyExtractor={keyExtractor}
                            refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refresh} />}
                            initialNumToRender='7'
                            maxToRenderPerBatch='7'
                            windowSize={15}
                            ListFooterComponentStyle={{ marginBottom: 30 }}
                            ListFooterComponent={<View></View>}
                        />
            }
            <NextStepButton path={route.name} />
            {/* <PrinterModal /> */}
            <ButtonsBar route={route} />

        </SafeAreaView>
    )
}

const mapStateToProps = state => {
    return {
        orders: state.stepOrders,
        filterOrders: state.filterOrders,
        loading: state.lodingOrders
    }
}
export default connect(mapStateToProps)(OrdersScreen)



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
    costLineWrapper: {
        height: 'auto',
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        paddingLeft: 5,
        paddingRight: 5
    },
    noneData: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 900,
        color: 'gray',
    },
})