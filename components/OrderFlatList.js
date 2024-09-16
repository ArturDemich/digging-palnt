import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, RefreshControl, Text, View, StyleSheet } from "react-native";
import { connect, useDispatch } from "react-redux";
import RenderOrders from "./RenderOrders";
import { clearDataChange, clearStepOrders } from "../state/dataSlice";
import { getGroupOrdersThunk, getOrdersStep } from "../state/dataThunk";
import RenderPlantsGroup from "./RenderPlantsGroup";


const OrderFlatList = ({ orders, currentStep, storageId, filterOrders, token, setLoadingTrue, setLoadingFalse, isFirstRender, setFirstRender, route, groupOrders }) => {
    const dispatch = useDispatch()
    const flatListTopRef = useRef(null);
    const prevStorId = useRef(storageId);
    const prevStep = useRef(currentStep);
    const [refresh, setRefresh] = useState(false)

    const scrollToTop = () => {
        if (flatListTopRef.current) {
            flatListTopRef.current.scrollToOffset({offset: 0, animated: false})
        }
    }

    const keyExtractor = useCallback((item, index) => (route.name === 'Замовлення' ? item?.orderId.toString() + index : item?.product.id.toString() + index), [])
    const renderItem = useCallback(({ item }) => {
        return route.name === 'Замовлення' ? 
        <RenderOrders orders={item} rightToChange={currentStep.rightToChange} scrollToTop={scrollToTop}/> :
        <RenderPlantsGroup item={item} rightToChange={currentStep.rightToChange} scrollToTop={scrollToTop} />
    }, [])

    const onRefresh = async () => {
        setRefresh(true)
        await dispatch(clearDataChange())
        await dispatch(route.name === 'Замовлення' ? getOrdersStep(currentStep, storageId.id, token[0].token) : getGroupOrdersThunk(currentStep, storageId.id, token[0].token))
        setRefresh(false)
    }

    const getOrders = async () => {
        await dispatch(route.name === 'Замовлення' ? getOrdersStep(currentStep, storageId.id, token[0].token) : getGroupOrdersThunk(currentStep, storageId.id, token[0].token))
        await new Promise((resolve) => setTimeout(resolve, 400))        
    }

    
    useEffect(() => {
        console.log('OrderFlatList useEffect', prevStorId.current, storageId)
        if (isFirstRender.current && orders?.length === 0) {            
            setLoadingTrue();            
            getOrders().then(() => setLoadingFalse());   
            setFirstRender()      
        } else if (prevStep.current != currentStep) {
            setLoadingTrue();            
            getOrders().then(() => setLoadingFalse()); 
            prevStep.current = currentStep
        }  
        return () => dispatch(clearStepOrders()) 
    }, [currentStep])

    
console.log('OrderFlatList', route)
    return (
        (route.name === 'Замовлення' ? orders.length : groupOrders.length) === 0 ?
            <View style={styles.costLineWrapper}>
                {route.name === 'Замовлення' ? 
                <Text style={styles.noneData}>Немає замовлень з таким сатусом</Text> : 
                <Text
                    style={styles.noneData}
                    allowFontScaling={true}
                    maxFontSizeMultiplier={1}
                >В цьому полі немає рослин з таким сатусом</Text>}
            </View> :
            filterOrders === null ?
                <View style={styles.costLineWrapper}>
                    <Text style={styles.noneData}>Не знайдено!</Text>
                </View> :
            <FlatList
                ref={flatListTopRef}
                data={filterOrders?.length > 0 ? filterOrders : route.name === 'Замовлення' ? orders : groupOrders}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refresh} />}
                initialNumToRender='7'
                maxToRenderPerBatch='7'
                removeClippedSubviews={true}
                windowSize={15}
                ListFooterComponentStyle={{ marginBottom: 30 }}
                ListFooterComponent={<View></View>}
            />
    )
}

const mapStateToProps = state => {
    return {
        orders: state.stepOrders,
        filterOrders: state.filterOrders,
        currentStep: state.currentStep,
        storageId: state.currentStorageId,
        token: state.token,
        groupOrders: state.groupOrders,
    }
}

export default connect(mapStateToProps)(OrderFlatList);

const styles = StyleSheet.create({
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