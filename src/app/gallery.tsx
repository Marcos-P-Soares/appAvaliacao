import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Image, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Gallery() {
    const [photos, setPhotos] = useState<any[]>([]);

    // Função para carregar as fotos salvas no AsyncStorage
    async function loadPhotos() {
        try {
            const storedData = await AsyncStorage.getItem('photoLocations');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                setPhotos(parsedData);
            }
        } catch (error) {
            console.error("Erro ao carregar fotos:", error);
        }
    }

    useEffect(() => {
        loadPhotos();
    }, []);

    const renderPhotoItem = ({ item }: { item: any }) => (
        <View style={styles.photoContainer}>
            <Image source={{ uri: item.uri }} style={styles.photo} />
            <Text style={styles.locationText}>
                Local: {item.location.name || "Localização não disponível"}
            </Text>
            <Text style={styles.locationText}>
                Latitude: {item.location.latitude}, Longitude: {item.location.longitude}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Galeria</Text>
            {photos.length > 0 ? (
                <FlatList
                    data={photos}
                    renderItem={renderPhotoItem}
                    keyExtractor={(item, index) => index.toString()} // Garante keys únicas para a lista
                />
            ) : (
                <Text style={styles.emptyText}>Nenhuma foto disponível</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: 16,
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    photoContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    photo: {
        width: 300,
        height: 300,
        borderRadius: 10,
        marginBottom: 8,
    },
    locationText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    emptyText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
});
