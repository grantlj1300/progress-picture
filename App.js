import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useState, useEffect, useRef } from "react"
import { Linking } from "react-native";
import * as Notifications from 'expo-notifications'
import HomeScreen from './components/Home'
import CameraScreen from './components/CameraScreen'
import TransformationScreen from "./components/Transformation";
import VideoScreen from "./components/VideoScreen";
import * as FileSystem from 'expo-file-system'
import { StatusBar } from "expo-status-bar";

const Stack = createNativeStackNavigator()

Notifications.setNotificationHandler({
    handleNotification: async() => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false
    })
})

export default function App() {

    const [expoPushToken, setExpoPushToken] = useState('')
    const [notification, setNotification] = useState(false)
    const notificationListener = useRef()
    const responseListener = useRef()

    const [transformations, setTransformations] = useState([])

    useEffect(() => {
        getTransformationData()
    }, [])

    const getTransformationData = async() => {
        const { exists } = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'transformations.json')
        if(!exists){
            await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'transformations.json', JSON.stringify(transformations))
        }
        try{
            const transformationData = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'transformations.json')
            if(transformationData !== null){
                setTransformations(JSON.parse(transformationData))
            }
        }
        catch(e){
            console.log(e)
        }
    }

    const storeTransformationData = async(newTransformation) => {
        try{
            await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'transformations.json', JSON.stringify(newTransformation))
        }
        catch(e){
            console.log(e)
        }
    }

    const updateTransformations = (newTransformations) => {
        setTransformations(newTransformations)
        storeTransformationData(newTransformations)
    }

    const updatePhotoObjects = (transformationId, newPhotos) => {
        const newTransformations = transformations.map((transformation) => {
            if(transformation.id === transformationId){
                return {...transformation, photoObjects: newPhotos}
            }
            else{
                return transformation
            }
        })
        setTransformations(newTransformations)
        storeTransformationData(newTransformations)
    }

    useEffect(() => {
        registerForPushNotifications().then(token => setExpoPushToken(token))
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification)
        })
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response)
        })
        return () => {
        Notifications.removeNotificationSubscription(notificationListener.current)
        Notifications.removeNotificationSubscription(responseListener.current)
        }
    }, [])

    const registerForPushNotifications = async() => {

        let token;

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
        Linking.openURL('app-settings:')
            // alert('Failed to get push token for push notification!',
            //   'please enable push notifications',
            //   [
            //     { text: 'cancel', onPress: () => console.log('cancel')},
            //     { text: 'Allow', onPress: () => Linking.openURL('app-settings:')},
            //   ],
            //   { cancelable: false}
            //   );
            // return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        //console.log(token);

        return token;
    }

    async function sendPushNotification(expoPushToken) {
        const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',
        data: { someData: 'goes here' },
        };

        await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
        });
    }

    return (
        <NavigationContainer>
        <StatusBar
            style="light"
        />
        <Stack.Navigator
        screenOptions={{headerShown: false}}
        >

            <Stack.Screen
            name='Home'
            >
            {(props) => 
            <HomeScreen 
                transformations={transformations} 
                updateTransformations={updateTransformations} 
                sendPushNotification={sendPushNotification}
                expoPushToken={expoPushToken}
                {...props}
            />}
            </Stack.Screen>

            <Stack.Screen
            name='Transformation'
            >
            {(props) => 
            <TransformationScreen 
                updatePhotoObjects={updatePhotoObjects}
                {...props}
            />}
            </Stack.Screen>

            <Stack.Screen
            name='Camera'
            >
            {(props) => <CameraScreen {...props}/>}
            </Stack.Screen>

            <Stack.Screen
            name='Video'
            >
            {(props) => <VideoScreen  {...props}/>}
            </Stack.Screen>

        </Stack.Navigator>
        </NavigationContainer>
    )

}

