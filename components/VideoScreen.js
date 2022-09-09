import { Image, StatusBar, View } from 'react-native'

export default function VideoScreen({route, navigation}) {

    const { photos } = route.params

    return (
        <View style={{padding: 40}}>
            <StatusBar hidden/>
            <Image source={{uri: photos[0]}} style={{width: '100%', height: '100%'}}/>
        </View>
    )
}
