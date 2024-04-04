import { Dimensions, StyleSheet, Text, View, Alert, Button, TouchableOpacity, SafeAreaView, } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';


// implmenetation of Camera_page
const Display_page = ({navigation, route}) => {

  const [annoedImage, updateImage] = useState("")
  //Start of variables from camera
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [streamStatus, changeStreamStatus] = useState(false);
  const [camReady, changeCamReady] = useState(false);
  const cameraRef = useRef();
  const BASE_URL = route.params.BASE_URL; 
  const [initial, setInitial] = useState(true);
  //End of variables from camera

  function getData(){
    // console.log("url: " + url)
    axios({
      method: 'get',
      url: url + '/view_app',//check URL with Lily or have another way to input URL in the UI
      timeout: 5000,
    })
      .then((response) => {
        if(response === 200){//successfully sent image back
          console.log(response.data);
          updateImage(response.data)
          updateImageBool(true)
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


  return (
    <View style={styles.container}>
      { annoedImage && <Image style={styles.displayImage} source={{uri: annoedImage}}/>}//display image if it exists¬
      <Button
        title="Get Picture"
        onPress={getData}
      />
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
