import { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import Slider from '@react-native-community/slider';
import Ionicons from '@expo/vector-icons/Ionicons'
import Feather from '@expo/vector-icons/Feather'

export default function CameraScreen({route, navigation}) {

    const {lastPhoto, addNewPhoto} = route.params
    const [hasCameraPermission, setHasCameraPermission] = useState(null)
    const [camera, setCamera] = useState(null)
    const [image, setImage] = useState(null)
    const [type, setType] = useState(Camera.Constants.Type.front)
    const [timerValue, setTimerValue] = useState(0)
    const [timerDisplay, setTimerDisplay] = useState(0)
    const [timerExpanded, setTimerExpanded] = useState(false)
    const [takingPicture, setTakingPicture] = useState(false)
    const [settingBackgroundOpacity, setSettingBackgroundOpacity] = useState(false)
    const [backgroundOpacity, setBackgroundOpacity] = useState(0)

    useEffect(() => {
        let intervalId
        if(takingPicture){
            intervalId = setInterval(() => {
                if(timerDisplay > 0){
                    setTimerDisplay(prevCount => prevCount - 1)
                }
                else{
                    takePicture()
                    setTakingPicture(false)
                }
            }, 1000);
        }
        else {
            clearInterval(intervalId)
        }
        return () => clearInterval(intervalId)
    }, [takingPicture, timerDisplay])

    useEffect(() => {
        if(backgroundOpacity === 0){
            setSettingBackgroundOpacity(false)
        }
    }, [backgroundOpacity])
      
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
            setBackgroundOpacity(0)
        }
    }
  
    if(hasCameraPermission === false){
        return <Text>No Camera Access</Text>
    }

    return (
        <View style={{flex: 1}}>
            {
            (!image && 
            <View style={styles.cameraContainer}>
                <Camera
                    ref={ref => setCamera(ref)}
                    style={styles.innerContainer}
                    type={type}
                >
                    <ImageBackground 
                        source={{uri: lastPhoto}} 
                        imageStyle={{ opacity: backgroundOpacity }}
                        style={{width: '100%', height: '100%'}}
                    >
                        <View style={styles.cameraHeader}>
                            <View style={timerExpanded && styles.timerOpen}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => setTimerExpanded(prevStatus => !prevStatus)}
                                >
                                    <Ionicons
                                        name={timerValue === 0 || timerExpanded ? 'timer-outline' : 'timer'}
                                        size={32}
                                        color={timerExpanded ? 'black' : 'white'}
                                    />
                                </TouchableOpacity>
                                {timerExpanded && 
                                <View style={{height: 103, justifyContent: 'space-between', alignItems: 'center', paddingTop: 6}}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => {
                                            setTimerValue(0)
                                            setTimerExpanded(false)
                                        }}
                                    >
                                        <Text style={[timerValue === 0 && {fontWeight: 'bold'}, {fontSize: 17}]}>0s</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => {
                                            setTimerValue(3)
                                            setTimerExpanded(false)
                                        }}
                                    >
                                        <Text style={[timerValue === 3 && {fontWeight: 'bold'}, {fontSize: 17}]}>3s</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => {
                                            setTimerValue(10)
                                            setTimerExpanded(false)
                                        }}
                                    >
                                        <Text style={[timerValue === 10 && {fontWeight: 'bold'}, {fontSize: 17}]}>10s</Text>
                                    </TouchableOpacity>
                                </View>}
                            </View>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => {
                                    if(backgroundOpacity === 0){
                                        setBackgroundOpacity(0.3)
                                    }
                                    setSettingBackgroundOpacity(prevStatus => !prevStatus)
                                }}
                            >
                                <Ionicons
                                    name={backgroundOpacity === 0 ? 'eye-off-outline' : 'eye-outline'}
                                    size={32}
                                    color={'white'}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => {
                                    setType(type === Camera.Constants.Type.back 
                                    ? Camera.Constants.Type.front : Camera.Constants.Type.back)
                                }}
                            >
                                <Ionicons 
                                    name='camera-reverse-outline' 
                                    size={32} 
                                    color={'white'}
                                />
                            </TouchableOpacity>
                        </View>

                        {settingBackgroundOpacity && 
                        <Slider 
                            style={{width: 200, height: 40, alignSelf: 'center', marginBottom: 20}}
                            onValueChange={(value) => setBackgroundOpacity(value)}
                            value={backgroundOpacity}
                            minimumTrackTintColor={'white'}
                        />}
                        
                        {takingPicture ? 
                        <Text style={{color: 'white', fontSize: 72, alignSelf: 'center', paddingBottom: 30}}>{timerDisplay}</Text> 
                        :
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                setSettingBackgroundOpacity(false)
                                setTimerExpanded(false)
                                if(timerValue){
                                    setTakingPicture(true)
                                    setTimerDisplay(timerValue)
                                }
                                else{
                                    takePicture()
                                }
                            }}
                        >
                            <Feather 
                                name='circle' 
                                size={72} 
                                style={{alignSelf: 'center', paddingBottom: 30}}
                                color={'white'}
                            />
                        </TouchableOpacity>
                        }
                    </ImageBackground>
                </Camera>
            </View>
            ) 
            
            ||

            (image && 
            <View style={styles.cameraContainer}>
                <ImageBackground source={{uri: image}} style={styles.innerContainer}>
                    <ImageBackground 
                        source={{uri: lastPhoto}} 
                        imageStyle={{ opacity: backgroundOpacity }}
                        style={{width: '100%', height: '100%'}}
                    >
                    <View style={styles.cameraHeader}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                setBackgroundOpacity(0)
                                setSettingBackgroundOpacity(false)
                                setImage(null)
                            }}
                        >
                            <Feather 
                                name='x' 
                                size={32} 
                                color={'white'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                if(backgroundOpacity === 0){
                                    setBackgroundOpacity(0.3)
                                }
                                setSettingBackgroundOpacity(prevStatus => !prevStatus)
                            }}
                        >
                            <Ionicons
                                name={backgroundOpacity === 0 ? 'eye-off-outline' : 'eye-outline'}
                                size={32}
                                color={'white'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                addNewPhoto(image)
                                navigation.goBack()
                            }}
                        >
                            <Ionicons 
                                name='checkmark-circle-outline'
                                size={32}
                                color={'white'}
                            />
                        </TouchableOpacity>
                    </View>
                    {settingBackgroundOpacity && 
                        <Slider 
                            style={{width: 200, height: 40, alignSelf: 'center', marginBottom: 50}}
                            onValueChange={(value) => setBackgroundOpacity(value)}
                            value={backgroundOpacity}
                            minimumTrackTintColor={'white'}
                        />}
                    </ImageBackground>
                </ImageBackground>
            </View>
            )}
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
    },
    cameraHeader: {
        flex: 1, 
        flexDirection: 'row', 
        justifyContent:'space-between', 
        paddingTop: 50,
        paddingHorizontal: 10
    },
    timerOpen: {
        flexDirection: 'column', 
        height: 150, 
        backgroundColor: 'rgba(255,255,255,0.75)',
        borderRadius: 15, 
        alignItems: 'center',
    },
    timerClosed: {
        
    }
  });