import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = async () => {
    try {
        const response = await axios.post('http://localhost:3000/login', { email, password });
        await AsyncStorage.setItem('token', response.data.token); // Αποθήκευση Token
        Alert.alert('Επιτυχία', 'Συνδεθήκατε!');
    } catch (error) {
        Alert.alert('Σφάλμα', 'Λανθασμένα στοιχεία');
    }
};
    
    return (
    <View>
        <TextInput placeholder="Email" onChangeText={setEmail} />
        <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
        <Button title="Login" onPress={handleLogin} />
    </View>
);
}