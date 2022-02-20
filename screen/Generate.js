import { Box, Button, Center, Flex, Icon, Input, useClipboard, useToast } from "native-base";
import { useState } from "react";
import { GeneratePass } from "../functions/generatePass";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Generate =  () => {
    const [pass,setPass] = useState('');
    const {onCopy} = useClipboard();
    const toast = useToast();

    return(
        <Center w="100%" style={{borderTopWidth:1, borderTopColor:"#e5e7eb", paddingVertical:5}} >
            <Box w="90%" >
                <Flex direction="row">
                    <Input w="65%" h={10} isDisabled={true} value={pass}
                        InputRightElement={
                            <Icon
                                as={<FontAwesome5 name="copy" />} 
                                size={6}
                                mx="2" 
                                _color={{color:"black"}}
                                onPress={()=> onCopy(pass).then(()=>toast.show({
                                    title: "Copied to the clipboard",
                                    status: "success"
                                })).catch(()=>toast.show({
                                    title: "Error when copying to clipboard",
                                    status: "error"
                                }))} 
                            />
                        }
                    />
                    <Button w="25%" marginLeft="10%" size="lg" onPress={()=>setPass(GeneratePass())}>Generate</Button>
                </Flex>
            </Box>
        </Center>
    );
}

export default Generate