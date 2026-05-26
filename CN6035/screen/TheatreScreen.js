import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TheatresScreen() {
    const [theatres, setTheatres] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    getTheatres();
    }, []);

    const getTheatres = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get('http://192.168.2.5:3000/theatres', {
        headers: { Authorization: `Bearer ${token}` } // [cite: 40]
});
    setTheatres(response.data);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
};

    if (loading) return <ActivityIndicator size="large" />;

    return (
    <View style={{ flex: 1, padding: 20 }}>
        <FlatList
        data={theatres}
        keyExtractor={(item) => item.theatre_id.toString()}
        renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
            <Text>{item.location}</Text>
        </View>
        )}
    />
    </View>
);
}