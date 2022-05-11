import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, Pressable, Keyboard, FlatList, Platform, StatusBar, Dimensions, TextInput, Alert, Picker, ScrollView, Button } from 'react-native';
import { useNavigation } from "@react-navigation/native"
import * as firebase from 'firebase'
import '@firebase/firestore'
import { date } from 'yup/lib/locale';
import { icons } from '../constants';
import BackNavigator from './BackNavigator'

const ListData = () => {
    const [data, setdata] = useState([]);
    const navigation = useNavigation()

    useEffect(() => {
        handleFetchData()
        const willFocusSubscription = navigation.addListener('focus', () => {
            handleFetchData();
        });
    
        return willFocusSubscription;
    }, []);
    const handleFetchData = () => {
        firebase.firestore()
            .collection('apartments')
            .doc(firebase.auth().currentUser.uid)
            .collection('userApm')
            .get()
            .then((res) => {
                let items = res.docs.map(item => {
                    const obj = item.data();
                    const objID = item.id;
                    return { objID, ...obj }
                })
                setdata(items)
            })
    }
    // console.log(data)
    const handleDeleteItem = (id)=>{
        firebase.firestore()
        .collection('apartments')
        .doc(firebase.auth().currentUser.uid)
        .collection('userApm')
        .doc(id)
        .delete()
        .then(res=>{
            // Alert.alert('ok')
            handleFetchData()
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const confirmDelete = (id)=>{
        Alert.alert(
            'Delete',
            'Delete this apartment ?',
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "OK", onPress: () => handleDeleteItem(id) }
            ]
        )
    }

    function renderDataList() {
        const renderItem = ({ item }) => {
            let img 
            if(item.ImageUri){
                img = { uri: item.ImageUri}
            }else{
                img = icons.apartment
            }
            
            return (
                <View style={styles.viewItem}>
                    <Pressable style={styles.trashCan} onPress={()=>confirmDelete(item.objID)}>
                        <View style={styles.circle}>
                        <Image 
                        source={icons.closeX}
                        resizeMode='contain'
                        style={{width:15, height:15, tintColor:'#152D35' }}
                        />
                        </View>
                        
                        </Pressable>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('DetailData', { item })}>
                        <Image
                            source={img}
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
            <Text style={styles.header}>My Apartment</Text>
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
    trashCan:{
        width:30,
        height:55,
        top:0,
        right:20,
        zIndex:3,
        position:'absolute',
        backgroundColor:'#FE8F8F',
        paddingTop:28,
        paddingBottom:5,
        alignItems:'center',
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
    },
    circle:{
        backgroundColor:'#CDF0EA',
        padding:4,
        borderRadius:25
    }
})
export default ListData;
