import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, Pressable, Keyboard, FlatList, Platform, StatusBar, Dimensions, TextInput, Alert, Picker, ScrollView, Button } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Formik } from 'formik'
import * as yup from 'yup'
import { useNavigation, useRoute } from "@react-navigation/native"
import BackNavigator from './BackNavigator';
import '@firebase/firestore'
import * as firebase from 'firebase'
import { icons, options } from '../constants';

const ValidateSchema = yup.object({
    note: yup
        .string()
        .max(150,"Maximum 150 characters"),

})

const DetailData = () => {
    const route = useRoute()
    let { item } = route.params
    const [date, setDate] = useState(new Date(item.Timestamp.seconds * 1000));


    const handlePostData = (values) => {
        firebase.firestore()
            .collection('apartments')
            .doc(firebase.auth().currentUser.uid)
            .collection('userApm')
            .doc(item.objID)
            .set({
                Apartment_Address: item.Apartment_Address,
                Property_Type: item.Property_Type,
                Monthly_Rent_Price:item.Monthly_Rent_Price,
                Bedrooms: item.Bedrooms,
                Furniture_Type: item.Furniture_Type,
                Timestamp: date,
                Note: values.note,
                Reporter: item.Reporter,
                ImageUri: item.ImageUri
            })
            .then(res=>{
                Alert.alert('Success')
            })
            .catch(err=>{
                console.log(err)
            })
    }
    return (
        <SafeAreaView style={styles.container}>
            <BackNavigator />
            <Text style={styles.header}>Update</Text>
            <ScrollView >
                <View style={styles.formStyle}>
                    <Formik
                        initialValues={{
                            note: item.Note,
                        }}
                        validationSchema={ValidateSchema}
                        onSubmit={(values, action) => {
                            // action.resetForm()
                            handlePostData(values)
                        }}
                    >
                        {(props) => (
                            <View>
                                <Text style={styles.txtlabel}>Notes</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={props.handleChange('note')}
                                    value={props.values.note}
                                    placeholder="Notes"
                                    multiline={true}
                                    numberOfLines={4}

                                />
                                {(props.errors.note) &&
                                    <Text style={styles.errorText}>{props.errors.note}</Text>
                                }
                                <Pressable style={styles.button} onPress={props.handleSubmit}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#FFFFFF' }}>Update</Text>
                                </Pressable>
                            </View>
                        )}

                    </Formik>
                </View>
            </ScrollView>
        </SafeAreaView>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: '#F5F5F5',
    },
    formStyle: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingHorizontal: 30
    },
    input: {
        width: '100%',
        padding: 10,
        backgroundColor: '#D5E3EB',
        borderRadius: 10,
        fontSize: 18
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 20,
        elevation: 5,
        backgroundColor: '#0fb9b1',
        marginVertical: 15,
        width: 150,
        marginLeft: 100
    },
    picker: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        color: 'black',

    },
    pickerBg: {
        backgroundColor: '#D5E3EB',
        width: '100%',
        borderRadius: 10,

    },
    txtlabel: {
        alignSelf: 'flex-start',
        fontSize: 16,
        marginVertical: 5
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    },
    dateStyle: {
        backgroundColor: '#D5E3EB',
        paddingVertical: 5,
        borderRadius: 20,
        width: 160,
        alignItems: 'center'
    },
    errorText: {
        color: 'red'
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'space-between'
    }
});
export default DetailData;
