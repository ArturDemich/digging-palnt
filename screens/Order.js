import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Platform, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, connect } from 'react-redux'
import ButtonsBar from '../components/ButtonsBar'
import NextStepButton from '../components/NextStepButton'
import RenderOrders from '../components/RenderOrders'
import { getOrdersStep } from '../state/dataThunk'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { clearDataChange } from '../state/dataSlice'
//import PrinterModal from '../components/printer/PrinterModal'

function OrdersScreen({ orders, route, currentStep, totalPlantQty, totalOrderQty, storageId, filterOrders, filterPlantQty, filterOrderQty }) {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)
    const { token } = route.params

    const keyExtractor = useCallback((item, index) => (item.orderId.toString() + index), [])
    const renderItem = useCallback(({ item }) => {
        return <RenderOrders orders={item} rightToChange={currentStep.rightToChange} />
    }, [currentStep])

    const getOrders = async () => {
        setLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 200))
        await dispatch(getOrdersStep(currentStep, storageId.id, token[0].token))
    }

    const onRefresh = async () => {
        setRefresh(true)
        await dispatch(getOrdersStep(currentStep, storageId.id, token[0].token))
        setRefresh(false)
    }

    useFocusEffect(
        useCallback(() => {
            getOrders().then(() => setLoading(false))
            return () => dispatch(clearDataChange())
        }, [currentStep])
    )

    return (
        <SafeAreaView style={styles.container} >
            <View style={styles.infoblock}>
                <MaterialCommunityIcons name="pine-tree" size={24} color="black">
                    <MaterialCommunityIcons name="pine-tree" size={18} color="black" />
                    <Text style={styles.textinfo}> всіх рослин: {filterPlantQty !== null ? filterPlantQty : totalPlantQty} </Text>
                </MaterialCommunityIcons>
                <MaterialCommunityIcons name="clipboard-list-outline" size={24} color="black">
                    <Text style={styles.textinfo}> замовлень: {filterOrderQty !== null ? filterOrderQty : totalOrderQty} </Text>
                </MaterialCommunityIcons>
            </View>
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
                            data={filterOrders?.length > 0 ? filterOrders : orders}
                            renderItem={renderItem}
                            keyExtractor={keyExtractor}
                            refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refresh} />}
                            initialNumToRender='4'
                            maxToRenderPerBatch='4'
                            ListFooterComponentStyle={{ marginBottom: 30 }}
                            ListFooterComponent={<View></View>}
                        />
            }
            <NextStepButton path={route.name} />
            {/*  <PrinterModal /> */}
            <ButtonsBar />

        </SafeAreaView>
    )
}

const mapStateToProps = state => {
    return {
        orders: state.stepOrders,
        filterOrders: state.filterOrders,
        currentStep: state.currentStep,
        totalPlantQty: state.totalPlantQty,
        totalOrderQty: state.totalOrderQty,
        filterPlantQty: state.filterPlantQty,
        filterOrderQty: state.filterOrderQty,
        storageId: state.currentStorageId
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
    textinfo: {
        color: 'black',
        fontSize: 13,
        fontWeight: 700,
        textAlign: 'center',
    },
    infoblock: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 7,
        marginTop: 7
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