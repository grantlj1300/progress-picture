import { 
    Button, 
    Text, 
    View, 
    Image, 
    ImageBackground, 
    StyleSheet, 
    FlatList, 
    TouchableOpacity 
} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import Feather from '@expo/vector-icons/Feather'
import { useState } from 'react'

export default function Home({navigation, transformations, deleteTransformation, expoPushToken, sendPushNotification}) {
console.log(transformations)

    const [editing, setEditing] = useState(false)

    function generateCards(photos){
        switch(photos.length) {
            case 1:
                return (
                    <View 
                        style={{width: 250, height: 500, justifyContent: 'center', alignItems: 'center'}}
                    >
                        <Image 
                            source={{uri : photos[0].image}} 
                            style={{width: 200, height: 400, borderRadius: 20}}
                        /> 
                    </View>
                )
            case 2:
                return (
                    <View
                        style={{width: 250, height: 500}}
                    >
                        <ImageBackground 
                            source={{uri : photos[1].image}}
                            imageStyle={{ borderRadius: 20}}
                            style={{width: 200, height: 400, position:'absolute', top: 40, right: 15}}
                        >
                            <Image 
                                source={{uri : photos[0].image}} 
                                style={{width: 200, height: 400, borderRadius: 20, position:'absolute', top: 20, right: 15}}
                            />
                        </ImageBackground>
                    </View>
                )
            case 3:
                return (
                    <View 
                        style={{width: 250, height: 500}}
                    >
                        <ImageBackground 
                            source={{uri : photos[2].image}} 
                            imageStyle={{ borderRadius: 20}}
                            style={{width: 200, height: 400, position:'absolute', top: 30, right: 15}}
                        >
                            <ImageBackground 
                                source={{uri : photos[1].image}} 
                                imageStyle={{ borderRadius: 20}}
                                style={{width: 200, height: 400, position:'absolute', top: 20, right: 10}}
                            >
                                <Image 
                                    source={{uri : photos[0].image}} 
                                    style={{width: 200, height: 400, borderRadius: 20, position:'absolute', top: 20, right: 10}}
                                />
                            </ImageBackground>
                        </ImageBackground>
                    </View>
                )
            default:
                return <Image source={require('../assets/images/question.png')} style={{ marginTop: 50 }}/>
        }
    }

    return (
        <View style={styles.homeContainer}>

            {transformations.length > 0 ? 
            <View style={styles.previewContainer}>
                <FlatList
                    data={transformations}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal
                    renderItem={({item}) => {
                    return  (
                        <View style={styles.previewItem}>
                            {editing && <Feather 
                                name='x-circle' 
                                size={24} 
                                color={'red'}
                                onPress={() => deleteTransformation(item.name)}
                            />}
                            <TouchableOpacity onPress={() => navigation.navigate('Transformation', {
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
                        color={'gray'}
                    />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.footerItem}
                    onPress={() => navigation.navigate('New Transformation')}
                >
                    <Feather 
                        name='plus-circle' 
                        size={36} 
                        color={'gray'}
                    />
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    homeContainer: {
        flex: 1,
        alignItems: 'center',
    },
    previewContainer: {
        flex: 9,
        justifyContent: 'center', 
        alignItems:'center',
        //borderWidth:1
    },
    previewItem: {
        paddingHorizontal: 0, 
        justifyContent: 'center', 
        //borderWidth:1
    },
    footerContainer: {
        flex: 1,
        flexDirection: 'row',
        width: '100%'
    },
    footerItem: {
        width: '50%',
        alignItems: 'center',
        borderTopColor: 'gray',
        borderTopWidth: 1,
        paddingTop: 10
    }
});
