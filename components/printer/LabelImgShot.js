import { View, Text, ToastAndroid } from "react-native"
import { MaterialCommunityIcons, FontAwesome5, Entypo } from '@expo/vector-icons'
import ViewShot, { captureRef } from 'react-native-view-shot';
import { useEffect, useRef, useState } from "react";
import { printreciept } from "./SamplePrint";
import { connect } from "react-redux";


const LabelImgShot = ({ labelOff, dataChange }) => {
    const [item, setItem] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0);
    const ref = useRef();    

    useEffect(() => {
        startConvert()
    }, [dataChange, currentIndex])

    useEffect(() => {
        const interval = setInterval(() => {
            if(item){
             shot()
            } else {
                clearInterval(interval);
            }
        }, 500)
            
        return () => clearInterval(interval);
    }, [ item])

    const shot = () => {
        captureRef(ref, {
            format: "jpg",
            quality: 1.0,
            result: 'base64',
            //width: 520,
            //height: 200
        }).then(
             (uri) => {
                 volleyPrint(uri, item.actionqty)                
            },
            (error) => {
                ToastAndroid.show(
                    "Не вдалось сфомувати наклейку!",
                ToastAndroid.LONG
                );
                console.error("Oops, snapshot failed", error)}
        ).then(() => setCurrentIndex(prevIndex => prevIndex + 1))
    }

    const volleyPrint = (uri, qty) => {
        if (qty > 3) {
            for (let i = 0; i < 3; i++) {
                printreciept(uri)
            }
        } else if (qty <= 3) {
            for (let g = 0; g < qty; g++) {
                printreciept(uri)
            }
        }
    }

    const startConvert = async () => {
        if (currentIndex < dataChange.length) {
            await setItem(dataChange[currentIndex]);
        } else {
            labelOff()
        }
    }

    return (
        <View >
            <ViewShot ref={ref}>
                <View style={{ backgroundColor: '#ffffff', paddingLeft: 8, paddingRight: 10, paddingTop: 3,  maxWidth: 315 }}>
                    <View style={{height: 85, borderBottomWidth: 2,}} >
                        <Text style={{ fontSize: 13, fontWeight: 600, }}>{item?.characteristicName}</Text>
                        <View style={{ height: 40, flexDirection: 'row', flex: 1, paddingRight: 8 }}>
                            <MaterialCommunityIcons name="pine-tree" size={17} color="black" />
                            <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: 500, position: "relative", right: 0, top: 0 }}>{item?.productName}</Text>                        
                       </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3, paddingBottom: 2}}>
                            <MaterialCommunityIcons name="pine-tree" size={14} color="black">
                                <MaterialCommunityIcons name="shovel" size={17} color="black" />
                                <Text
                                    style={{ fontSize: 13, fontWeight: 900 }}
                                    allowFontScaling={true}
                                    maxFontSizeMultiplier={1}
                                > {item?.totalQty} шт</Text>
                            </MaterialCommunityIcons>
                            <MaterialCommunityIcons name="clipboard-list-outline" size={15} color="black">
                                <Text
                                    style={{ fontSize: 13, fontWeight: 900 }}
                                    allowFontScaling={true}
                                    maxFontSizeMultiplier={1}
                                >{item?.orderNo}</Text>
                            </MaterialCommunityIcons>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, marginTop: 3 }} >
                        <Entypo name="location" size={17} color="black">
                            <Text style={{ fontSize: 13, fontWeight: 900 }}> {item?.currentStorage}</Text>
                        </Entypo>
                        <FontAwesome5 name="truck-loading" size={13} color="black" >
                            <Text style={{ fontSize: 13, fontWeight: 700 }}> {item?.shipmentMethod}</Text>
                        </FontAwesome5>
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: 500, }}>{item?.customerName}</Text>
                </View>
            </ViewShot>
        </View>
    )
}

const mapStateToProps = state => ({
    dataChange: state.dataChange
})

export default connect(mapStateToProps)(LabelImgShot)