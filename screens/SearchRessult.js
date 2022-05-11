import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, Pressable, Keyboard, FlatList, Platform, StatusBar, Dimensions, TextInput, Alert, Picker, ScrollView, Button } from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native"
import * as firebase from 'firebase'
import '@firebase/firestore'
import { date } from 'yup/lib/locale';
import { icons } from '../constants';
import BackNavigator from './BackNavigator'

const SearchRessult = () => {
    const route = useRoute()
    const data = route.params.items

    const handleViewData = (item)=>{
        let date = new Date(item.Timestamp.seconds * 1000).toLocaleDateString()
        Alert.alert(
            'Apartment Information',
            `Apartment address: ${item.Apartment_Address}\n`
            +`Property type: ${item.Property_Type}\n`
            +`Bedrooms: ${item.Bedrooms}\n`
            +`Date time: ${date}\n`
            +`Purniture type: ${item.Furniture_Type}\n`
            +`Monthly rent price: $${item.Monthly_Rent_Price}\n`
            +`Note:${item.Note}\n`
            +`Reporter: ${item.Reporter}`
        )
    }

    function renderDataList() {
        const renderItem = ({ item }) => {
            return (
                <View style={styles.viewItem}>
                    <TouchableOpacity onPress={()=>handleViewData(item)}>
                        <Image
                            source={icons.apartment}
                            resizeMode='stretch'
                            style={{ width: 280, height: 120, borderRadius: 25 }}
                        />
                        <Text style={styles.title}>{item.Apartment_Address}</Text>
                    </TouchableOpacity>
                </View>

            )
        }
        return (
            <FlatList
                data={data}
                keyExtractor={(item, i) => `${i}`}
                renderItem={renderItem}
                contentContainerStyle={{
                    marginHorizontal: 40,
                    marginBottom: 30
                }}
            />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <BackNavigator />
            <Text style={styles.header}>Search Result</Text>
            {renderDataList()}
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
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    },
    viewItem: {
        flex: 1,
        borderRadius: 25,
        backgroundColor: '#FFFFFF',
        marginVertical: 10,
        elevation: 5,
        alignItems: 'center',
        position:'relative'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10
    },

})

export default SearchRessult;
