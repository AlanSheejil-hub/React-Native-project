import api from '@/app/api/api';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';

export default function abstract() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const apiData = await api.EquipmentSummaryAPI();
      if (apiData) {
        setData(apiData);
      }
      setLoading(false);
    };
    fetchData();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        {/* Table Header */}
        <View style={styles.row}>
          <Text style={styles.header}>Equipment Abstract</Text>
        </View>

        {/* Table Rows */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : data ? (
          Object.entries(data).map(([key, value]) => (
            <View style={styles.row} key={key}>
              <Text style={styles.cell}>{key}</Text>
              <Text style={styles.cell}>{String(value)}</Text>
            </View>
          ))
        ) : (
          <Text>No data available</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 170,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
  },
  header: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
