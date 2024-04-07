import { Dimensions, StyleSheet, Text, View, Alert, Button, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';


// implmenetation of Camera_page
const Display_page = ({navigation, route}) => {
  // const [reRender, updateRerender] = useState(false)
  const [stream, updateStream] = useState(false)
  // const [annoedImage, updateImage] = useState("")
  const [toggler, setToggler] = useState(false)
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
    stream? updateStream(false) : updateStream(true)
  }
  // console.log(BASE_URL+'/view_browser')

  function Toggle(){
    toggler? setToggler(false) : setToggler(true)
  }


  function renderImageFromServer(){
    console.log("Render server image")
    Toggle();
    // return (
    //   <View style={styles.container}>
    //     <Image 
    //       style={{width:screenWidth, height:calculatedHeigt}} 
    //       source={{
    //         uri:BASE_URL+'/view_browser',
    //         method: 'GET',
    //       }} 
    //       resizeMode = 'contain'
    //     />
    //     <View sytle={styles.buttonContainer_red}>
    //       <TouchableOpacity sytle={styles.buttonContainer_red} onPress={toggleState}>
    //         <Text style={styles.button}> Stop Streaming </Text>
    //       </TouchableOpacity> 
    //     </View>
    //   </View>);
  }

  function renderDefaultImage(){
    console.log("renderDefaultImage")
    // Toggle()
    // return(
    //   <View style={styles.container}>
    //     <Image source={default_Img}/> 
    //     <View sytle={styles.buttonContainer_red}>
    //       <TouchableOpacity sytle={styles.buttonContainer} onPress={toggleState}>
    //         <Text style={styles.button}> Start Streaming </Text>
    //       </TouchableOpacity> 
    //     </View>
    //   </View>
    // );
  }

  var counter = 0
  const max_count = 100
  useEffect(()=>{
    let interval = setInterval( () => {
      return renderImageFromServer();
    }, 0);
    if (stream===false){
      clearInterval(interval);
      return renderDefaultImage();
    }

    return () => {
      clearInterval(interval);
    }
  }, [stream])


  return (
    <View style={styles.container}>
      {stream &&
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
      { (stream===false) &&
      <>
        <Image source={default_Img}/> 
        <Button style={styles.button} title='Start Streaming' onPress={toggleState}/>
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
