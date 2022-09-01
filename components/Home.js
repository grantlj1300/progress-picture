import { Button, Text, View, Image, StyleSheet, FlatList } from 'react-native'

export default function Home({navigation, transformations, deleteTransformation}) {
console.log(transformations)
    return (
        <View style={styles.homeContainer}>
            <Button 
                title='+ Add New Transformation'
                onPress={() => navigation.navigate('New Transformation')}
            />
            <FlatList
                data={transformations}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                pagingEnabled
                renderItem={({item}) => {
                    return <View style={{marginHorizontal:50, justifyContent: 'center', alignItems:'center'}}>
                            <Text onPress={() => navigation.navigate('Transformation', {
                                transformationName: item.transformationName,
                                photos: item.photos,
                            })}>{item.transformationName}</Text>
                            {/* <Image source={{uri: item.photos[0]}} 
                            style={{width:200, height:400, borderRadius:16}}
                            /> */}
                            <Image source={require('../assets/images/question.png')} style={{ marginTop: 50 }}/>
                            <Button title='remove' onPress={() => deleteTransformation(item.transformationName)}/>
                        </View>
                }}
            />
            {/* <View>
                <Text onPress={() => navigation.navigate('Transformation')}>Transformation title</Text>
                <Image source={require('../assets/images/question.png')} style={{ marginTop: 50 }}/>
            </View> */}
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
