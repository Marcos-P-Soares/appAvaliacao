import { CameraView, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useRef } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { router } from "expo-router";

import { IconRepeat, IconCircleFilled, IconPhoto } from "@tabler/icons-react-native";

import { Button } from "@/components/button";

export default function App() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [location, setLocation] = useState<any | null>(null); // Localização em texto
    const cameraRef = useRef<any>(null);

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    async function takePhoto() {
        try {
            if (cameraRef.current) {
                // Captura a foto
                const photo = await cameraRef.current.takePictureAsync();

                // Obtém a localização atual do dispositivo
                const currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

                // Realiza a geocodificação reversa para obter o nome do local
                const geocodedLocation = await Location.reverseGeocodeAsync({
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                });

                // Processa o endereço (o primeiro resultado geralmente é o mais preciso)
                const formattedLocation = geocodedLocation[0];
                const locationString = `${formattedLocation.city}, ${formattedLocation.region}, ${formattedLocation.country}`;

                setPhotoUri(photo.uri);
                setLocation({
                    coords: currentLocation.coords,
                    name: locationString,
                });

                console.log("Foto capturada:", photo.uri);
                console.log("Localização capturada:", currentLocation.coords);
                console.log("Endereço traduzido:", locationString);
            }
        } catch (error) {
            console.error("Erro ao capturar a foto ou localização:", error);
        }
    }

    async function savePhoto() {
        if (photoUri && location) {
            try {
                // Salva a foto na galeria
                const asset = await MediaLibrary.createAssetAsync(photoUri);
                console.log("Foto salva na galeria:", asset.uri);

                // Associa a URI da imagem com a localização
                const imageLocationData = {
                    uri: asset.uri,
                    location: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        name: location.name, // Nome traduzido do local
                    },
                };

                // Recupera o registro atual do AsyncStorage
                const existingData = await AsyncStorage.getItem('photoLocations');
                const parsedData = existingData ? JSON.parse(existingData) : [];

                // Adiciona o novo registro
                const updatedData = [...parsedData, imageLocationData];

                // Salva os dados atualizados
                await AsyncStorage.setItem('photoLocations', JSON.stringify(updatedData));

                console.log("Foto e localização associadas salvas no AsyncStorage!");
            } catch (error) {
                console.error("Erro ao salvar a foto ou localização:", error);
            }
            setPhotoUri(null); // Volta para o modo de câmera
            setLocation(null); // Reseta a localização
        }
    }

    function discardPhoto() {
        setPhotoUri(null); // Descarta a foto
        setLocation(null); // Reseta a localização
    }

    return (
        <View style={styles.container}>
            {!photoUri ? (
                <CameraView
                    style={styles.camera}
                    facing={facing}
                    ref={cameraRef} // Define a referência para a câmera
                >
                    <View style={styles.buttonContainer}>
                        <Button style={styles.button} onPress={toggleCameraFacing}>
                            <Button.Icon icon={IconRepeat} />
                        </Button>
                        <Button style={styles.button} onPress={takePhoto}>
                            <Button.Icon icon={IconCircleFilled} />
                        </Button>
                        <Button style={styles.button} onPress={() => router.push("/gallery")}>
                            <Button.Icon icon={IconPhoto} />
                        </Button>
                    </View>
                </CameraView>
            ) : (
                <View style={styles.previewContainer}>
                    <Image source={{ uri: photoUri }} style={styles.preview} />
                    <Text style={styles.locationText}>
                        Localização:
                        {location
                            ? ` ${location.name} \nLat: ${location.coords.latitude}, Lng: ${location.coords.longitude}`
                            : " Não disponível"}
                    </Text>
                    <View style={styles.previewButtons}>
                        <Button style={styles.previewButton} onPress={savePhoto}>
                            <Text style={styles.text}>Salvar</Text>
                        </Button>
                        <Button style={styles.previewButton} onPress={discardPhoto}>
                            <Text style={styles.text}>Descartar</Text>
                        </Button>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        position: "absolute",
        bottom: 32,
        left: 32,
        right: 32,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    button: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    previewContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
    },
    preview: {
        width: "90%",
        height: "70%",
        borderRadius: 10,
    },
    locationText: {
        color: "white",
        fontSize: 16,
        marginVertical: 10,
    },
    previewButtons: {
        flexDirection: "row",
        marginTop: 20,
        justifyContent: "space-between",
        width: "60%",
    },
    previewButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: "white",
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
    },
});
