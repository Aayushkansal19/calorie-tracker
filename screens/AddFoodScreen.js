import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CUSTOM_FOOD_KEY = '@custom_foods';

export default function AddFoodScreen() {
  const [customFoodList, setCustomFoodList] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [foodCalories, setFoodCalories] = useState('');
  const [foodProtein, setFoodProtein] = useState('');
  const [foodCarbs, setFoodCarbs] = useState('');

  useEffect(() => {
    loadCustomFoods();
  }, []);

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

  const handleAddCustomFood = async () => {
    if (!foodName || !foodCalories || !foodProtein || !foodCarbs) {
      Alert.alert("Missing Info", "Please fill all fields.");
      return;
    }

    const newItem = {
      name: foodName,
      calories: parseFloat(foodCalories),
      protein: parseFloat(foodProtein),
      carbs: parseFloat(foodCarbs),
    };

    const updatedList = [...customFoodList, newItem];
    setCustomFoodList(updatedList);
    await AsyncStorage.setItem(CUSTOM_FOOD_KEY, JSON.stringify(updatedList));

    setFoodName('');
    setFoodCalories('');
    setFoodProtein('');
    setFoodCarbs('');

    Alert.alert("Saved", `${newItem.name} added to your food list!`);
  };

  const deleteCustomFood = async (nameToDelete) => {
    const updatedList = customFoodList.filter(item => item.name !== nameToDelete);
    setCustomFoodList(updatedList);
    await AsyncStorage.setItem(CUSTOM_FOOD_KEY, JSON.stringify(updatedList));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>➕ Add Custom Food</Text>

      <TextInput
        style={styles.input}
        placeholder="Food Name"
        value={foodName}
        onChangeText={setFoodName}
      />
      <TextInput
        style={styles.input}
        placeholder="Calories"
        keyboardType="numeric"
        value={foodCalories}
        onChangeText={setFoodCalories}
      />
      <TextInput
        style={styles.input}
        placeholder="Protein (g)"
        keyboardType="numeric"
        value={foodProtein}
        onChangeText={setFoodProtein}
      />
      <TextInput
        style={styles.input}
        placeholder="Carbs (g)"
        keyboardType="numeric"
        value={foodCarbs}
        onChangeText={setFoodCarbs}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddCustomFood}>
        <Text style={styles.addButtonText}>Save Food</Text>
      </TouchableOpacity>

      <Text style={styles.listTitle}>🗑️ Your Custom Foods</Text>

      {customFoodList.length === 0 ? (
        <Text style={{ color: '#999', marginTop: 10 }}>No custom food items yet.</Text>
      ) : (
        customFoodList.map((food, index) => (
          <View key={index} style={styles.foodItem}>
            <Text style={{ flex: 1 }}>{food.name}</Text>
            <Button title="❌" color="crimson" onPress={() => deleteCustomFood(food.name)} />
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fefefe',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#48c774',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 10,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  }
});
