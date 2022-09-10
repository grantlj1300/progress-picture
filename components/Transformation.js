import { 
    View, 
    Button, 
    Image, 
    StyleSheet, 
    Text, 
    ImageBackground, 
    TouchableOpacity } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import VideoForm from './VideoForm'
import { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import Feather from '@expo/vector-icons/Feather'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

export default function Transformation({navigation, deletePhotos, route}) {

    const {name, photoObjects} = route.params
    const [currentPhotoObjects, setCurrentPhotoObjects] = useState(photoObjects)
    const [videoFormChanging, setVideoFormChanging] = useState(false)
    const [editing, setEditing] = useState(false)

    const handleVideoFormChange = () => {
        setVideoFormChanging(prevStatus => !prevStatus)
    }

    const createVideo = (secondsPerPhoto) => {
        navigation.navigate('Video', {
            photos: currentPhotoObjects.map(photo => photo.image),
            milliSecondsPerPhoto: secondsPerPhoto * 1000
        })
    }

    const addToCurrentPhotos = (newPic) => {
        const today = new Date()
        const currDate = parseInt(today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()
        setCurrentPhotoObjects(prevPhotos => [{image: newPic, date: currDate}, ...prevPhotos])
    }

    return (
        <ImageBackground
            source={require('../assets/images/spotlight-background.png')}
            style={styles.transformationContainer}
        >
            <VideoForm 
                videoFormChanging={videoFormChanging}
                handleVideoFormChange={handleVideoFormChange}
                createVideo={createVideo}
            />
            <View style={styles.photoBlockContainer}>
                {currentPhotoObjects.length > 0 ?
                <Carousel
                    layout='default'
                    data={currentPhotoObjects}
                    keyExtractor={(_, index) => index.toString()}
                    sliderWidth={400}
                    itemWidth={260}
                    inactiveSlideOpacity={0.4} 
                    //autoplay={true}
                    renderItem={({item}) => {
                        return (
                            <View>
                                {editing && 
                                <Feather 
                                    name='x-circle' 
                                    size={24} 
                                    color={'red'}
                                    onPress={() => {
                                        setCurrentPhotoObjects((prevPhotos) => 
                                            prevPhotos.filter((photo) => photo.image !== item.image))
                                        deletePhotos(item.image, name)
                                    }}
                                />}
                                <View style={{alignItems: 'center'}}>
                                    <Image source={{uri: item.image}} 
                                    style={{width:250, height:500, borderRadius: 20}}
                                    />
                                    <Text>{item.date}</Text>
                                </View>
                            </View>
                        )
                    }}
                /> 
                :
                <View style={{alignItems: 'center'}}>
                    <View 
                        style={ 
                            { justifyContent: 'center', 
                            borderWidth: 1, borderRadius: 20,
                            width: 250, 
                            height: 500, 
                            marginHorizontal: 25,
                            marginVertical: 50,
                         }}
                    >
                        <MaterialIcons 
                            name='insert-photo' 
                            size={250} 
                            color={'black'}
                        />
                        
                    </View>
                    <Text>No Photos</Text>
                </View>
                }
            </View>

            <View style={styles.footerContainer}>
                <TouchableOpacity
                    style={styles.footerItem}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons 
                        name='ios-chevron-back-circle-outline' 
                        size={36} 
                        color={'white'}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.footerItem}
                    onPress={() => setEditing(prevStatus => !prevStatus)}
                >
                    <Feather 
                        name='edit' 
                        size={36} 
                        color={'white'}
                    />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.footerItem}
                    onPress={() => navigation.navigate('Camera', {
                        name: name,
                        lastPhoto: currentPhotoObjects.at(0)?.image,
                        addToCurrentPhotos: addToCurrentPhotos
                    })}
                >
                    <Feather 
                        name='plus-circle' 
                        size={36} 
                        color={'white'}
                    />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.footerItem}
                    onPress={() => handleVideoFormChange()}
                >
                    <Ionicons 
                        name='ios-videocam-outline' 
                        size={36} 
                        color={'white'}
                    />
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    transformationContainer: {
        flex: 1,
        backgroundColor: '#7d7d7d',
        alignItems: 'center',
    },
    photoBlockContainer: {
        flex: 9,
        flexDirection: 'row',
        justifyContent: 'center', 
        alignItems:'center',
    },
    footerContainer: {
        flex: 1,
        flexDirection: 'row',
        width: '100%'
    },
    footerItem: {
        flex: 1,
        alignItems: 'center',
        borderTopColor: 'white',
        borderTopWidth: 1,
        paddingTop: 10
    }
})