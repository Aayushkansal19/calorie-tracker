import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, Button, Alert, Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@food_log';

export default function HistoryScreen() {
  const [log, setLog] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadLogs();
    }, [])
  );
  

  const formatDate = (date) => date.toISOString().split('T')[0];

  const loadLogs = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value !== null) {
        setLog(JSON.parse(value));
      }
    } catch (e) {
      Alert.alert("Error", "Failed to load saved logs.");
    }
  };

  const deleteItem = (id) => {
    const updated = log.filter(item => item.id !== id);
    setLog(updated);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const filteredLog = log.filter(entry => entry.date === formatDate(selectedDate));
  const totalCalories = filteredLog.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = filteredLog.reduce((sum, item) => sum + item.protein, 0);
  const totalCarbs = filteredLog.reduce((sum, item) => sum + item.carbs, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Pick a Date</Text>
      <Button title="Open Calendar" onPress={() => setShowPicker(true)} />

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      <Text style={styles.subtitle}>Logs for: {formatDate(selectedDate)}</Text>
      <Text style={styles.summary}>
        🔥 {totalCalories} kcal | 🥩 {totalProtein}g | 🍞 {totalCarbs}g
      </Text>

      <FlatList
        data={filteredLog}
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
        ListEmptyComponent={<Text style={styles.emptyText}>No logs for this date</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#fefefe' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginTop: 10, marginBottom: 5 },
  summary: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 10 },
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
