import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function scanner() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="qr-code-outline" size={20} color="#666" />
        <Text style={styles.text}>Calibration QR Scanner</Text>
      </View>

      <View style={styles.card}>
        <Ionicons name="qr-code-outline" size={20} color="#666" />
        <Text style={styles.text}>MSA QR Scanner</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '80%',
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingLeft: 40,
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    flexDirection: 'row',
    gap: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
