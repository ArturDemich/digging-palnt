import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import Order from './Order'
import AllPlants from './AllPlants'
import { connect, useDispatch } from 'react-redux';
import { setStorageId } from '../state/dataSlice';
import { useEffect } from 'react';

const Tab = createMaterialTopTabNavigator();

function FildScreen({ currentColor, token, digStorages }) {
    const dispatch = useDispatch()

    useEffect(() => {
        if (digStorages.length === 1) {
            dispatch(setStorageId(digStorages[0].id))
        }
    }, [])

    return (
        <Tab.Navigator
            initialRouteName="Замовлення"
            screenOptions={{
                tabBarActiveTintColor: '#ffff',
                tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
                tabBarStyle: { backgroundColor: currentColor, height: 40, justifyContent: 'center' },
                tabBarIndicatorStyle: { backgroundColor: '#f2f2f2', height: 4, },
                lazy: true,
            }}
        >
            <Tab.Screen
                name="Замовлення"
                component={Order}
                options={{ tabBarLabel: 'Замовлення' }}
                initialParams={{ token: token }}
            />
            <Tab.Screen
                name="Рослини Замовлення"
                component={AllPlants}
                options={{ tabBarLabel: 'Всі Рослини' }}
                initialParams={{ token: token }}
            />

        </Tab.Navigator>
    )
}

const mapStateToProps = state => ({
    currentColor: state.currentColorStep,
    token: state.token,
    digStorages: state.digStorages
})

export default connect(mapStateToProps)(FildScreen)

