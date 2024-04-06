import { Dimensions, StyleSheet, Text, View, Alert, Button, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';


// implmenetation of Camera_page
const Display_page = ({navigation, route}) => {
  const [reRender, updateRerender] = useState(false)
  const [imageStatus, updateStatus] = useState(false)
  const [annoedImage, updateImage] = useState("")
  //Start of variables from camera
  const BASE_URL = route.params.BASE_URL; 
  //End of variables from camera

  // Set dynamic image container
  const original_width = 400
  const original_height = 500
  const aspectRatio = original_width/original_height
  const screenWidth = Dimensions.get('window').width;
  const calculatedHeigt = screenWidth/aspectRatio;

  var default_Img = require('./default_img.png')
  
  function getData(){
    // console.log("url: " + url)
    axios({
      method: 'get',
      url: BASE_URL + '/view_app',//check URL with Lily or have another way to input URL in the UI
      timeout: 5000,
    })
      .then((response) => {
        if(response === 200){//successfully sent image back
          console.log(response.data);
          updateImage(response.data)
          updateStatus(true)
        } else if (response === 400){
          // no image was in server
        }
        else{
          // server dead
        }
          // supposed to get response of 200
          // if receive 400 then there is no image that has been processed
      });
  }//might want to change this to be useEffect instead so it is constantly updated
    // Refer to camera page but don't use async, it should be continuous

  function toggleState(){
    imageStatus? updateStatus(false) : updateStatus(true)
  }
  // console.log(BASE_URL+'/view_browser')

  function toggleRerender() {
    reRender? toggleRerender(false) : toggleRerender(true)
  }


  useEffect(()=>{
    let interval = setInterval( async () => {

    })
  })


  return (
    <View style={styles.container}>
      {imageStatus &&
      <> 
        <Image 
          style={{width:screenWidth, height:calculatedHeigt}} 
          source={{
            uri:BASE_URL+'/view_browser',
            method: 'GET',
          }} 
          resizeMode = 'contain'
        />
        <Button style={styles.button} title='Image State: True' onPress={toggleState}/>
      </>}
      { (imageStatus===false) &&
      <>
        <Image source={default_Img}/> 
        <Button style={styles.button} title='Image State: False' onPress={toggleState}/>
      </>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayImage: {
    width: 400,
    height: 500,
    backgroundColor: 'blue',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    // flex: 1,
    flexDirection: 'row',
    // alignSelf: 'center',
    // alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 4,
    backgroundColor: 'blue',
    margin: 15,
  },
  buttonContainer_red: {
    // flex: 1,
    flexDirection: 'row',
    // alignSelf: 'center',
    // alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 4,
    backgroundColor: 'red',
    margin: 15,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center'
  },
  text:{
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  } ,
});


export default Display_page
