import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { IconRepeat, IconCircleFilled, IconPhoto } from "@tabler/icons-react-native";

import { Button } from "@/components/button";

export default function App() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing}>
                <View style={styles.buttonContainer}>
                    <Button style={styles.button} onPress={toggleCameraFacing}>
                        <Button.Icon icon={IconRepeat} />
                    </Button>
                    <Button style={styles.button}>
                        <Button.Icon icon={IconCircleFilled} />
                    </Button>
                    <Button style={styles.button}>
                        <Button.Icon icon={IconPhoto} />
                    </Button>
                </View>
            </CameraView>
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
        bottom: 32, // Posiciona na parte inferior
        left: 32,
        right: 32,
        flexDirection: "row",
        justifyContent: "space-between", // Espaça igualmente os botões
        alignItems: "center",
    },
    button: {
        width: 70,
        height: 70,
        borderRadius: 30,
    },
});
