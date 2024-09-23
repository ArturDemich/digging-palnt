import Checkbox from "expo-checkbox"
import { memo, useState } from "react"
import { Text, StyleSheet, View } from "react-native"
import shortid from "shortid"
import RenderOrderByGroup from "./RenderOrderByGroup"
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native"
import { connect, useDispatch } from "react-redux"
import { setSearchText } from "../state/dataSlice"



const styles = StyleSheet.create({
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: 'black',
        justifyContent: 'center',
        height: 'auto',
        marginBottom: 20,
        paddingBottom: 5,
        borderRadius: 5,
        margin: 5,
        elevation: 5,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 7,
    },
    costLineWrapper: {
        height: 'auto',
        flex: 1,
        flexDirection: 'column',
        width: '100%',        
    },
    plantName: {
        height: 'auto',
        fontSize: 15,
        fontWeight: '700',
        //width: '94%',
        textShadowRadius: 3,
        paddingRight: 2
    },
    characteristics: {
        height: 'auto',
        fontSize: 13,
        textAlignVertical: 'center',
        paddingLeft: 10,
        paddingBottom: 1,
        flex: 1
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#eef9ee',
        paddingLeft: 3,
        paddingRight: 3,
        paddingBottom: 7,        
    },
    quantity: {
        height: 'auto',
        textAlignVertical: 'center',
        alignSelf: 'center',
        fontSize: 12,
        fontWeight: 600
    },
    changeinfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 3,
        paddingLeft: 3,
        paddingRight: 3,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 7,
        paddingLeft: 5,
        paddingRight: 10,
        backgroundColor: '#eef9ee',
        borderRadius: 5,
    },
    orderInfoBlock: {
        flexDirection: 'column',
        width: '100%',
        paddingLeft: 3,
        paddingRight: 3,
    },
    checkBox: {
        height: 25,
        width: 25,
    },
    location: {
        height: 'auto',
        textAlignVertical: 'center',
        lineHeight: 25,
        alignSelf: 'center',
        paddingBottom: 5,
        fontSize: 14,
        fontWeight: 500,        
    },
    toucheble: color => ({
        elevation: 2,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 5,    
        shadowColor: color,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 7,
        paddingRight: 7,
        borderRadius: 3,        
    }),
})

function RenderPlantsGroup({ item, rightToChange, scrollToTop, currentColor }) {
    const dispatch = useDispatch()
    const [selectedAll, setSelectedAll] = useState(false)
    let qty = 0
    item.orders.forEach(elem => qty += elem.qty)

    const searchPoint = async (value) => {
        await dispatch(setSearchText(value))
        scrollToTop()
    }

    return (
        <View style={styles.rowFront}>
            <View style={styles.costLineWrapper}>
                <View style={styles.infoContainer}>
                    <TouchableOpacity style={{cursor: 'pointer'}} onPress={() => searchPoint(item.product.name)}>
                        <Text
                            style={styles.plantName}
                            allowFontScaling={true}
                            maxFontSizeMultiplier={1}
                        >{item.product.name}</Text>
                    </TouchableOpacity>
                    {rightToChange && item.orders.length > 1 ?
                        <Checkbox
                            value={selectedAll}
                            color='#45aa45'
                            onValueChange={() => setSelectedAll(!selectedAll)}
                            style={styles.checkBox}
                        /> : null}
                </View>
                <View style={styles.info}>
                    <View>
                        <Text style={styles.characteristics}
                            allowFontScaling={true}
                            maxFontSizeMultiplier={1}
                        >{item.characteristic.name}</Text>
                        <TouchableOpacity style={styles.toucheble(currentColor)} onPress={() => searchPoint(item.storage?.id)}>
                                <Entypo name="location" size={20} color="black">
                                    <Text 
                                        style={styles.location}
                                        allowFontScaling={true}
                                        maxFontSizeMultiplier={1}
                                        > {item.storage?.name}</Text>
                                </Entypo>
                        </TouchableOpacity>
                    </View>
                    <MaterialCommunityIcons name="pine-tree" size={20} color="black">
                        <MaterialCommunityIcons name="pine-tree" size={14} color="black" />
                        <Text
                            style={styles.quantity}
                            allowFontScaling={true}
                            maxFontSizeMultiplier={1}
                        > {qty} шт</Text>
                    </MaterialCommunityIcons>
                </View>
                <View style={styles.changeinfo}>
                    <View style={styles.orderInfoBlock}>
                        {item.orders.map(elem =>
                            <RenderOrderByGroup
                                key={shortid.generate()}
                                plant={item} order={elem}
                                selectedAll={selectedAll}
                                scrollToTop={scrollToTop}
                            />
                        )}
                    </View>
                </View>
            </View>
        </View>

    )
}

const mapStateToProps = state => ({   
    currentColor: state.currentColorStep,
    //rightToChange: state.currentStep?.rightToChange
})

export default connect(mapStateToProps)(memo(RenderPlantsGroup))