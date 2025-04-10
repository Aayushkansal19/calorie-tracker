

// import { ScrollView } from 'react-native';
// import { StatusBar } from 'expo-status-bar';
// import { TouchableOpacity } from 'react-native';
// import * as Animatable from 'react-native-animatable'
// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, TextInput, Button, StyleSheet, FlatList, Alert, Platform
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const foodData = {
//   "Moong Chilla": { calories: 120, protein: 6, carbs: 10 },
//   "Roti": { calories: 90, protein: 3, carbs: 15 },
//   "Paneer (100g)": { calories: 260, protein: 18, carbs: 4 },
//   "Dal (1 bowl)": { calories: 150, protein: 10, carbs: 20 },
//   "Rice (1 cup)": { calories: 240, protein: 4, carbs: 53 },
//   "Tofu (100g)": { calories: 140, protein: 10, carbs: 5 }
// };

// const STORAGE_KEY = '@food_log';
// const CUSTOM_FOOD_KEY = '@custom_foods';

// export default function App() {
//   const [selectedFood, setSelectedFood] = useState('Moong Chilla');
//   const [quantity, setQuantity] = useState('1');
//   const [log, setLog] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   const [customFoodList, setCustomFoodList] = useState([]);
//   const [foodName, setFoodName] = useState('');
//   const [foodCalories, setFoodCalories] = useState('');
//   const [foodProtein, setFoodProtein] = useState('');
//   const [foodCarbs, setFoodCarbs] = useState('');

//   useEffect(() => {
//     loadLogFromStorage();
//     loadCustomFoods();
//   }, []);

//   const formatDate = (date) => date.toISOString().split('T')[0];

//   const loadLogFromStorage = async () => {
//     try {
//       const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
//       if (jsonValue != null) {
//         setLog(JSON.parse(jsonValue));
//       }
//     } catch (e) {
//       Alert.alert("Error", "Failed to load saved log.");
//     }
//   };

//   const saveLogToStorage = async (newLog) => {
//     try {
//       await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newLog));
//     } catch (e) {
//       Alert.alert("Error", "Failed to save log.");
//     }
//   };

//   const loadCustomFoods = async () => {
//     try {
//       const value = await AsyncStorage.getItem(CUSTOM_FOOD_KEY);
//       if (value !== null) {
//         setCustomFoodList(JSON.parse(value));
//       }
//     } catch (e) {
//       Alert.alert("Error", "Failed to load custom food list.");
//     }
//   };

//   const handleAddCustomFood = async () => {
//     if (!foodName || !foodCalories || !foodProtein || !foodCarbs) {
//       Alert.alert("Missing Info", "Please fill all fields.");
//       return;
//     }

//     const newItem = {
//       name: foodName,
//       calories: parseFloat(foodCalories),
//       protein: parseFloat(foodProtein),
//       carbs: parseFloat(foodCarbs),
//     };

//     const updatedList = [...customFoodList, newItem];
//     setCustomFoodList(updatedList);
//     await AsyncStorage.setItem(CUSTOM_FOOD_KEY, JSON.stringify(updatedList));

//     setFoodName('');
//     setFoodCalories('');
//     setFoodProtein('');
//     setFoodCarbs('');

//     Alert.alert("Saved", `${newItem.name} added to your food list!`);
//   };

//   const addToLog = () => {
//     const qty = parseFloat(quantity);
//     if (isNaN(qty) || qty <= 0) {
//       Alert.alert("Invalid Quantity", "Please enter a valid quantity.");
//       return;
//     }

//     const data = foodData[selectedFood] || customFoodList.find(f => f.name === selectedFood);
//     if (!data) {
//       Alert.alert("Error", "Food not found.");
//       return;
//     }

//     const entry = {
//       id: Date.now().toString(),
//       name: selectedFood,
//       calories: data.calories * qty,
//       protein: data.protein * qty,
//       carbs: data.carbs * qty,
//       date: formatDate(new Date())
//     };

//     const newLog = [...log, entry];
//     setLog(newLog);
//     saveLogToStorage(newLog);
//     setQuantity('1');
//   };

//   const deleteItem = (id) => {
//     const updated = log.filter(item => item.id !== id);
//     setLog(updated);
//     saveLogToStorage(updated);
//   };

//   const resetAllLogs = () => {
//     Alert.alert(
//       "Clear All Logs",
//       "Are you sure you want to delete ALL food entries?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Yes, Clear All",
//           onPress: async () => {
//             try {
//               await AsyncStorage.removeItem(STORAGE_KEY);
//               setLog([]);
//             } catch (e) {
//               Alert.alert("Error", "Failed to clear logs.");
//             }
//           }
//         }
//       ]
//     );
//   };

//   const todaysLog = log.filter(entry => entry.date === formatDate(selectedDate));
//   const totalCalories = todaysLog.reduce((sum, item) => sum + item.calories, 0);
//   const totalProtein = todaysLog.reduce((sum, item) => sum + item.protein, 0);
//   const totalCarbs = todaysLog.reduce((sum, item) => sum + item.carbs, 0);
//   const openDatePicker = () => setShowDatePicker(true);

//   // return (
//   //   <View style={styles.container}>
// //   return (
// //     <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
  
// //       <StatusBar style="dark" backgroundColor="#f5f5f5" />
// //       <Text style={styles.title}>Calorie Tracker</Text>

// //       <Animatable.View animation="fadeInUp" duration={500} style={[styles.card, { borderColor: '#a1c4fd', borderWidth: 1 }]}>
// //         <Text style={styles.summary}>
// //           📅 {formatDate(selectedDate)} | 🔥 {totalCalories} kcal | 🥩 {totalProtein}g | 🍞 {totalCarbs}g
// //         </Text>
// //       </Animatable.View>

// //       <Animatable.View animation="bounceIn" delay={400}>
// //         <Button title="📅 Pick Date" onPress={openDatePicker} />
// //       </Animatable.View>

// //       {showDatePicker && (
// //         <DateTimePicker
// //           value={selectedDate}
// //           mode="date"
// //           display={Platform.OS === 'ios' ? 'spinner' : 'default'}
// //           onChange={(event, date) => {
// //             setShowDatePicker(false);
// //             if (date) setSelectedDate(date);
// //           }}
// //         />
// //       )}

// //       {/* 🔥 ADD CUSTOM FOOD SECTION */}
// //       <View style={styles.card}>
// //         <Text style={styles.cardTitle}>🍛 Add Custom Food</Text>
// //         <TextInput style={styles.input} placeholder="Food Name" value={foodName} onChangeText={setFoodName} />
// //         <TextInput style={styles.input} placeholder="Calories" keyboardType="numeric" value={foodCalories} onChangeText={setFoodCalories} />
// //         <TextInput style={styles.input} placeholder="Protein (g)" keyboardType="numeric" value={foodProtein} onChangeText={setFoodProtein} />
// //         <TextInput style={styles.input} placeholder="Carbs (g)" keyboardType="numeric" value={foodCarbs} onChangeText={setFoodCarbs} />
// //         <TouchableOpacity style={styles.addButton} onPress={handleAddCustomFood}>
// //           <Text style={styles.addButtonText}>➕ Save Food</Text>
// //         </TouchableOpacity>
// //       </View>

// //       <Picker
// //         selectedValue={selectedFood}
// //         onValueChange={(itemValue) => setSelectedFood(itemValue)}
// //         style={styles.picker}
// //       >
// //         {[
// //           ...Object.entries(foodData).map(([key, val]) => ({ name: key, ...val })),
// //           ...customFoodList
// //         ].map((food) => (
// //           <Picker.Item label={food.name} value={food.name} key={food.name} />
// //         ))}
// //       </Picker>

// //       <TextInput
// //         style={styles.input}
// //         placeholder="Quantity"
// //         value={quantity}
// //         onChangeText={setQuantity}
// //         keyboardType="numeric"
// //       />

// //       <Animatable.View animation="pulse" duration={800} iterationCount="infinite">
// //         <TouchableOpacity style={styles.addButton} onPress={addToLog}>
// //           <Text style={styles.addButtonText}>➕ Add Food</Text>
// //         </TouchableOpacity>
// //       </Animatable.View>

// //       <FlatList
// //         data={todaysLog}
// //         keyExtractor={(item) => item.id}
// //         renderItem={({ item, index }) => (
// //           <Animatable.View animation="fadeInUp" duration={500} delay={index * 100} style={styles.card}>
// //             <View style={styles.cardHeader}>
// //               <Text style={styles.cardTitle}>{item.name}</Text>
// //               <Button title="❌" onPress={() => deleteItem(item.id)} color="#ff4d4d" />
// //             </View>
// //             <Text style={styles.cardDetail}>
// //               🔥 {item.calories} kcal | 🥩 {item.protein}g | 🍞 {item.carbs}g
// //             </Text>
// //           </Animatable.View>
// //         )}
// //         ListEmptyComponent={<Text style={styles.emptyText}>No food logged for this day</Text>}
// //       />

// //       <View style={{ marginTop: 10 }}>
// //         <TouchableOpacity style={styles.clearButton} onPress={resetAllLogs}>
// //           <Text style={styles.clearButtonText}>🗑️ Clear All Logs</Text>
// //         </TouchableOpacity>
// //       </View>
// //     {/* </View> */}
// //     </ScrollView>

// //   );

// return (
//   <View style={styles.container}>
//     <ScrollView
//       contentContainerStyle={{ paddingBottom: 20 }}
//       keyboardShouldPersistTaps="handled"
//     >
//       <StatusBar style="dark" backgroundColor="#f5f5f5" />
//       <Text style={styles.title}>Calorie Tracker</Text>

//       <Animatable.View animation="fadeInUp" duration={500} style={[styles.card, { borderColor: '#a1c4fd', borderWidth: 1 }]}>
//         <Text style={styles.summary}>
//           📅 {formatDate(selectedDate)} | 🔥 {totalCalories} kcal | 🥩 {totalProtein}g | 🍞 {totalCarbs}g
//         </Text>
//       </Animatable.View>

//       <Animatable.View animation="bounceIn" delay={400}>
//         <Button title="📅 Pick Date" onPress={openDatePicker} />
//       </Animatable.View>

//       {showDatePicker && (
//         <DateTimePicker
//           value={selectedDate}
//           mode="date"
//           display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//           onChange={(event, date) => {
//             setShowDatePicker(false);
//             if (date) setSelectedDate(date);
//           }}
//         />
//       )}

//       {/* 🔥 ADD CUSTOM FOOD SECTION */}
//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>🍛 Add Custom Food</Text>
//         <TextInput style={styles.input} placeholder="Food Name" value={foodName} onChangeText={setFoodName} />
//         <TextInput style={styles.input} placeholder="Calories" keyboardType="numeric" value={foodCalories} onChangeText={setFoodCalories} />
//         <TextInput style={styles.input} placeholder="Protein (g)" keyboardType="numeric" value={foodProtein} onChangeText={setFoodProtein} />
//         <TextInput style={styles.input} placeholder="Carbs (g)" keyboardType="numeric" value={foodCarbs} onChangeText={setFoodCarbs} />
//         <TouchableOpacity style={styles.addButton} onPress={handleAddCustomFood}>
//           <Text style={styles.addButtonText}>➕ Save Food</Text>
//         </TouchableOpacity>
//       </View>

//       <Picker
//         selectedValue={selectedFood}
//         onValueChange={(itemValue) => setSelectedFood(itemValue)}
//         style={styles.picker}
//       >
//         {[
//           ...Object.entries(foodData).map(([key, val]) => ({ name: key, ...val })),
//           ...customFoodList
//         ].map((food) => (
//           <Picker.Item label={food.name} value={food.name} key={food.name} />
//         ))}
//       </Picker>

//       <TextInput
//         style={styles.input}
//         placeholder="Quantity"
//         value={quantity}
//         onChangeText={setQuantity}
//         keyboardType="numeric"
//       />

//       <Animatable.View animation="pulse" duration={800} iterationCount="infinite">
//         <TouchableOpacity style={styles.addButton} onPress={addToLog}>
//           <Text style={styles.addButtonText}>➕ Add Food</Text>
//         </TouchableOpacity>
//       </Animatable.View>

//       <TouchableOpacity style={styles.clearButton} onPress={resetAllLogs}>
//         <Text style={styles.clearButtonText}>🗑️ Clear All Logs</Text>
//       </TouchableOpacity>
//     </ScrollView>

//     {/* FlatList OUTSIDE ScrollView */}
//     <FlatList
//       data={todaysLog}
//       keyExtractor={(item) => item.id}
//       contentContainerStyle={{ paddingBottom: 100 }}
//       renderItem={({ item, index }) => (
//         <Animatable.View animation="fadeInUp" duration={500} delay={index * 100} style={styles.card}>
//           <View style={styles.cardHeader}>
//             <Text style={styles.cardTitle}>{item.name}</Text>
//             <Button title="❌" onPress={() => deleteItem(item.id)} color="#ff4d4d" />
//           </View>
//           <Text style={styles.cardDetail}>
//             🔥 {item.calories} kcal | 🥩 {item.protein}g | 🍞 {item.carbs}g
//           </Text>
//         </Animatable.View>
//       )}
//       ListEmptyComponent={<Text style={styles.emptyText}>No food logged for this day</Text>}
//     />
//   </View>
// );

// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     marginTop: 40,
//     backgroundColor: '#fef9f9',
//   },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
//   summary: { fontSize: 16, fontWeight: '500', marginBottom: 10, color: 'green' },
//   picker: { height: 50, marginBottom: 15 },
//   input: { height: 40, borderColor: 'gray', borderWidth: 1, paddingHorizontal: 10, marginBottom: 10 },
//   logItem: { fontSize: 16, flex: 1 },
//   logItemRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 5,
//     borderBottomColor: '#ccc',
//     borderBottomWidth: 1
//   },
//   emptyText: { fontStyle: 'italic', color: 'gray', marginTop: 10 },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 15,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   cardDetail: {
//     fontSize: 14,
//     color: '#666',
//   },
//   addButton: {
//     backgroundColor: '#48c774',
//     paddingVertical: 12,
//     borderRadius: 12,
//     marginVertical: 10,
//     alignItems: 'center',
//     elevation: 4,
//   },
//   addButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   clearButton: {
//     backgroundColor: '#ff4d4d',
//     paddingVertical: 10,
//     borderRadius: 12,
//     marginTop: 10,
//     alignItems: 'center',
//     elevation: 4,
//   },
//   clearButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   summaryBar: {
//     backgroundColor: '#ffffff',
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2
//   }
// });




import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import AddFoodScreen from './screens/AddFoodScreen';
import HistoryScreen from './screens/HistoryScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Add Food') {
              iconName = 'add-circle';
            } else if (route.name === 'History') {
              iconName = 'time';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#48c774',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Add Food" component={AddFoodScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
