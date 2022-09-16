import { View, TextInput, Text, StyleSheet, Modal, Button, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react';

export default function TransformationForm({ itemToEdit, displayTransformationForm, handleDisplayTransformationForm, addNewTransformation, editTransformation }) {

    const [transformationTitle, setTransformationTitle] = useState('')
    const [trackWeight, setTrackWeight] = useState(false)
    const [poundsOrKilos, setPoundsOrKilos] = useState('lbs')
    
    useEffect(() => {
        setTransformationTitle(itemToEdit ? itemToEdit.name : '')
        setTrackWeight(itemToEdit?.weight ? true : false)
        setPoundsOrKilos(itemToEdit?.weight ? itemToEdit.weight : 'lbs')
    }, [displayTransformationForm])

    function submitForm(){
        if(transformationTitle){
            const weight = trackWeight ? poundsOrKilos : ''
            itemToEdit ? editTransformation(itemToEdit.id, transformationTitle, weight)
                : addNewTransformation(transformationTitle, weight)
            handleDisplayTransformationForm()
        }
        else{
            alert("Enter a title!")
        }
    }

    return (
        <Modal
            animationType='fade'
            visible={displayTransformationForm}
            transparent={true}
            onRequestClose={() => handleDisplayTransformationForm()}
        >
            <View style={styles.screenContainer}>
                <View style={styles.formContainer}>
                    <View>
                        <TextInput
                            value={transformationTitle}
                            maxLength={20}
                            style={styles.inputContainer}
                            placeholder="Title of Transformation"
                            onChangeText={(newTitle) => setTransformationTitle(newTitle)}
                        />
                        <TouchableOpacity
                            onPress={() => setTrackWeight(prevStatus => !prevStatus)}
                            style={{flexDirection: 'row', alignItems: 'center', padding: 10}}
                        >
                            <View style={styles.radioBox}>
                                {
                                trackWeight ?
                                    <View style={styles.selectedRadioBox}/>
                                    : null
                                }
                            </View>
                            <Text style={{paddingLeft: 5}}>Track Weight</Text>
                        </TouchableOpacity>
                        {trackWeight &&
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity
                                onPress={() => setPoundsOrKilos('lbs')}
                                style={{flexDirection: 'row', alignItems: 'center', padding: 10}}
                            >
                                <View style={styles.radioBox}>
                                    {
                                    poundsOrKilos === 'lbs' ?
                                    <View style={styles.selectedRadioBox}/>
                                        : null
                                    }
                                </View>
                                <Text style={{paddingLeft: 5}}>Pounds (lbs)</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setPoundsOrKilos('kg')}
                                style={{flexDirection: 'row', alignItems: 'center'}}
                            >
                                <View style={styles.radioBox}>
                                    {
                                    poundsOrKilos === 'kg' ?
                                    <View style={styles.selectedRadioBox}/>
                                        : null
                                    }
                                </View>
                                <Text style={{paddingLeft: 5}}>Kilograms (kg)</Text>
                            </TouchableOpacity>
                        </View>
                        }
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                        <Button
                            title='Cancel'
                            onPress={() => handleDisplayTransformationForm()}
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
    },
    radioBox: {
        height: 20,
        width: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectedRadioBox: {
        height: 10,
        width: 10,
        borderRadius: 6,
        backgroundColor: 'blue'
    }
  });