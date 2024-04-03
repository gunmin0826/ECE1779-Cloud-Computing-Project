import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, Pressable, TouchableOpacity } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as Device from 'expo-device';
import { Camera, CameraType } from 'expo-camera';
import { useEffect, useState } from 'react';


// import pages to be used in the Navigation stacks
import Network_page from './screen_pages/Network_page.js';
import Camera_page from './screen_pages/Camera_page.js';
import Display_page from './screen_pages/Display_page/js';

const Stack = createNativeStackNavigator();


const base_params = {
  BASE_URL: '',
  IP: '',
  PORT: '',
  API_EXIST: false,
};

const Homescreen = ({navigation, route}) => {
  // useEffect(()=>{ // This useEffect clause is for debugging 
  //   if(route.params?.BASE_URL){
  //     console.log('Homescreen/url: ' + route.params.BASE_URL);
  //     console.log('Homescreen/ip: ' + route.params.IP);
  //     console.log('Homescreen/port: ' + route.params.PORT);
  //     console.log('Homescreen/api: ' + route.params.API_EXIST);
  //     console.log();
  //   }
  // }), [route.params?.BASE_URL];
  
  return (
    <View style={styles.container}>
        <Text>Press this button to establish network</Text>
        <Button
          title="Establish Network"
          onPress={() => 
            navigation.navigate("Establish Network", params=(route.params)? route.params : base_params )
          }
        />
        <Text></Text>
        <Text> {Device.manufacturer}: {Device.modelName} </Text>
        <Text></Text>
        <Text>Press this button to start streaming</Text>
        <Button
          title="Access Camera"
          onPress={() => 
            navigation.navigate("Access Camera", params=(route.params)? route.params : base_params )
          }
        />
        <Text></Text>
        <Text>Press this button to display result</Text>
        <Button
          title="Display Image"
          onPress={() =>
            navigation.navigate("Display Image", params=(route.params)? route.params : base_params )
          }
        />
        <StatusBar style="auto"/>
      </View>
  );
};


// using this App.js as the top-level page and implementation of Homescreen
// implementation of other pages are located in /screen_pages directory
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Home" component={Homescreen}/>
        <Stack.Screen name="Establish Network" component={Network_page}/>
        <Stack.Screen name="Access Camera" component={Camera_page}/>
        <Stack.Screen name="Display Image" component={Display_page}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'blue',
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

function Button(props) {
  const { onPress, title = 'Save' } = props;
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}
