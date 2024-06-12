import { SafeAreaView, Text } from "react-native"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons';
import { useSelector } from "react-redux";


function HeaderTitle({ title }) {
    const token = useSelector((state) => state.token)
    const userName = token[0].username
    return (
        <SafeAreaView style={{ gap: 5, marginLeft: 10, flex: 1, paddingTop: 5 }} >
            <Entypo name="location" size={17} color="black" >
                <Text
                    style={{ fontWeight: 700, }}
                    allowFontScaling={true}
                    maxFontSizeMultiplier={1}
                > {title}</Text>
            </Entypo>
            <MaterialCommunityIcons style={{ height: 20 }} name="account-cowboy-hat-outline" size={14} color="black">
                <Text
                    style={{ fontWeight: 500 }}
                    allowFontScaling={true}
                    maxFontSizeMultiplier={1}
                > {userName}</Text>
            </MaterialCommunityIcons>
        </SafeAreaView>
    )
}

export default HeaderTitle