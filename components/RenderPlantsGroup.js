import Checkbox from "expo-checkbox"
import { useState } from "react"
import { Text, StyleSheet, TouchableHighlight, View } from "react-native"
import shortid from "shortid"
import RenderOrderByGroup from "./RenderOrderByGroup"


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
        elevation: 10,
        shadowColor: '#52006A',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        shadowColor: '#52006A'
    },
    costLineWrapper: {
        height: 'auto',
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        paddingLeft: 3,
        paddingRight: 3,
    },
    plantName: {
        height: 'auto',
        fontSize: 15,
        fontWeight: '600',
        width: '94%',
        textShadowRadius: 3
    },
    characteristics: {
        height: 'auto',
        fontSize: 13,
        textAlignVertical: 'center',
        paddingLeft: 10,
        paddingBottom: 1,
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 3
    },
    quantity: {
        height: 'auto',
        textAlignVertical: 'center',
        alignSelf: 'center',
    },
    changeinfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 7,
        paddingLeft: 3,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 7,
        paddingLeft: 3,
        paddingRight: 5
    },
    orderInfoBlock: {
        flexDirection: 'column',
        marginTop: 3,
        width: '100%',
    },
    checkBox: {
        height: 25,
        width: 25,
    },
})

function RenderPlantsGroup({ plants, rightToChange }) {
    const [selectedAll, setSelectedAll] = useState(false)
    const item = plants.item

    let qty = 0
    item.orders.forEach(elem => qty += elem.qty)   
    
    return (
        <View>
            <TouchableHighlight
                style={styles.rowFront}
                underlayColor={'#AAA'}
            >
                <View style={styles.costLineWrapper}>
                    <View style={styles.infoContainer}>
                        <Text 
                        style={styles.plantName}
                        allowFontScaling={true}
                        maxFontSizeMultiplier={1}
                        >{item.product.name}</Text>
                        <Checkbox
                            value={selectedAll}
                            color='#45aa45'
                            onValueChange={() => setSelectedAll(!selectedAll)}
                            style={[styles.checkBox, !rightToChange && { display: 'none' }]}
                        />
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.characteristics}
                        allowFontScaling={true}
                        maxFontSizeMultiplier={1}
                        >{item.characteristic.name}</Text>
                        <Text style={styles.quantity}> всього: <Text style={styles.textStr}> {qty} шт</Text></Text>
                    </View>
                    <View style={styles.changeinfo}>
                        <View style={styles.orderInfoBlock}>
                            {item.orders.map(elem =>
                                <RenderOrderByGroup
                                    key={shortid.generate()}
                                    plant={item} order={elem}
                                    selectedAll={selectedAll}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        </View>
    )
}


export default RenderPlantsGroup