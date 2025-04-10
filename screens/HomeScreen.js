// import { colors, spacing, radius } from '../constants/theme';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, FlatList, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const STORAGE_KEY = '@food_log';
const CUSTOM_FOOD_KEY = '@custom_foods';

const foodData = {
  "Moong Chilla": { calories: 120, protein: 6, carbs: 10 },
  "Roti": { calories: 90, protein: 3, carbs: 15 },
  "Paneer (100g)": { calories: 260, protein: 18, carbs: 4 },
  "Dal (1 bowl)": { calories: 150, protein: 10, carbs: 20 },
  "Rice (1 cup)": { calories: 240, protein: 4, carbs: 53 },
  "Tofu (100g)": { calories: 140, protein: 10, carbs: 5 }
};

export default function HomeScreen() {
  const [selectedFood, setSelectedFood] = useState('Moong Chilla');
  const [quantity, setQuantity] = useState('1');
  const [log, setLog] = useState([]);
  const [customFoodList, setCustomFoodList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadCustomFoods();
    }, [])
  );
  

  const formatDate = (date) => date.toISOString().split('T')[0];

  const loadLogFromStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setLog(JSON.parse(jsonValue));
      }
    } catch (e) {
      Alert.alert("Error", "Failed to load saved log.");
    }
  };

  const loadCustomFoods = async () => {
    try {
      const value = await AsyncStorage.getItem(CUSTOM_FOOD_KEY);
      if (value !== null) {
        setCustomFoodList(JSON.parse(value));
      }
    } catch (e) {
      Alert.alert("Error", "Failed to load custom food list.");
    }
  };

  const saveLogToStorage = async (newLog) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newLog));
    } catch (e) {
      Alert.alert("Error", "Failed to save log.");
    }
  };

  const addToLog = () => {
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert("Invalid Quantity", "Please enter a valid quantity.");
      return;
    }

    const data = foodData[selectedFood] || customFoodList.find(f => f.name === selectedFood);
    if (!data) {
      Alert.alert("Error", "Food not found.");
      return;
    }

    const now = new Date();
    const entry = {
      id: now.getTime().toString(),
      name: selectedFood,
      calories: data.calories * qty,
      protein: data.protein * qty,
      carbs: data.carbs * qty,
      date: formatDate(now),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    

    const newLog = [...log, entry];
    setLog(newLog);
    saveLogToStorage(newLog);
    setQuantity('1');
  };

  const deleteItem = (id) => {
    const updated = log.filter(item => item.id !== id);
    setLog(updated);
    saveLogToStorage(updated);
  };
  const resetAllLogs = () => {
    Alert.alert(
      "Clear All Logs",
      "Are you sure you want to delete ALL food entries?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Clear All",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(STORAGE_KEY);
              setLog([]);
            } catch (e) {
              Alert.alert("Error", "Failed to clear logs.");
            }
          }
        }
      ]
    );
  };
  

  const todaysLog = log.filter(entry => entry.date === formatDate(new Date()));
  const totalCalories = todaysLog.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = todaysLog.reduce((sum, item) => sum + item.protein, 0);
  const totalCarbs = todaysLog.reduce((sum, item) => sum + item.carbs, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🥗 Today's Summary</Text>
      <Text style={styles.summary}>
        🔥 {totalCalories} kcal | 🥩 {totalProtein}g | 🍞 {totalCarbs}g
      </Text>

      <Text style={styles.sectionTitle}>Select Food:</Text>
      <Picker
        selectedValue={selectedFood}
        onValueChange={(itemValue) => setSelectedFood(itemValue)}
        style={styles.picker}
      >
        {[
          ...Object.entries(foodData).map(([key, val]) => ({ name: key, ...val })),
          ...customFoodList
        ].map((food) => (
          <Picker.Item label={food.name} value={food.name} key={food.name} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      <View style={styles.buttonWrapper}>
        <Button title="Add Food" onPress={addToLog} color="#48c774" />
      </View>

      <Text style={styles.sectionTitle}>📋 Today's Log</Text>
      <FlatList
        data={todaysLog}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Button title="❌" onPress={() => deleteItem(item.id)} color="#ff4d4d" />
            </View>
            <Text style={styles.cardDetail}>
  ⏰ {item.time} | 🔥 {item.calories} kcal | 🥩 {item.protein}g | 🍞 {item.carbs}g
</Text>

          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No food logged yet</Text>}
    />
    <View style={{ marginTop: 10 }}>
  <Button title="🗑️ Clear All Logs" onPress={resetAllLogs} color="#d9534f" />
</View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#fefefe' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 5 },
  summary: { fontSize: 16, marginBottom: 20, color: '#333' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 10, marginBottom: 5 },
  picker: { height: 50, marginBottom: 15 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, paddingHorizontal: 10, marginBottom: 10, borderRadius: 8 },
  buttonWrapper: { marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDetail: {
    fontSize: 14,
    color: '#555',
  },
  emptyText: { fontStyle: 'italic', color: 'gray', marginTop: 10 }
});
