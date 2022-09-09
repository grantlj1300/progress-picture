import { ImageBackground, StatusBar, View, TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useState, useEffect } from 'react'

export default function VideoScreen({route, navigation}) {

    const { photos } = route.params
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
    const [playingVideo, setPlayingVideo] = useState(false)

    useEffect(() => {
        let intervalId
        if(playingVideo){
            intervalId = setInterval(() => {
                if(photos[currentPhotoIndex + 1]){
                    setCurrentPhotoIndex(prev => prev + 1)
                }
                else{
                    setCurrentPhotoIndex(0)
                    setPlayingVideo(false)
                }
            }, 200);
        }
        else {
            clearInterval(intervalId)
        }
        return () => clearInterval(intervalId)
    }, [playingVideo, currentPhotoIndex])

    return (
        <View style={{}}>
            <StatusBar hidden/>
            <ImageBackground source={{uri: photos[currentPhotoIndex]}} style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                {!playingVideo &&
                <TouchableOpacity
                    onPress={() => setPlayingVideo(true)}
                >    
                    <Ionicons 
                        name='play-circle-sharp' 
                        size={128} 
                        color={'white'}
                    />
                </TouchableOpacity>}
            </ImageBackground>
        </View>
    )
}
