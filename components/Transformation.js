import { 
    View, 
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
import WeightForm from './WeightForm'

export default function Transformation({navigation, updatePhotoObjects, route}) {

    const {id, trackingWeight, photoObjects} = route.params
    const [currentPhotoObjects, setCurrentPhotoObjects] = useState(photoObjects)
    const [videoFormChanging, setVideoFormChanging] = useState(false)
    const [weightFormChanging, setWeightFormChanging] = useState(false)
    const [editing, setEditing] = useState(false)

    const handleVideoFormChange = () => {
        setVideoFormChanging(prevStatus => !prevStatus)
    }

    const handleWeightFormChange = () => {
        setWeightFormChanging(prevStatus => !prevStatus)
    }

    const createVideo = (secondsPerPhoto) => {
        navigation.navigate('Video', {
            photos: currentPhotoObjects.map(photo => photo.image),
            millisecondsPerPhoto: secondsPerPhoto * 1000
        })
    }

    const addNewPhoto = (newPic) => {
        const today = new Date()
        const currDate = parseInt(today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()
        const newPhotoObjects = [{image: newPic, date: currDate, weight: ''}, ...currentPhotoObjects]
        setCurrentPhotoObjects(newPhotoObjects)
        updatePhotoObjects(id, newPhotoObjects)
        if(trackingWeight){
            setWeightFormChanging(true)
        }
    }

    const deletePhoto = (photoToDelete) => {
        const newPhotos = currentPhotoObjects.filter(photoObject => photoObject.image !== photoToDelete)
        setCurrentPhotoObjects(newPhotos)
        updatePhotoObjects(id, newPhotos)
    }

    const editPhotoWeight = (image, newWeight) => {
        const newPhotos = currentPhotoObjects.map(photoObject => {
            if(photoObject.image === image){
                return {...photoObject, weight: newWeight}
            }
            else{
                return photoObject
            }
        })
        setCurrentPhotoObjects(newPhotos)
        updatePhotoObjects(id, newPhotos)
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
            <WeightForm 
                weightFormChanging={weightFormChanging}
                handleWeightFormChange={handleWeightFormChange}
                weightLabel={trackingWeight}
                editPhotoWeight={editPhotoWeight}
                image={currentPhotoObjects.at(0)?.image}
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
                                    onPress={() => deletePhoto(item.image)}
                                />}
                                <View style={{alignItems: 'center'}}>
                                    <Image source={{uri: item.image}} 
                                    style={{width:250, height:500, borderRadius: 20, marginBottom: 30}}
                                    />
                                    <View style={styles.previewTextBox}>
                                        <Text>{item.date}</Text>
                                        {item.weight && <Text>{item.weight}</Text>}
                                    </View>
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
                            borderWidth: 1, borderRadius: 20, borderColor: 'white',
                            width: 250, 
                            height: 500, 
                            marginHorizontal: 25,
                            marginVertical: 50,
                         }}
                    >
                        <MaterialIcons 
                            name='insert-photo' 
                            size={250} 
                            color={'white'}
                        />
                        
                    </View>
                    <Text style={{color: 'white'}}>No Photos</Text>
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
                        lastPhoto: currentPhotoObjects.at(0)?.image,
                        addNewPhoto: addNewPhoto
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
        backgroundColor: 'black',
        alignItems: 'center',
    },
    photoBlockContainer: {
        flex: 9,
        flexDirection: 'row',
        justifyContent: 'center', 
        alignItems:'center',
    },
    previewTextBox: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        shadowOpacity: 0.8, 
        shadowRadius: 2, 
        shadowOffset:{width:1}, 
        shadowColor: 'white'
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