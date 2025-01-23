import { View, Alert } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import { useCameraPermissions } from "expo-camera";

import { Welcome } from "@/components/welcome";
import { Button } from "@/components/button";

export default function Index() {
    const [permission, requestPermission] = useCameraPermissions();
    const [permissionsGranted, setPermissionsGranted] = useState({
        camera: false,
        location: false,
        media: false,
    });

    async function requestCameraPermission() {
        try {
            const {granted} = await requestPermission()

            if(!granted){
                Alert.alert("Camera", "Você precisa habilitar o uso da câmera.")
                return false; 
            }
            return true;

        } catch (error) {
            console.log(error);
            Alert.alert("Camera", "Não foi possível utilizar a câmera.")
        }
    }

    async function requestLocationPermission() {
        try {
            const { granted } = await Location.requestForegroundPermissionsAsync();
            if (!granted) {
                Alert.alert("Permissão Necessária", "A permissão de localização é obrigatória para continuar.");
                return false;
            }
            return true;
        } catch (error) {
            console.error(error);
            Alert.alert("Location", "Não foi possível solicitar a permissão de localização.");
            return false;
        }
    }

    async function requestMediaLibraryPermission() {
        try {
            const { granted } = await MediaLibrary.requestPermissionsAsync();
            if (!granted) {
                Alert.alert("Permissão Necessária", "A permissão de armazenamento é obrigatória para continuar.");
                return false;
            }
            return true;
        } catch (error) {
            console.error(error);
            Alert.alert("Library", "Não foi possível solicitar a permissão de armazenamento.");
            return false;
        }
    }

    async function requestAllPermissions() {
        const cameraGranted = await requestCameraPermission();
        const locationGranted = await requestLocationPermission();
        const mediaGranted = await requestMediaLibraryPermission();

        if (cameraGranted && locationGranted && mediaGranted) {
            setPermissionsGranted({ camera: true, location: true, media: true });
        }
    }

    useEffect(() => {
        requestAllPermissions();
    }, []);

    const allPermissionsGranted = permissionsGranted.camera && permissionsGranted.location && permissionsGranted.media;

    return (
        <View style={{ flex: 1, padding: 40, gap: 40, justifyContent: 'center' }}>
            <Welcome />
            <Button onPress={() => allPermissionsGranted && router.push("/camera")}>
                <Button.Title>{allPermissionsGranted ? "Começar" : "Aguardando Permissões"}</Button.Title>
            </Button>
        </View>
    );
}
