import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, Pressable, FlatList, Platform, StatusBar, Dimensions, TextInput, Alert, Picker, ScrollView } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Formik } from 'formik'
import * as yup from 'yup'
import '@firebase/firestore'
import * as firebase from 'firebase'
import { icons, options } from '../constants';
import { useNavigation, useRoute } from "@react-navigation/native"

import SearchBar from './SearchBar';
import RNPickerSelect from 'react-native-picker-select';

const ValidateSchema = yup.object({
    apmAddr: yup
        .string()
        .required('Apartment name is required'),
    propType: yup
        .string().nullable()
        .test('check', 'Selection is required', val => {
            return val != null
        }),
    price: yup
        .number()
        .required('Price is required')
        .positive(),
    bedR: yup
        .string().nullable()
        .test('check', 'Selection is required', val => {
            return val != null
        }),
    note: yup
        .string()
        .max(150,"Maximum 150 characters"),
    user: yup
        .string()
        .required('Reporter is required'),

})
const Home = () => {
    const [date, setDate] = useState(new Date());
    const [ImageUri, setImageUri] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const navigation = useNavigation()
    const route = useRoute()
    const { image } = route.params
    useEffect(() => {

        // console.log(firebase.auth().currentUser.uid)
    }, []);

    const uploadImage = async (values, action) => {
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
        console.log(childPath)

        const response = await fetch(image);
        const blob = await response.blob();

        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);


        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                handlePostData(values, action,snapshot);
                console.log(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }

    const handlePostData = (values, action, downloadURl) => {
        let AddressConvert = values.apmAddr.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
        firebase.firestore()
            .collection('apartments')
            .doc(firebase.auth().currentUser.uid)
            .collection('userApm')
            .add({
                Apartment_Address: AddressConvert,
                Property_Type: values.propType,
                Monthly_Rent_Price: values.price,
                Bedrooms: values.bedR,
                Furniture_Type: values.furniture,
                Timestamp: date,
                Note: values.note,
                Reporter: values.user,
                ImageUri: downloadURl
            })
            .then(res => {
                action.resetForm()
                Alert.alert('Success')
            })
            .catch(err => {
                console.log('err')
            })
    }

    const handleCheckData = (values, action) => {
        let dateCoverted = date.toLocaleDateString()
        let AddressConvert = values.apmAddr.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
        firebase.firestore()
            .collection('apartments')
            .doc(firebase.auth().currentUser.uid)
            .collection('userApm')
            .where('Apartment_Address', '==', AddressConvert)
            .get()
            .then((snapshot) => {
                let items = snapshot.docs.map(doc => {
                    let item = doc.data();
                    let iditem = doc.id;
                    return { iditem, ...item }
                });
                if (items.length >= 1) {
                    Alert.alert('Apartment already exists')
                }
                else {
                    Alert.alert(
                        'Apartment Information',
                        `Apartment address: ${AddressConvert}\n`
                        + `Property type: ${values.propType}\n`
                        + `Bedrooms: ${values.bedR}\n`
                        + `Date time: ${dateCoverted}\n`
                        + `Purniture type: ${values.furniture}\n`
                        + `Monthly rent price: $${values.price}\n`
                        + `Note:${values.note}\n`
                        + `Reporter: ${values.user}`,
                        [
                            {
                                text: "Cancel",
                                style: "cancel"
                            },
                            { text: "OK", onPress: () => uploadImage(values, action) }
                        ]
                    )
                }
                // setdata(items);
            })
    }
    const handleLogout = () => {
        firebase.auth().signOut()
            .then(res => {
                navigation.navigate('Login')
            })
    }
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setDate(date)
        hideDatePicker();
    };
    return (
        <SafeAreaView style={styles.container}>
            {/* <Text style={styles.header}>Apartment RentalZ</Text> */}
            <View style={styles.headerContainer}>
                <Pressable onPress={handleLogout} >
                    <Image
                        source={icons.logout}
                        resizeMode='contain'
                        style={{ width: 20, height: 20 }} />
                </Pressable>
                <SearchBar />
                <Pressable onPress={() => navigation.navigate('ListData')}>
                    <Image
                        source={icons.clipboard}
                        resizeMode='contain'
                        style={{ width: 20, height: 20 }} />
                </Pressable>
            </View>
            <ScrollView >
                <View style={styles.formStyle}>
                    <Formik
                        initialValues={{ apmAddr: '', propType: "", price: '', bedR: "", furniture: "", note: '', user: '' }}
                        validationSchema={ValidateSchema}
                        onSubmit={(values, action) => {
                            handleCheckData(values, action)
                        }}
                    >
                        {(props) => (
                            <View>
                                <Text style={styles.txtlabel}>Apartment Address</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={props.handleChange('apmAddr')}
                                    value={props.values.apmAddr}
                                    placeholder="Apartment Address"
                                    onBlur={props.handleBlur('apmAddr')}
                                />
                                {(props.errors.apmAddr && props.touched.apmAddr) &&
                                    <Text style={styles.errorText}>{props.errors.apmAddr}</Text>
                                }

                                <Text style={styles.txtlabel}>Property Type</Text>
                                <View style={styles.pickerBg} >
                                    <Picker
                                        selectedValue={props.values.propType}
                                        style={styles.picker}
                                        onValueChange={(itemValue, itemIndex) => { props.setFieldValue('propType', itemValue) }}
                                    >
                                        {options.propTypes.map((item, i) => {
                                            return (
                                                <Picker.Item label={item.label} value={item.value} key={i} />
                                            )
                                        })}
                                    </Picker>
                                </View>
                                {(props.errors.propType && props.touched.propType) &&
                                    <Text style={styles.errorText}>{props.errors.propType}</Text>
                                }

                                <Text style={styles.txtlabel}>Bedrooms</Text>
                                <View style={styles.pickerBg}>
                                    <Picker
                                        selectedValue={props.values.bedR}
                                        style={styles.picker}
                                        onValueChange={(itemValue, itemIndex) => props.setFieldValue('bedR', itemValue)}
                                    >
                                        {options.bedrTypes.map((item, i) => {
                                            return (
                                                <Picker.Item label={item.label} value={item.value} key={i} />
                                            )
                                        })}
                                    </Picker>
                                </View>
                                {(props.errors.bedR && props.touched.bedR) &&
                                    <Text style={styles.errorText}>{props.errors.bedR}</Text>
                                }



                                <Text style={styles.txtlabel}>Date and time of adding the Property</Text>
                                <Pressable onPress={showDatePicker} style={styles.dateStyle}>
                                    <Text>{new Date(date).toLocaleDateString()} - {new Date(date).toLocaleTimeString()}</Text>
                                </Pressable>
                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="datetime"
                                    onConfirm={handleConfirm}
                                    onCancel={hideDatePicker}
                                    maximumDate={new Date()}
                                />


                                <Text style={styles.txtlabel}>Monthly rent price </Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={props.handleChange('price')}
                                    value={props.values.price}
                                    placeholder="Price"
                                    keyboardType='numeric'
                                    onBlur={props.handleBlur('price')}
                                />
                                {(props.errors.price && props.touched.price) &&
                                    <Text style={styles.errorText}>{props.errors.price}</Text>
                                }


                                <Text style={styles.txtlabel}>Furniture types</Text>
                                <View style={styles.pickerBg}>
                                    <Picker
                                        selectedValue={props.values.furniture}
                                        style={styles.picker}
                                        onValueChange={(itemValue, itemIndex) => props.setFieldValue('furniture', itemValue)}
                                    >
                                        {options.furniTypes.map((item, i) => {
                                            return (
                                                <Picker.Item label={item.label} value={item.value} key={i} />
                                            )
                                        })}
                                    </Picker>
                                </View>

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

                                <Text style={styles.txtlabel}>Reposter</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={props.handleChange('user')}
                                    value={props.values.user}
                                    placeholder="User Name"
                                    onBlur={props.handleBlur('user')}
                                />
                                {(props.errors.user && props.touched.user) &&
                                    <Text style={styles.errorText}>{props.errors.user}</Text>
                                }


                                <Text style={styles.txtlabel}>Thumbnail</Text>
                                <View style={{ alignItems: 'center' }}>
                                    <Pressable onPress={() => navigation.navigate("TakeImage")}>
                                        <Image
                                            source={icons.camera}
                                            resizeMode='contain'
                                            style={{ width: 40, height: 40 }}
                                        />
                                    </Pressable>
                                    <Image
                                        source={image ? icons.checked : icons.none}
                                        resizeMode='contain'
                                        style={{ width: 20, height: 20 }}
                                    />
                                </View>

                                <Pressable style={styles.button} onPress={props.handleSubmit}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#FFFFFF', textAlign: 'center' }}>Check</Text>
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
        borderRadius: 20,
        elevation: 5,
        backgroundColor: '#0fb9b1',
        alignSelf: 'center',
        width: 150,
        marginVertical: 20
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

export default Home;
