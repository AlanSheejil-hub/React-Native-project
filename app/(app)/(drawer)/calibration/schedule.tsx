import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal as RNModal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '@/app/api/api';
import { useRouter } from 'expo-router';

export default function Schedule() {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterType, setFilterType] = useState<'weekly' | 'monthly' | 'yearly'>(
    'monthly'
  );
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [filterType, fromDate, toDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let apiData;
      switch (filterType) {
        case 'weekly':
          apiData = api.WeekDueAPI;
          break;
        case 'monthly':
          apiData = await api.MonthDueAPI();
          break;
        case 'yearly':
          apiData = api.YearDueAPI;
          break;
        default:
          apiData = await api.MonthDueAPI(); // Fallback to monthly
      }

      // Check if apiData is an array before sorting
      if (Array.isArray(apiData) && apiData.length > 0) {
        const sortedData = apiData.sort(
          (
            a: { LastCalibrationType: string },
            b: { LastCalibrationType: string }
          ) =>
            getCalibrationLetter(a.LastCalibrationType).localeCompare(
              getCalibrationLetter(b.LastCalibrationType)
            )
        );
        setData(sortedData);
        setFilteredData(sortedData);
      } else {
        console.warn('API returned no valid data:', apiData);
        setData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredData(data);
    } else {
      setFilteredData(
        data?.filter((item) =>
          item.EquipmentCode?.toLowerCase().includes(searchText.toLowerCase())
        ) || []
      );
    }
  }, [searchText, data]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    return { day, month };
  };

  const getCalibrationLetter = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'internal':
        return 'I';
      case 'external':
        return 'E';
      case 'master':
        return 'M';
      default:
        return '?';
    }
  };

  const handleNavigateToDetails = (equipmentId: string) => {
    router.push({
      pathname: '/components/calDetails',
      params: { equipmentId },
    });
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const adjustDate = (date: Date, days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="filter" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <RNModal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Schedule</Text>

            <View style={styles.radioContainer}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setFilterType('weekly')}
              >
                <View
                  style={[
                    styles.radioCircle,
                    filterType === 'weekly' && styles.radioSelected,
                  ]}
                />
                <Text style={styles.radioText}>Weekly</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setFilterType('monthly')}
              >
                <View
                  style={[
                    styles.radioCircle,
                    filterType === 'monthly' && styles.radioSelected,
                  ]}
                />
                <Text style={styles.radioText}>Monthly</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setFilterType('yearly')}
              >
                <View
                  style={[
                    styles.radioCircle,
                    filterType === 'yearly' && styles.radioSelected,
                  ]}
                />
                <Text style={styles.radioText}>Yearly</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateContainer}>
              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>
                  From: {formatDateDisplay(fromDate)}
                </Text>
                <View style={styles.dateControls}>
                  <TouchableOpacity
                    onPress={() => setFromDate(adjustDate(fromDate, -1))}
                  >
                    <Ionicons name="chevron-back" size={20} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setFromDate(adjustDate(fromDate, 1))}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#007AFF"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>
                  To: {formatDateDisplay(toDate)}
                </Text>
                <View style={styles.dateControls}>
                  <TouchableOpacity
                    onPress={() => setToDate(adjustDate(toDate, -1))}
                  >
                    <Ionicons name="chevron-back" size={20} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setToDate(adjustDate(toDate, 1))}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#007AFF"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : data.length > 0 ? (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
        >
          {filteredData.map((item, index) => {
            const { day, month } = formatDate(
              item.LastCalibrationDate || new Date()
            );
            const calibrationLetter = getCalibrationLetter(
              item.LastCalibrationType
            );
            return (
              <View style={styles.card} key={index}>
                <View style={styles.circle}>
                  <Text style={styles.dateText}>{day}</Text>
                  <Text style={styles.monthText}>{month}</Text>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.titleText}>
                    {item.EquipmentCode || 'N/A'}
                  </Text>
                  <Text style={styles.descriptionText}>
                    {item.EquipmentDesc || ''}
                  </Text>
                </View>
                <View style={styles.letterCircle}>
                  <Text style={styles.letterText}>{calibrationLetter}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleNavigateToDetails(item.EquipmentID)}
                >
                  <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <Text>No data available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 8,
    marginBottom: 8,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dateText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  monthText: {
    color: '#fff',
    fontSize: 14,
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
  },
  letterCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  letterText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContainer: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  radioContainer: {
    width: '100%',
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: '#007AFF',
  },
  radioText: {
    fontSize: 16,
  },
  dateContainer: {
    width: '100%',
    marginBottom: 20,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateLabel: {
    fontSize: 16,
  },
  dateControls: {
    flexDirection: 'row',
    gap: 10,
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
