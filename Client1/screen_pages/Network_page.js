import { StyleSheet, Text, View, Alert, Pressable, Button, TextInput } from 'react-native';
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
// implementation of Network_page


const Network_page = ({navigation, route}) => {
  const { BASE_URL, IP, PORT, API_EXIST } = route.params;
  const [data, changeData] = useState("");
  const [hostIP, changeIP] = useState(IP);
  const [hostPort, changePort] = useState(PORT);
  const [apiExist, changeState] = useState(API_EXIST);
  var url = '';

  useEffect(()=>{
    url = 'http://' + hostIP + ':' + hostPort;
  }), [hostIP, hostPort];


  function getData(){
    // console.log("url: " + url)
    axios({
      method: 'get',
      url: url,
      timeout: 5000,
    })
      .then((response) => {
      changeData(response.data)
      });
  }

  function toggle_api_state(){
    (apiExist)? (changeState(false)) : (changeState(true)); 
  }

  function set_IP_Port(){
    toggle_api_state();
    navigation.setParams({ // update the params
      BASE_URL: url,
      API_EXIST: true,
      IP: hostIP,
      PORT: hostPort,
    });
  }

  function reset_IP_Port(){
    toggle_api_state();
    changeData('');
  }

  function save_IP_Port(){
    changeState(true);
    navigation.navigate({
      name: 'Home',
      params: { BASE_URL: url, IP: hostIP, PORT: hostPort, API_EXIST: true },
      merge: true,
    });
  }

  function returnHome(){ // update return to home and pass the updated params
    navigation.navigate({
      name: 'Home',
      params: { BASE_URL: url, IP: hostIP, PORT: hostPort, API_EXIST: true },
      merge: true,
    });
  }

  if (apiExist === false){
    // console.log('render ip/port assign page')
    return (
      <View style={network_page_styles.container}>
      <Text style={network_page_styles.text}>Write the IP of the Host</Text>
        <TextInput
          style={network_page_styles.input}
          placeholder="IP"
          onChangeText={ip_string => changeIP(ip_string)}
          defaultValue={hostIP}
        />
        <Text></Text>
        <Text style={network_page_styles.text}>Write the Port of the Host</Text>
        <TextInput
          style={network_page_styles.input}
          placeholder="Port"
          onChangeText={port_string => changePort(port_string)}
          defaultValue={hostPort}
        />
        <Text></Text>
        <Button style={network_page_styles.button} title="Set IP/Port, check connection" onPress={set_IP_Port}/>
        <Button style={network_page_styles.button} title="Save IP/Port, return to Home" onPress={save_IP_Port}/>
      </View>);
  } else {
    // console.log('Network_page/url: ' + BASE_URL);
    // console.log('Network_page/ip: ' + IP);
    // console.log('Network_page/port: ' + PORT);
    // console.log('Network_page/api_exist: ' + API_EXIST);
    // console.log();
    return (
        <View style={network_page_styles.container}>
          <Text style={network_page_styles.text}>Next line will print the data returned from GET request</Text>
          <Text style={network_page_styles.text}>From Server: {data}</Text>
          <Button style={network_page_styles.button} title="GET" onPress={getData} />
          <Text style={{fontSize:10, color:'blue'}}> URL --> {BASE_URL} </Text>
          <Text></Text>
          <Button style={network_page_styles.button} title="Reset Host IP/Port" onPress={reset_IP_Port} />
          <Button style={network_page_styles.button} title="return to Home" onPress={returnHome} />
        </View>
    );
  }
};

const network_page_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
  },
  button: {
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'blue',
  },
});

export default Network_page