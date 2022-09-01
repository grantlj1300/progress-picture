import { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ImageBackground, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import Ionicons from '@expo/vector-icons/Ionicons'
import Feather from '@expo/vector-icons/Feather'

export default function CameraScreen({route, addNewPhoto, lastPhoto}) {

    const {transformationName} = route.params
    const [hasCameraPermission, setHasCameraPermission] = useState(null)
    const [camera, setCamera] = useState(null)
    const [image, setImage] = useState(null)
    const [type, setType] = useState(Camera.Constants.Type.front)
    const [displayPrevious, setDisplayPrevious] = useState(false)
    const [timerValue, setTimerValue] = useState(0)
    const [timerDisplay, setTimerDisplay] = useState(0)
    const [takingPicture, setTakingPicture] = useState(false)

    useEffect(() => {
      let intervalId
      if(takingPicture){
        intervalId = setInterval(() => {
          if(timerDisplay < 1){
            setTakingPicture(false)
            takePicture()
            console.log('Taking Pic')
          }
          else{
            setTimerDisplay(prevCount => prevCount - 1)
            console.log(timerDisplay)
          }
        }, 1000);
      }
      else {
        clearInterval(intervalId)
      }
      return () => clearInterval(intervalId)
    }, [takingPicture, timerDisplay])
      
    useEffect(() => {
      (async() => {
        const cameraStatus = await Camera.requestCameraPermissionsAsync()
        setHasCameraPermission(cameraStatus.status === 'granted')
      })()
    }, [])
    
    const takePicture = async() => {
      if(camera){
        let data = await camera.takePictureAsync(null)
        if(type === Camera.Constants.Type.front){
          data = await manipulateAsync(
            data.uri, 
            [ {rotate: 180} , {flip: FlipType.Vertical} ], 
            { compress: 1, format: SaveFormat.PNG }
          )
        }
        setImage(data.uri)
        //addNewPhoto(data.uri)
      }
    }
  
    if(hasCameraPermission === false){
      return <Text>No Camera Access</Text>
    }

    return (
        <View style={{flex: 1}}>
          
            {
            (!image && <View style={styles.cameraContainer}>
              <Camera
                ref={ref => setCamera(ref)}
                style={styles.innerContainer}
                type={type}
              >
                <View style={{flex: 1, flexDirection: 'row', justifyContent:'space-between'}}>
                  <Ionicons
                    name='timer-outline'
                    size={32}
                    color={'white'}
                    onPress={() => setTimerValue(timerValue === 3 ? 0 : 3)}
                  />
                  <Ionicons
                    name={displayPrevious ? 'eye-outline' : 'eye-off-outline'}
                    size={32}
                    color={'white'}
                    onPress={() => setDisplayPrevious(prevDisplay => !prevDisplay)}
                  />
                  <Ionicons 
                    name='camera-reverse-outline' 
                    size={32} 
                    color={'white'}
                    onPress={() => {
                      setType(type === Camera.Constants.Type.back 
                      ? Camera.Constants.Type.front : Camera.Constants.Type.back)
                    }}
                  />
                </View>
                {lastPhoto && displayPrevious &&
                <Image source={{uri : lastPhoto}} 
                style={{width:100, height: 100, opacity: 0.3}}/>}
                <Text style={{color:'white', fontSize:40}}>{timerDisplay || timerValue}</Text>
                <Feather 
                  name='circle' 
                  size={72} 
                  color={'white'}
                  onPress={() => {
                    setTakingPicture(true)
                    setTimerDisplay(timerValue)
                  }}
                  style={{alignSelf: 'center', paddingBottom: 20}}
                />
              </Camera>
            </View>
            ) ||
            (image && <View style={styles.cameraContainer}>
              <ImageBackground source={{uri: image}} style={{flex: 1}}>
                <Feather 
                  name='x' 
                  size={72} 
                  color={'white'}
                  onPress={() => setImage(null)}
                />
                <Ionicons 
                  name='checkmark-circle-outline'
                  size={72}
                  color={'white'}
                  onPress={() => {
                    console.log(transformationName)
                    addNewPhoto(image, transformationName)
                    setImage(null)
                  }}
                />
              </ImageBackground>
            </View>
            )
            }
          
        </View>
      );
}

const styles = StyleSheet.create({
    cameraContainer: {
      flex: 1,
      flexDirection: 'column'
    },
    innerContainer: {
      flex: 1,
      justifyContent: 'space-between',
      padding: 10
    }
  });