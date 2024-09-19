import React, { useEffect } from 'react'
import Navigate from './navigation/AppNavigator'
import { Provider as StoreProvider } from 'react-redux'
import { store } from './state/store'
import { StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import * as SplashScreen from 'expo-splash-screen';


export default function App() {  

  useEffect(() => {
    const prepare = async () => {
      try {        
        await SplashScreen.preventAutoHideAsync();

        setTimeout(async () => {
          await SplashScreen.hideAsync();
        }, 3000); 
      } catch (e) {
        console.warn(e);
      }
    };

    prepare();
  }, []);

  return (
    <StoreProvider store={store}>
      <StatusBar hidden={false} barStyle='dark-content' backgroundColor='white' />
      <NavigationContainer>        
        <Navigate />
      </NavigationContainer> 
    </StoreProvider>
  )
}

