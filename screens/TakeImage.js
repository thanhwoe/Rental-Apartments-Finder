import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import BackNavigator from './BackNavigator';
import { useNavigation, useRoute } from "@react-navigation/native"

const TakeImage = () => {
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [image, setImage] = useState(null);
    const navigation = useNavigation()

    useEffect(() => {
        (async () => {
          const cameraStatus = await Camera.requestPermissionsAsync();
          setHasCameraPermission(cameraStatus.status === 'granted');
    
          const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
          setHasGalleryPermission(galleryStatus.status === 'granted');    
        })();
      }, []);

    const takePicture = async () => {
        if (camera) {
          const data = await camera.takePictureAsync(null);
          setImage(data.uri);
        }
    }
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1,1],
          quality: 1,
        });
        console.log(result);
    
        if (!result.cancelled) {
          setImage(result.uri);
        }
    };
    const handleSaveImage = (image)=>{
        navigation.navigate('Home', { image })
    }
    if (hasCameraPermission === null || hasGalleryPermission === false) {
        return <View />;
      }
      if (hasCameraPermission === false || hasGalleryPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={{ flex: 1 }}>
            <BackNavigator/>
      <View style={styles.cameraContainer}>
        <Camera
          ref={ref => setCamera(ref)}
          style={styles.fixedRatio}
          type={Camera.Constants.Type.back}
          ratio={'1:1'} />
      </View>

      
      <Button title="Take Picture" onPress={() => takePicture()} />
      <Button title="Pick Image From Gallery" onPress={() => pickImage()} />
      <Button title="Save" onPress={() =>handleSaveImage(image) } />
      {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
    </View>
    );
}
const styles = StyleSheet.create({
    cameraContainer: {
      flex: 1,
      flexDirection: 'row'
    },
    fixedRatio: {
      flex: 1,
      aspectRatio: 1
    }
  
  })
export default TakeImage;
