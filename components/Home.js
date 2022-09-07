import { 
    Modal, 
    Text,
    TextInput, 
    View, 
    Image, 
    ImageBackground, 
    StyleSheet, 
    TouchableOpacity,
    Alert } from 'react-native'
import NewTransformationModal from './NewTransformationForm'
import Ionicons from '@expo/vector-icons/Ionicons'
import Feather from '@expo/vector-icons/Feather'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Carousel from 'react-native-snap-carousel'
import { useState } from 'react'

export default function Home({navigation, transformations, deleteTransformation, expoPushToken, sendPushNotification, addNewTransformation}) {

    const [editing, setEditing] = useState(false)
    const [creatingNewTransformation, setCreatingNewTransformation] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    const handleCreateTransformationChange = () => {
        setCreatingNewTransformation(prevStatus => !prevStatus)
    }

    function generateCards(photos){
        switch(photos.length) {
            case 1:
                return (
                    <View 
                        style={[styles.imageStackContainer, 
                            { justifyContent: 'center', alignItems: 'center' }]}
                    >
                        <Image 
                            source={{uri : photos[0].image}} 
                            style={[styles.imageSizing, { borderRadius: 20 }]}
                        /> 
                    </View>
                )
            case 2:
                return (
                    <View
                        style={styles.imageStackContainer}
                    >
                        <ImageBackground 
                            source={{uri : photos[1].image}}
                            imageStyle={{ borderRadius: 20}}
                            style={[styles.imageSizing, { position:'absolute', top: 40, right: 15 }]}
                        >
                            <Image 
                                source={{uri : photos[0].image}} 
                                style={[styles.imageSizing, { borderRadius: 20, position:'absolute', top: 20, right: 15 }]}
                            />
                        </ImageBackground>
                    </View>
                )
            case 3:
                return (
                    <View 
                        style={styles.imageStackContainer}
                    >
                        <ImageBackground 
                            source={{uri : photos[2].image}} 
                            imageStyle={{ borderRadius: 20}}
                            style={[styles.imageSizing, { position:'absolute', top: 30, right: 15 }]}
                        >
                            <ImageBackground 
                                source={{uri : photos[1].image}} 
                                imageStyle={{ borderRadius: 20}}
                                style={[styles.imageSizing, { position:'absolute', top: 20, right: 10 }]}
                            >
                                <Image 
                                    source={{uri : photos[0].image}} 
                                    style={[styles.imageSizing, { borderRadius: 20, position:'absolute', top: 20, right: 10 }]}
                                />
                            </ImageBackground>
                        </ImageBackground>
                    </View>
                )
            default:
                return (
                    <View 
                        style={[styles.imageStackContainer, 
                            { justifyContent: 'center', alignItems: 'center', 
                            borderWidth: 1, borderRadius: 20,
                            width: 200, 
                            height: 400, 
                            marginHorizontal: 25,
                            marginVertical: 50,
                         }]}
                    >
                        <MaterialIcons 
                            name='photo-album' 
                            size={200} 
                            color={'black'}
                        />
                        
                    </View>
                )
        }
    }

    return (
        <ImageBackground 
            source={require('../assets/images/spotlight-background.png')}
            style={styles.homeContainer}
        >
            <NewTransformationModal 
                creatingNewTransformation={creatingNewTransformation}
                handleCreateTransformationChange={handleCreateTransformationChange}
                addNewTransformation={addNewTransformation}
            />
            {transformations.length > 0 ? 
            <View style={styles.previewContainer}>
                <Carousel
                    layout='default'
                    data={transformations}
                    sliderWidth={400}
                    itemWidth={250}
                    inactiveSlideOpacity={0.4}                    
                    onSnapToItem={(index) => setCurrentIndex(index)}
                    renderItem={({item, index}) => {
                    return  (
                        <View>
                            {editing && 
                            <Feather 
                                name='x-circle' 
                                size={24} 
                                color={'red'}
                                onPress={() => 
                                    Alert.alert(
                                        "Delete Collection?",
                                        "This will permanently delete all photos and cannot be undone",
                                        [
                                        { text: "Cancel" },
                                        {
                                            text: "Delete", 
                                            onPress: () => deleteTransformation(item.name)
                                        }
                                        ]
                                    )
                                }
                            />}
                            <TouchableOpacity onPress={() => !editing && navigation.navigate('Transformation', {
                                name: item.name,
                                daysBetweenPhotos: item.daysBetweenPhotos,
                                startDate: item.startDate,
                                photoObjects: item.photoObjects
                            })} 
                                style={{alignItems:'center'}}
                            >
                                {generateCards(item.photoObjects.slice(0, 3))}
                                <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
                                <Text>Began: {item.startDate}</Text>
                            </TouchableOpacity>
                        </View>
                    )}}
                /> 
            </View>
            :
            <View style={styles.previewContainer}>
                <Text>No Transformations</Text>
                <Image source={require('../assets/images/question.png')} style={{ marginTop: 50 }}/>
            </View>
            }

            <View style={styles.footerContainer}>
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
                    //onPress={() => navigation.navigate('New Transformation')}
                    onPress={() => handleCreateTransformationChange()}
                >
                    <Feather 
                        name='plus-circle' 
                        size={36} 
                        color={'white'}
                    />
                </TouchableOpacity>
            </View>

        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    homeContainer: {
        flex: 1,
        backgroundColor: '#7d7d7d',
        alignItems: 'center',
    },
    previewContainer: {
        flex: 9,
        flexDirection: 'row',
        justifyContent: 'center', 
        alignItems:'center',
        //borderWidth:1
    },
    previewItem: {
        //borderWidth:1
    },
    imageStackContainer: {
        width: 250, 
        height: 500, 
        shadowOpacity: 0.8, 
        shadowRadius: 2, 
        shadowOffset:{width:1}, 
        shadowColor: 'white'
    },
    imageSizing: {
        width: 200, 
        height: 400
    },
    footerContainer: {
        flex: 1,
        flexDirection: 'row',
        width: '100%'
    },
    footerItem: {
        width: '50%',
        alignItems: 'center',
        borderTopColor: 'white',
        borderTopWidth: 1,
        paddingTop: 10
    }
});
