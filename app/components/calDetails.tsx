import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import api from '@/app/api/api';
import { Ionicons } from '@expo/vector-icons';

export default function CalDetails() {
  const { equipmentId } = useLocalSearchParams();
  const [equipmentDetails, setEquipmentDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEquipmentDetails = async () => {
      if (!equipmentId) return;
      const parsedEquipmentId = Array.isArray(equipmentId)
        ? equipmentId[0]
        : equipmentId;
      const data = await api.EquipmentId(parsedEquipmentId as string);
      if (data) {
        setEquipmentDetails(data);
      }

      setLoading(false);
    };
    fetchEquipmentDetails();
  }, [equipmentId]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  if (!equipmentDetails) {
    return <Text style={styles.errorText}>No equipment details found</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <ScrollView>
        <Text style={styles.title}>Equipment Details</Text>
        {equipmentDetails.map((equipment, index) => (
          <View key={index}>
            <View style={styles.card}>
              <Ionicons
                name="code"
                size={28}
                color="black"
                style={{ paddingRight: 20 }}
              />
              <Text style={styles.label}>EquipmentCode:</Text>
              <Text style={styles.value}>{equipment.EquipmentCode}</Text>
            </View>

            <View style={styles.card}>
              <Ionicons
                name="apps"
                size={28}
                color="black"
                style={{ paddingRight: 20 }}
              />
              <Text style={styles.label}>EquipmentDesc:</Text>
              <Text style={styles.value}>{equipment.EquipmentDesc}</Text>
            </View>

            <View style={styles.card}>
              <Ionicons
                name="cube"
                size={28}
                color="black"
                style={{ paddingRight: 20 }}
              />
              <Text style={styles.label}>LastCalibrationType:</Text>
              <Text style={styles.value}>{equipment.LastCalibrationType}</Text>
            </View>

            <View style={styles.card}>
              <Ionicons
                name="stats-chart"
                size={28}
                color="black"
                style={{ paddingRight: 20 }}
              />
              <Text style={styles.label}>CalibrationStatus:</Text>
              <Text style={styles.value}>{equipment.CalibrationStatus}</Text>
            </View>

            <View style={styles.card}>
              <Ionicons
                name="location"
                size={28}
                color="black"
                style={{ paddingRight: 20 }}
              />
              <Text style={styles.label}>LastCalibrationLocation:</Text>
              <Text style={styles.value}>
                {equipment.LastCalibrationLocation}
              </Text>
            </View>

            <View style={styles.card}>
              <Ionicons
                name="calendar"
                size={28}
                color="black"
                style={{ paddingRight: 20 }}
              />
              <Text style={styles.label}>LastCalibrationDate:</Text>
              <Text style={styles.value}>{equipment.LastCalibrationDate}</Text>
            </View>

            <View style={styles.card}>
              <Ionicons
                name="disc"
                size={28}
                color="black"
                style={{ paddingRight: 20 }}
              />
              <Text style={styles.label}>NextCalibrationDate:</Text>
              <Text style={styles.value}>{equipment.NextSchedule}</Text>
            </View>

            <View style={styles.card}>
              <Ionicons
                name="construct"
                size={28}
                color="black"
                style={{ paddingRight: 20 }}
              />
              <Text style={styles.label}>EquipmentMake:</Text>
              <Text style={styles.value}>{equipment.EquipmentMake}</Text>
            </View>

            <View style={styles.card}>
              <Ionicons
                name="pin"
                size={28}
                color="black"
                style={{ paddingRight: 20 }}
              />
              <Text style={styles.label}>UsageLocation:</Text>
              <Text style={styles.value}>{equipment.UsageLocation}</Text>
            </View>

            <View style={styles.card}>
              <Ionicons
                name="accessibility-outline"
                size={28}
                color="black"
                style={{ paddingRight: 20 }}
              />
              <Text style={styles.label}>Custodian:</Text>
              <Text style={styles.value}>{equipment.Custodian}</Text>
            </View>

            <View style={styles.card}>
              <Ionicons
                name="calendar"
                size={28}
                color="black"
                style={{ paddingRight: 20 }}
              />
              <Text style={styles.label}>PurchaseDate:</Text>
              <Text style={styles.value}>{equipment.PurchaseDate}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loader: {
    marginTop: 50,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 40,
  },
  card: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  label: { fontSize: 16, fontWeight: 'bold', paddingRight: 4 },
  value: { fontSize: 16, color: '#333' },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    fontSize: 18,
    marginLeft: 5,
  },
});
