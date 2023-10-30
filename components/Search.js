import { connect, useDispatch } from "react-redux"
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useState, useRef } from "react";
import { setFilterOrders, setFilterPlants, setFilterQty, setSearchText } from "../state/dataSlice";



function Search({orders, groupOrders, navigation, searchText}) {
    const dispatch = useDispatch()
    const [inputShow, setInputShow ] = useState(false)
    const inputRef = useRef(null)
    const routeIdx = navigation.getState().routes[1].state?.index

    const changeText = (val) => {
        dispatch(setSearchText(val))
    }
    
     const clearInput = async () => {
        await dispatch(setSearchText(''))
        await dispatch(setFilterOrders([]))
        await dispatch(setFilterPlants([]))
        await dispatch(setFilterQty({
            orders: null,
            plants: null
          }))
        await setInputShow(false)
    }
    
    useEffect(() => {
        inputShow ? inputRef.current.focus() : null
    }, [inputShow])
    
   
    useEffect(() => {   
        searchText ?  setFilter() : null  
        inputShow  ? searchOrders(routeIdx === 1 ? groupOrders : orders) : null
    }, [searchText])

     useEffect(() => {        
        inputShow ? clearInput() : null
        return () =>  clearInput() 
    }, [orders, groupOrders]) 

    const setFilter = () => {
        searchOrders(routeIdx === 1 ? groupOrders : orders)
        setInputShow(true)
    }

    const searchOrders = (dataOrder) => { 
        let filterOrders = []
        if(searchText === '' || searchText === ' ') {
            routeIdx === 1 ? dispatch(setFilterPlants([])) : dispatch(setFilterOrders([]))
            return
        }
        for (let i = 0; i < dataOrder.length; i++) {   // всі замовлення      
            let equle 
            for (let arr in dataOrder[i]) {            // одне замовлення 
                 if(equle) {
                    break
                } 
                if(Array.isArray(dataOrder[i][arr])) {  // якщо є масив             
                    let array = dataOrder[i][arr]                    
                    array.forEach(item => {             // 1об'єкт в масиві
                        if(equle) {
                            return
                        }
                        for (let key in item) {
                            if(equle) {
                                return
                            }
                            let obj = item[key]
                            if (typeof obj == 'object') {                                                        
                                for (let k in obj) {
                                    if(obj[k].toLowerCase().includes(searchText.toLowerCase())) {
                                        equle = true
                                        filterOrders.push(dataOrder[i])
                                        return
                                    } 
                                }
                            } else {                               
                                if(String(obj).toLowerCase().includes(searchText.toLowerCase())) {
                                    equle = true
                                    filterOrders.push(dataOrder[i])
                                    return
                                }                     
                            }                        
                        }                    
                    })
               } else if ( typeof dataOrder[i][arr] == 'string') {
                    if(String(dataOrder[i][arr]).toLowerCase().includes(searchText.toLowerCase())) {
                        equle = true
                        filterOrders.push(dataOrder[i])
                    } 
               } else if (typeof dataOrder[i][arr] == 'object') {
                let obj = dataOrder[i][arr]
                for (let k in obj) {                    
                    if(obj[k].toLowerCase().includes(searchText.toLowerCase())) {
                        equle = true
                        filterOrders.push(dataOrder[i])
                    } 
                }                
               }               
            } 
            
        }     
        if(filterOrders.length === 0) {
            dispatch(setFilterQty({
                orders: 0,
                plants: 0
              }))
            if(routeIdx === 1) {
                dispatch(setFilterPlants(null))                
            } else {
                dispatch(setFilterOrders(null))
            }
        } else {
            let qtyP = 0
            const total = {
                orders: 0,
                plants: 0
              }
              routeIdx === 1 ? 
              filterOrders.forEach(plant => plant.orders.forEach(order => qtyP += order.qty)) :
              filterOrders.forEach(order => order.products.forEach(prodact => qtyP += prodact.qty))
              
              total.orders = filterOrders.length
              total.plants = qtyP
              dispatch(setFilterQty(total))
            if(routeIdx === 1) {
                dispatch(setFilterPlants(filterOrders))                
            } else {
                dispatch(setFilterOrders(filterOrders))
            }
        }        
    }

    
    return (
        <View style={styles.container}>
            {inputShow && (
            <View style={{flexDirection: 'row'}}>
            <TextInput
                style={styles.input}
                onChangeText={changeText}
                value={searchText} 
                ref={inputRef}
                inputMode="search"
            />
            
                <TouchableOpacity onPress={() => clearInput()} style={styles.close}>
                    <Text style={{fontWeight: 700}}> X </Text>
                </TouchableOpacity>
                </View>
            )}
            <TouchableOpacity onPress={() => setInputShow(true)} style={{height: '100%', justifyContent: 'center'}} >
                <MaterialIcons name="search" size={24} color="black" style={styles.icon} />
            </TouchableOpacity>
        </View>
    )

}

const mapStateToProps = state => ({
    orders: state.stepOrders,
    groupOrders: state.groupOrders,
    searchText: state.searchText
})
export default connect(mapStateToProps)(Search)

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56, 
    },
    input: {
        borderWidth: 1,
        display: 'flex',
        borderRadius: 5,
        borderColor: '#7b7b7b',
        minWidth: 160,
        maxWidth: 200,
        height: 32,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 100,
        elevation: 90,
        alignSelf: 'flex-end',
        backgroundColor: 'snow',
        left: 28,
        paddingLeft: 5,        
    },
    icon:{
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        borderRadius: 10,
        marginLeft: 3,
        marginRight: 3,

    },
    close: {
        alignItems: 'center',
        right: 3,   
        top: 11 ,
        height: 60,
        width: 30,
        justifyContent: 'center',
    }
})