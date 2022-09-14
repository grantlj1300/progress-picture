import { View, TextInput, StyleSheet, Modal, Button } from 'react-native'
import { useState } from 'react';

export default function VideoForm({ videoFormChanging, handleVideoFormChange, createVideo }) {

    const [secondsPerPhoto, setSecondsPerPhoto] = useState(0)

    function submitForm(){
        if(secondsPerPhoto <= 0){
            alert("Seconds Per Photo must be greater than 0!")
            return
        }
        handleVideoFormChange()
        createVideo(secondsPerPhoto)
    }

    return (
        <Modal
            animationType='fade'
            visible={videoFormChanging}
            transparent={true}
            onRequestClose={() => handleVideoFormChange()}
        >
            <View style={styles.screenContainer}>
                <View style={styles.formContainer}>
                    <View>
                        <TextInput
                            style={styles.inputContainer}
                            keyboardType='numeric'
                            contextMenuHidden={true}
                            placeholder="Seconds Per Photo"
                            onChangeText={(seconds) => setSecondsPerPhoto(seconds)}
                        />
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                        <Button
                            title='Cancel'
                            onPress={() => handleVideoFormChange()}
                        />
                        <Button
                            title='Submit'
                            onPress={() => submitForm()}
                        /> 
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1, 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#00000080'
    },
    formContainer: {
        padding: 20, 
        width: 300, 
        minHeight: 0,
        justifyContent: 'space-between',
        backgroundColor: '#fff', 
    },
    inputContainer: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10
    }
})