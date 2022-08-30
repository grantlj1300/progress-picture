import { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { Camera } from 'expo-camera';

export default function CameraScreen({addNewPhoto}) {

    const [hasCameraPermission, setHasCameraPermission] = useState(null)
    const [camera, setCamera] = useState(null)
    const [image, setImage] = useState(null)
    const [type, setType] = useState(Camera.Constants.Type.back)
  
    useEffect(() => {
      (async() => {
        const cameraStatus = await Camera.requestCameraPermissionsAsync()
        setHasCameraPermission(cameraStatus.status === 'granted')
      })()
    }, [])
  
    const takePicture = async() => {
      if(camera){
        const data = await camera.takePictureAsync(null)
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
                style={styles.fixedRatio}
                type={type}
                //ratio={'1:1'}
              />
              <Button
                title="Flip Camera"
                onPress={() => {
                  setType(type === Camera.Constants.Type.back 
                  ? Camera.Constants.Type.front : Camera.Constants.Type.back)
              }}
              />
              <Button
                title="Take Picture"
                onPress={() => takePicture()}
              />
            </View>
            ) ||
            (image && <View style={styles.cameraContainer}>
              <Image source={{uri: image}} style={{flex: 1}} />
              <Button
                title="Save Picture"
                onPress={() => {
                  addNewPhoto(image)
                  setImage(null)
              }}
              />
              <Button
                title="Retake Picture"
                onPress={() => setImage(null)}
              />
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
    fixedRatio: {
      flex: 1,
      
    }
  });