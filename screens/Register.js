import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, Pressable, Keyboard, FlatList, Platform, StatusBar, Dimensions, TextInput, Alert, Picker, ScrollView, Button } from 'react-native';
import { useNavigation } from "@react-navigation/native"
import * as firebase from 'firebase'
import '@firebase/firestore'
import { Formik } from 'formik'
import * as yup from 'yup'

const ValidateSchema = yup.object({
    email: yup
        .string()
        .email("Invalid email format")
        .required('Required'),
    password: yup
        .string()
        .min(6, "Minimum 6 characters")
        .required("Required"),
    password2: yup
        .string()
        .oneOf([yup.ref('password')], "Password not match!")
        .required("Required")
})

const Register = () => {
    const navigation = useNavigation()
    const [image, setimage] = useState(null);

    useEffect(() => {
    }, []);

    const handleRegister = (values, action) => {
        firebase.auth().createUserWithEmailAndPassword(values.email, values.password)
            .then(res => {
                action.resetForm()
                navigation.navigate('Home',{image})
            })
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.appName}>RentalZ</Text>
            <Text style={styles.header}> Register</Text>
            <Formik
                initialValues={{ email: '', password: '', password2: '' }}
                validationSchema={ValidateSchema}
                onSubmit={(values, action) => {
                    // action.resetForm()
                    handleRegister(values, action)
                }}>
                {(props) => (
                    <View>
                        <TextInput
                            onChangeText={props.handleChange('email')}
                            value={props.values.email}
                            style={styles.input}
                            placeholder="Email"
                        />
                        {(props.errors.email && props.touched.email) &&
                            <Text style={styles.errorText}>{props.errors.email}</Text>
                        }
                        <TextInput
                            onChangeText={props.handleChange('password')}
                            value={props.values.password}
                            style={styles.input}
                            placeholder="Password"
                        />
                        {(props.errors.password && props.touched.password) &&
                            <Text style={styles.errorText}>{props.errors.password}</Text>
                        }
                        <TextInput
                            onChangeText={props.handleChange('password2')}
                            value={props.values.password2}
                            style={styles.input}
                            placeholder="Re-password"
                        />
                        {(props.errors.password2 && props.touched.password2) &&
                            <Text style={styles.errorText}>{props.errors.password2}</Text>
                        }
                        <Pressable style={styles.button} onPress={props.handleSubmit}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#FFFFFF',textAlign:'center' }}>REGISTER</Text>
                        </Pressable>
                    </View>)}
            </Formik>


            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text >Already have an account?</Text>
                <Pressable onPress={() => navigation.navigate('Login')} >
                    <Text style={{ color: '#3867d6', }}> Login</Text>
                </Pressable>
            </View>
        </SafeAreaView>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: '#F5F5F5',
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign:'center'
    },
    input: {
        height: 50,
        width: '85%',
        marginTop: 15,
        padding: 10,
        backgroundColor: '#D5E3EB',
        borderRadius: 10,
        fontSize: 18,
        alignSelf:'center'
    },
    button: {
        paddingVertical: 12,
        borderRadius: 20,
        elevation: 5,
        backgroundColor: '#0fb9b1',
        alignSelf: 'center',
        width: 150,
        marginVertical: 20
    },
    appName: {
        fontWeight: 'bold',
        fontSize: 60,
        marginVertical: 20,
        color: '#12CBC4',
        textAlign:'center'
    },
    errorText: {
        color: 'red',
        textAlign:'center'
    },

})

export default Register;
