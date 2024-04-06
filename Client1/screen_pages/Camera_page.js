import { Dimensions, StyleSheet, Text, View, Alert, Button, TouchableOpacity, SafeAreaView, } from 'react-native';
import { Camera, CameraType, AutoFocus } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';


// implmenetation of Camera_page
const Camera_page = ({navigation, route}) => {

  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [streamStatus, changeStreamStatus] = useState(false);
  const [camReady, changeCamReady] = useState(false);
  const cameraRef = useRef();
  const BASE_URL = route.params.BASE_URL; 
  const [initial, setInitial] = useState(true);
  

  function toggleCameraType(){
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }


  function startStreaming(){
    changeStreamStatus(true);
    setInitial(false);
  }

  function stopStreaming(){
    changeStreamStatus(false);
  }

  function onCameraReady(){
    changeCamReady(true);
  }


  useEffect(() => {  
    // create async repeated post request to Server. immediately cancel the async call if we are not supposed to
    let interval = setInterval( async () => { // wait for the picture to be taken as call again until 'streamStatus' becomes false
        const photo = await cameraRef.current.takePictureAsync({base64:true});
    axios.post(BASE_URL + '/stream', {
        height: photo.height,
        width: photo.width,
        base64: photo.base64,
    })
    // might want to comment out the .then() cluase so we dont need to wait for server's response
    // .then(function (response) {
    //   console.log(response.data);
    // });
    }, 0);
    if (initial) {
      clearInterval(interval);
    }
    if ((initial === false) && camReady && (streamStatus === false)){ // if we press 'Stop Streaming' button stop clear interval
      console.log("Streaming Stopped");
      clearInterval(interval);
    }

    if ((initial === false) && (camReady) && (streamStatus)) {
        console.log("Streaming Start");
    }

    return () => { // clear interval if the component gets unmounted
      clearInterval(interval); 
    }

  }, [cameraRef, streamStatus])


  if (!permission){
    return <View/>
  }

  if (!permission.granted){
    return (
      <View style={styles.container}>
        <Text style={{textAlign:'center'}}> We need your permission to show the camera </Text>
        <Button onPress={requestPermission} title='grant permission' />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraSize}>
        <Camera ref={cameraRef} style={styles.camera} type={type} onCameraReady={onCameraReady} autoFocus={AutoFocus.on}>
        {/* <Camera ref={cameraRef} style={styles.camera} type={type} onCameraReady={onCameraReady} > */}
        </Camera>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
          <Text style={styles.text}> Flip Camera </Text>
        </TouchableOpacity>
      </View>
      { camReady && (streamStatus === false) &&
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={startStreaming}>
          <Text style={styles.text}> Start Streaming </Text>
        </TouchableOpacity> 
      </View>}
      { camReady && streamStatus && 
        <View style={styles.buttonContainer_red}>
        <TouchableOpacity style={styles.button} onPress={stopStreaming}>
          <Text style={styles.text}> Stop Streaming </Text>
        </TouchableOpacity>
      </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraSize: {
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


export default Camera_page