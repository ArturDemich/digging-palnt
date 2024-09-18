import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useRef, useState } from 'react'
import { Text, StyleSheet, View, FlatList, ActivityIndicator, Platform, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, connect } from 'react-redux'
import ButtonsBar from '../components/ButtonsBar'
import NextStepButton from '../components/NextStepButton'
import RenderPlantsGroup from '../components/RenderPlantsGroup'
import { getGroupOrdersThunk } from '../state/dataThunk'
import { clearDataChange, clearGroupOrders } from '../state/dataSlice'
import QuantityOrders from '../components/QuantityOrders'
//import PrinterModal from '../components/printer/PrinterModal'




function AllPlantsScreen({ route, groupOrders, loading, filterPlants }) {   
    const [refresh, setRefresh] = useState(false)
    const dispatch = useDispatch()
    const flatListTopRef = useRef(null);

    const scrollToTop = () => {
        if (flatListTopRef.current) {
            flatListTopRef.current.scrollToOffset({offset: 0, animated: false})
        }
    }

    const renderItem = useCallback(({ item }) => {
        return <RenderPlantsGroup item={item} scrollToTop={scrollToTop} />
    }, [])
    const keyExtractor = useCallback((item, index) => (item.product.id.toString() + index), [])

    const getGroupOrders = async () => {
        await new Promise((resolve) => setTimeout(resolve, 300))
        await dispatch(getGroupOrdersThunk())
    }

    const onRefresh = async () => {
        setRefresh(true)
        await dispatch(getGroupOrdersThunk())
        setRefresh(false)
    }

    useFocusEffect(
        useCallback(() => {
            getGroupOrders()
            return () => {
                dispatch(clearDataChange())
                dispatch(clearGroupOrders())
            }
        }, [])

    )
    console.log('AllPlantsScreen loading', loading)
    return (
        <SafeAreaView style={styles.container}>
            <QuantityOrders route={route}/>
            {loading ?
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#45aa45" />
                </View> :
                groupOrders.length == 0 ?
                    <View style={styles.costLineWrapper}>
                        <Text
                            style={styles.noneData}
                            allowFontScaling={true}
                            maxFontSizeMultiplier={1}
                        >В цьому полі немає рослин з таким сатусом</Text>
                    </View> :
                    filterPlants === null ?
                        <View style={styles.costLineWrapper}>
                            <Text style={styles.noneData}>Не знайдено!</Text>
                        </View> :
                        <FlatList
                            ref={flatListTopRef}
                            data={filterPlants?.length > 0 ? filterPlants : groupOrders}
                            renderItem={renderItem}
                            keyExtractor={keyExtractor}
                            refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refresh} />}
                            refreshing={refresh}
                            initialNumToRender='7'
                            maxToRenderPerBatch='7'
                            windowSize={15}
                            ListFooterComponentStyle={{ marginBottom: 30 }}
                            ListFooterComponent={<View></View>}
                        />
            }
            <NextStepButton path={route.name} />
            {/* <PrinterModal /> */}
            <ButtonsBar route={route}/>
        </SafeAreaView>
    )
}

const mapStateToProps = state => {
    return {
        groupOrders: state.groupOrders,
        filterPlants: state.filterPlants,
        loading: state.lodingPlants
    }
}
export default connect(mapStateToProps)(AllPlantsScreen)




const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 3,
        marginTop: Platform.OS === 'ios' ? -45 : 0,
    },
    costLineWrapper: {
        height: 'auto',
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        paddingLeft: 5,
        paddingRight: 5
    },
    textinfo: {
        color: 'black',
        fontSize: 13,
        fontWeight: 700,
    },
    infoblock: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 7,
        marginTop: 7
    },
    loader: {
        height: 'auto',
        width: '100%',
        justifyContent: 'center',
        flex: 1
    },
    noneData: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 900,
        color: 'gray',
    },
})