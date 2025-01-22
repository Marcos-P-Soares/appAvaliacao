import { View } from "react-native"
import {router} from "expo-router"


import {
    useFonts,
    Rubik_600SemiBold,
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_700Bold
} from "@expo-google-fonts/rubik"
// import {Welcome} from "@/components/welcome"
// import {Button} from "@/components/button"
// import { Steps } from "@/components/steps"

export default function Index(){
    return(
        <View style = {{flex:1,padding:40, gap:40}}>
            {/* <Welcome/>
            <Steps/>
            <Button onPress={() => router.navigate("/home")}>
                <Button.Title>Começar</Button.Title>
            </Button> */}
        </View>
    )
}