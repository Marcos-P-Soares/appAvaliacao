import { CameraView, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useState, useRef } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

import { IconRepeat, IconCircleFilled, IconPhoto } from "@tabler/icons-react-native";

import { Button } from "@/components/button";

export default function App() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const cameraRef = useRef<any>(null);

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    async function takePhoto() {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            setPhotoUri(photo.uri);
        }
    }

    async function savePhoto() {
        if (photoUri) {
            try {
                await MediaLibrary.createAssetAsync(photoUri); 
            } catch (error) {
                console.error("Erro ao salvar a foto:", error);
            }
            setPhotoUri(null); // Volta para o modo de câmera
        }
    }

    function discardPhoto() {
        setPhotoUri(null); // Descarta a foto e volta para a câmera
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
                        <Button style={styles.button}>
                            <Button.Icon icon={IconPhoto} />
                        </Button>
                    </View>
                </CameraView>
            ) : (
                <View style={styles.previewContainer}>
                    <Image source={{ uri: photoUri }} style={styles.preview} />
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
