import { Divider, Link, ScrollView, Text } from "native-base";
import { StyleSheet } from "react-native";
import Animated, { SlideInLeft, SlideOutRight } from "react-native-reanimated";

const About = ( ) => {
    return(
        <ScrollView w="100%" h="80" >
            <Animated.View entering={SlideInLeft} exiting={SlideOutRight}>
                <Text style={style.titleAbout}>PassWallet</Text>
                <Text style={style.margenParrafo}>PassWallet is an application created with the purpose of storing in a secure and centralized way the passwords of the online accounts that you can have in different websites and more.</Text>
                <Text style={style.margenParrafo}>The passwords are stored in Firebase with AES encryption from the client so it cannot be seen by any other user.</Text>
                <Text style={style.margenParrafo}>The account cannot be recovered and the information cannot be decrypted without the login password.</Text>
                <Text style={style.margenParrafo}>The password can be changed as long as you have the login password.</Text>
                <Text style={style.margenParrafo}>All information can be deleted with the login password.</Text>
                <Text style={style.margenParrafo}>The application includes a 12-digit random password generator that includes both lowercase and uppercase alphanumeric characters, numbers and symbols.</Text>
                <Text style={style.margenParrafo}>The stored information can be modified and not all fields are mandatory.</Text>
                <Text style={style.margenParrafo}>Author: Marco Velasquez Figarella</Text>
                <Link href="https://github.com/Marco90v" isExternal style={style.margenParrafo}>Github: https://github.com/Marco90v</Link>
                <Divider />
                <Text style={style.titleAbout}>PassWallet</Text>
                <Text style={style.margenParrafo}>PassWallet es una aplicación crea con la finalidad de almacenar de manera segura y centralizada las contraseñas de las cuentas online que se pueden tener en diferentes sitios webs y más.</Text>
                <Text style={style.margenParrafo}>Las contraseñas son almacenadas en Firebase con el cifrado AES desde el cliente por lo que no podrá ser visto por ningún otro usuario.</Text>
                <Text style={style.margenParrafo}>La cuenta no puede ser recuperada y la información no puede ser descifrada sin la contraseña de inicio de sesión.</Text>
                <Text style={style.margenParrafo}>La contraseña puede ser modificada siempre que se tenga la contraseña de inicio de sesión.</Text>
                <Text style={style.margenParrafo}>Se puede eliminar toda la información con la contraseña de inicio de sesión.</Text>
                <Text style={style.margenParrafo}>La aplicación incluye un generador de contraseñas aleatorias de 12 cifras que incluyen caracteres alfanúmeros tanto minúsculas como mayúsculas, números y símbolos.</Text>
                <Text style={style.margenParrafo}>La información almacenada puede ser modificada y no todos los campos son obligatorios.</Text>
                <Text style={style.margenParrafo}>Autor: Marco Velasquez Figarella</Text>
                <Link href="https://github.com/Marco90v" isExternal style={style.margenParrafo}>Github: https://github.com/Marco90v</Link>
            </Animated.View>
        </ScrollView >
    )
}

const style = StyleSheet.create({
   margenParrafo:{
       width:"90%",
       marginVertical:"1%",
       marginHorizontal:"5%",
   },
   titleAbout:{
       textAlign:"center",
       marginVertical:"2%",
       fontSize:20,
       fontWeight:"bold"
   }
});

export default About;