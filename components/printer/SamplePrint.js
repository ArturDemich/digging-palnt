import { StyleSheet, Text, View, TouchableHighlight, Dimensions } from 'react-native';
import { BluetoothTscPrinter } from 'react-native-bluetooth-escpos-printer';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export async function printreciept(labe) {
  const screenWidth = Math.floor(Dimensions.get('window').width);
  let imgWidth
  switch (screenWidth) {
    case 800:
      imgWidth = 880
      break;
    case 490:
      imgWidth = 522
      break;
    case 411:
      imgWidth = 433
      break;
    case 392:
      imgWidth = 415
      break;
    default:
      imgWidth = screenWidth * 1.055
      break;
  }

  try {
    let options = {
      width: 51,
      height: 30,
      gap: 1,
      direction: BluetoothTscPrinter.DIRECTION.FORWARD,
      reference: [0, 0],
      tear: BluetoothTscPrinter.TEAR.ON,
      sound: 1,
      image: [{
        x: 0,
        y: 0,
        mode: BluetoothTscPrinter.BITMAP_MODE.OVERWRITE,
        width: imgWidth,
        image: labe
      }],
    }
    await BluetoothTscPrinter.printLabel(options)  // Друк зображення   

  } catch (e) {
    alert(e.message || 'ERROR');
    console.log('ERROR', e)
  }
}

const SamplePrint = ({ press }) => {

  return (
    <View>
      <View style={styles.btn}>
        <TouchableHighlight
          style={[styles.buttonStep]}
          onPress={() => press()}
        >
          <MaterialCommunityIcons name="printer-wireless" size={24} color="snow" >
            <Text
              style={styles.textBtn}
              allowFontScaling={true}
              maxFontSizeMultiplier={1}
            > Друкувати</Text>
          </MaterialCommunityIcons>
        </TouchableHighlight>
      </View>
    </View>
  );
};


export default SamplePrint;

const styles = StyleSheet.create({
  btn: {
    marginBottom: 0,
  },
  textBtn: {
    color: 'white',
    fontSize: 14,
    fontWeight: 900,
  },
  buttonStep: {
    borderRadius: 10,
    backgroundColor: 'green',
    height: 40,
    padding: 5,
    opacity: 0.95,
    elevation: 5,
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
  },
});