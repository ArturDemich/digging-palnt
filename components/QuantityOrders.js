import { StyleSheet, View, Text } from "react-native";
import { connect } from "react-redux";
import { MaterialCommunityIcons } from '@expo/vector-icons';

function QuantityOrders({totalOrderQty, totalPlantQty, filterOrderQty, filterPlantQty, route}) {

  return (
    <View style={styles.infoblock}>
      <MaterialCommunityIcons name="pine-tree" size={24} color="black">
        <MaterialCommunityIcons name="pine-tree" size={18} color="black" />
        <Text style={styles.textinfo}>всіх рослин: {filterPlantQty !== null ? filterPlantQty : totalPlantQty}</Text>
      </MaterialCommunityIcons>

      {route.name === 'Замовлення' && <MaterialCommunityIcons name="clipboard-list-outline" size={24} color="black">
        <Text style={styles.textinfo}>замовлень: {filterOrderQty !== null ? filterOrderQty : totalOrderQty}</Text>
      </MaterialCommunityIcons>}
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    totalPlantQty: state.totalPlantQty,
    totalOrderQty: state.totalOrderQty,
    filterPlantQty: state.filterPlantQty,
    filterOrderQty: state.filterOrderQty,
  };
};
export default connect(mapStateToProps)(QuantityOrders);


const styles = StyleSheet.create({
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
})