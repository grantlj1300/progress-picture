import { 
    Text,
    View, 
    Image, 
    ImageBackground, 
    StyleSheet, 
    TouchableOpacity,
    Alert } from 'react-native'
import NewTransformationModal from './TransformationForm'
import Feather from '@expo/vector-icons/Feather'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Carousel from 'react-native-snap-carousel'
import uuid from 'react-native-uuid'
import { useState } from 'react'

export default function Home({navigation, transformations, updateTransformations, expoPushToken, sendPushNotification}) {

    const [editing, setEditing] = useState(false)
    const [itemToEdit, setItemToEdit] = useState(null)
    const [displayTransformationForm, setDisplayTransformationForm] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    const addNewTransformation = (newName, newDays, newWeight) => {
        const today = new Date()
        const currDate = parseInt(today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()
        const newTransformations = [
        {
            id: uuid.v4(),
            name: newName, 
            daysBetweenPhotos: newDays,
            startDate: currDate, 
            weight: newWeight,
            photoObjects: []
        },
        ...transformations]
        updateTransformations(newTransformations)
    }

    const deleteTransformation = (transformationId) => {
        const newTransformations = transformations.filter((transformation) => {
            return transformation.id !== transformationId
        })
        updateTransformations(newTransformations)
    }

    const editTransformation = (transId, transName, transDays, transWeight) => {
        const newTransformations = transformations.map(transformation => {
            if(transformation.id === transId){
                return {...transformation, name: transName, daysBetweenPhotos: transDays, weight: transWeight}
            }
            else{
                return transformation
            }
        })
        updateTransformations(newTransformations)
    }

    const handleDisplayTransformationForm = () => {
        setDisplayTransformationForm(prevStatus => !prevStatus)
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
                itemToEdit={itemToEdit}
                displayTransformationForm={displayTransformationForm}
                handleDisplayTransformationForm={handleDisplayTransformationForm}
                addNewTransformation={addNewTransformation}
                editTransformation={editTransformation}
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
                                            onPress: () => deleteTransformation(item.id)
                                        }
                                        ]
                                    )
                                }
                            />}
                            <TouchableOpacity 
                                onPress={() => {
                                    if(editing){
                                        setItemToEdit(item)
                                        handleDisplayTransformationForm()
                                    }
                                    else{
                                        navigation.navigate('Transformation', {
                                            id: item.id,
                                            daysBetweenPhotos: item.daysBetweenPhotos,
                                            startDate: item.startDate,
                                            photoObjects: item.photoObjects,
                                            trackingWeight: item.weight
                                        })
                                    }
                                }
                            } 
                                style={{alignItems:'center'}}
                            >
                                {generateCards(item.photoObjects.slice(0, 3))}
                                <Text style={{fontWeight: 'bold', marginBottom: 10}}>{item.name}</Text>
                                <Text>Created: {item.startDate}</Text>
                            </TouchableOpacity>
                        </View>
                    )}}
                /> 
            </View>
            :
            <View style={styles.previewContainer}>
                <View style={{alignItems: 'center'}}>
                    {generateCards([])}
                    <Text style={{fontWeight: 'bold'}}>No Collections</Text>
                </View>
            </View>
            }

            <View style={styles.footerContainer}>
                <TouchableOpacity
                    style={styles.footerItem}
                    activeOpacity={1}
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
                    activeOpacity={1}
                    onPress={() => {
                        setEditing(false)
                        setItemToEdit(null)
                        handleDisplayTransformationForm()
                    }}
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
