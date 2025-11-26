import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import QRCode from "react-native-qrcode-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userDetail } from "../api/auth";

export default function QRCodeScreen() {
    const [qrCode, setQrCode] = useState<string>()
    const [loading, setLoading] = useState(true)

    const QRCodetotp = async () => {
        const userId = await AsyncStorage.getItem('user_id')
        try {
            const token = await AsyncStorage.getItem('access_token')
            if (!token) {
                throw new Error("không có token")
            }
            const res = await userDetail(String(userId))
            
            const totp = res.data?.data?.totp_qr_code
            setQrCode(totp)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

    }

    useEffect(() =>{
        QRCodetotp()
    }, []);
    if(loading){
        return <ActivityIndicator size='large' style={{marginTop: 50}}/>
    }
    return (
        <View style={{margin: 60}}>
            {
                qrCode ?(
                    <QRCode value={qrCode} size={250}/>
                ):(
                    <Text>Không tìm thấy mã QR</Text>
                )
            }
        </View>
    )
}
