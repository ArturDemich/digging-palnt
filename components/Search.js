import { connect, useDispatch } from "react-redux"
import { MaterialIcons } from '@expo/vector-icons';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState, useRef } from "react";
import { setFilterOrders, setFilterPlants, setFilterQty, setSearchText  } from "../state/dataSlice";
import { useRoute } from "@react-navigation/native";
import { TextInput } from "react-native-web";



function Search({orders, groupOrders, searchText}) {
    const dispatch = useDispatch() 
    const [inputShow, setInputShow ] = useState(false)
    const route = useRoute()
    const inputRef = useRef(null)

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
        inputShow  ? searchOrders(route.state?.index === 1 ? groupOrders : orders) : null
    }, [searchText])

     useEffect(() => {        
        inputShow ? clearInput() : null
        return () =>  clearInput() 
    }, [orders, groupOrders]) 

    const setFilter = () => {
        searchOrders(route.state?.index === 1 ? groupOrders : orders)
        setInputShow(true)
    }

    const searchOrders = (dataOrder) => { 
        let filterOrders = []
        if(searchText === '' || searchText === ' ') {
            route.state?.index === 1 ? dispatch(setFilterPlants([])) : dispatch(setFilterOrders([]))
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
            if(route.state?.index === 1) {
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
              route.state?.index === 1 ? 
              filterOrders.forEach(plant => plant.orders.forEach(order => qtyP += order.qty)) :
              filterOrders.forEach(order => order.products.forEach(prodact => qtyP += prodact.qty))
              
              total.orders = filterOrders.length
              total.plants = qtyP
              dispatch(setFilterQty(total))
            if(route.state?.index === 1) {
                dispatch(setFilterPlants(filterOrders))                
            } else {
                dispatch(setFilterOrders(filterOrders))
            }
        }        
    }

    
    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, { outline: 'none' }, inputShow && styles.inputShow]}
                onChangeText={changeText}
                value={searchText} 
                ref={inputRef}
            />
            {inputShow && (
                <TouchableOpacity onPress={() => clearInput()} style={styles.close}>
                    <Text style={{fontWeight: 700, fontSize: 20}}> X </Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setInputShow(true)}>
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

const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        height: 50,    
        position: 'relative',
        zIndex: 1,
    },
    input: {       
        position: 'relative',
        display: 'none',        
        zIndex: 1,
        borderBottomLeftRadius: 4,
        borderTopLeftRadius: 4,
        borderColor: '#7b7b7b',
        borderWidth: 1,
        paddingLeft: 5,
        height: 45,
        width: windowWidth > 329 ? 300 : windowWidth * 0.8,
        left: 115,
        bottom: 3,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 100,
        alignSelf: 'flex-end',
        backgroundColor: 'snow',            
    },
    inputShow: {
        display: 'flex',
    },
    icon:{
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        borderRadius: 5,
        marginLeft: 10,
        marginRight: 1,
        padding: 3,
        flex: 1
    },
    close: {
        position: 'relative',
        left: 115,
        zIndex: 1,
        backgroundColor: '#efefef',
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        width: 30,
        borderBottomRightRadius: 4,
        borderTopRightRadius: 4,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 100,
        borderColor: '#7b7b7b',
        borderWidth: 1,
    }
})