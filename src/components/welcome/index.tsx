import {Image, Text, View} from "react-native"

import {s} from "./styles"


export function Welcome (){
    return (
        <View>
            <Image source={require("@/assets/icon-sem-fundo.png")} style = { s.logo} />
            <Text style = {s.title}>Boas vindas ao Photo Studio!</Text>
            <Text style = {s.subtitle}>
                Salve suas fotos com detalhes de localização! Registrando detalhes de seus locais favoritos.
            </Text>
            
        </View>
    )
}