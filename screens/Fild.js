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
            dispatch(setStorageId(digStorages[0]))
        }
    }, [])

    return (
        <Tab.Navigator
            initialRouteName="Замовлення"
            screenOptions={{
                tabBarActiveTintColor: '#ffff',
                tabBarLabelStyle: { fontSize: 14, fontWeight: '700' },
                tabBarStyle: { backgroundColor: currentColor, height: 45, justifyContent: 'center' },
                tabBarIndicatorStyle: { backgroundColor: '#f2f2f2', height: 5, },
                lazy: true,
                unmountOnBlur: true,
                detachInactiveScreens: true,
            }}
        >
            <Tab.Screen
                name="Замовлення"
                component={Order}
                options={{ tabBarLabel: 'Замовлення' }}                
            />
            <Tab.Screen
                name="Рослини Замовлення"
                component={AllPlants}
                options={{ tabBarLabel: 'Всі Рослини' }}
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

