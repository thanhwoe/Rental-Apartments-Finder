import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, Pressable, Keyboard, FlatList, Platform, StatusBar, Dimensions, TextInput, Alert, Picker, ScrollView, Button } from 'react-native';
import { useNavigation } from "@react-navigation/native"
import * as firebase from 'firebase'
import '@firebase/firestore'
import { icons } from '../constants';

const SearchBar = () => {
    const [searchKey, setSearchKey] = useState("");
    const [data, setdata] = useState([]);
    const navigation = useNavigation()

    const handleSearch = ()=>{
        let AddressConvert = searchKey.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
        firebase.firestore()
            .collection('apartments')
            .doc(firebase.auth().currentUser.uid)
            .collection('userApm')
            .where('Apartment_Address', '==', AddressConvert)
            .get()
            .then((snapshot) => {
                let items = snapshot.docs.map(doc => {
                    const item = doc.data();
                    const iditem = doc.id;
                    return { iditem, ...item }
                });
                navigation.navigate('SearchRessult',{items})
                // setdata(items);
            })
    }
    // console.log(data)
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', position:'relative' }}>
        <TextInput
            style={styles.searchInput}
            onChangeText={setSearchKey}
            value={searchKey}
            placeholder='Search...'
        />
        <TouchableOpacity
            onPress={handleSearch}
            style={styles.iconSearch}>
            <Image
                source={icons.search}
                style={{ width: 20, height: 20}}
            />
        </TouchableOpacity>
    </View>
    );
}
const styles = StyleSheet.create({
    searchInput: {
        height: 40,
        width: Dimensions.get('window').width * 0.85-50,
        padding: 10,
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#FFFFFF'
    },
    iconSearch: {
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        position:'absolute',
        right:10
    }
})
export default SearchBar;
