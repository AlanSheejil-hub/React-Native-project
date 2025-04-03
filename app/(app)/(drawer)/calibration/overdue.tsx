import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '@/app/api/api';
import { useRouter } from 'expo-router';

type FilterType = 'internal' | 'external' | 'master';

interface Filters {
  internal: boolean;
  external: boolean;
  master: boolean;
}

const CustomCheckbox = ({
  value,
  onValueChange,
  label,
}: {
  value: boolean;
  onValueChange: () => void;
  label: string;
}) => (
  <TouchableOpacity style={styles.checkboxContainer} onPress={onValueChange}>
    <View style={[styles.customCheckbox, value && styles.checkedCheckbox]}>
      {value && <Ionicons name="checkmark" size={16} color="white" />}
    </View>
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function Overdue() {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    internal: false,
    external: false,
    master: false,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiData = await api.OverDueAPI();
        if (apiData) {
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
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let tempData = [...data];

    if (searchText.trim() !== '') {
      tempData = tempData.filter((item) =>
        item.EquipmentCode.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    const activeFilters = Object.keys(filters).filter(
      (key) => filters[key as FilterType]
    ) as FilterType[];
    if (activeFilters.length > 0) {
      tempData = tempData.filter((item) =>
        activeFilters.includes(
          item.LastCalibrationType.toLowerCase() as FilterType
        )
      );
    }

    setFilteredData(tempData);
  }, [searchText, data, filters]);

  const handleFilterChange = (filterName: FilterType) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    return { day, month };
  };

  const getCalibrationLetter = (type: string) => {
    switch (type.toLowerCase()) {
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Calibration Type</Text>

            <CustomCheckbox
              value={filters.internal}
              onValueChange={() => handleFilterChange('internal')}
              label="Internal"
            />
            <CustomCheckbox
              value={filters.external}
              onValueChange={() => handleFilterChange('external')}
              label="External"
            />
            <CustomCheckbox
              value={filters.master}
              onValueChange={() => handleFilterChange('master')}
              label="Master"
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : data.length > 0 ? (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
        >
          {filteredData.map((item, index) => {
            const { day, month } = formatDate(item.LastCalibrationDate);
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
                  <Text style={styles.titleText}>{item.EquipmentCode}</Text>
                  <Text style={styles.descriptionText}>
                    {item.EquipmentDesc}
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
    width: 50,
    height: 50,
    borderRadius: 25,
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkedCheckbox: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
