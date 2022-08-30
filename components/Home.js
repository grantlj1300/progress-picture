import { Button, Text, View, Image, StyleSheet } from 'react-native'

export default function Home({navigation}) {
    return (
        <View style={styles.homeContainer}>
            <Button 
                title='+ Add New Transformation'
                onPress={() => navigation.navigate('New Transformation')}
            />
            <View>
                <Text onPress={() => navigation.navigate('Transformation')}>Transformation title</Text>
                <Image source={require('../assets/images/question.png')} style={{ marginTop: 50 }}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    homeContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-evenly'
    }
});
