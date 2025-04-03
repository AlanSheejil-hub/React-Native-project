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
import { Picker } from '@react-native-picker/picker';
import api from '@/app/api/api';
import { useRouter } from 'expo-router';
import storage from '@/app/service/storage';

// Define TypeScript interfaces
interface CalibrationTypes {
  internal: boolean;
  external: boolean;
  master: boolean;
}

interface Equipment {
  EquipmentID: string;
  EquipmentCode: string;
  EquipmentDesc: string;
  LastCalibrationDate: string;
  LastCalibrationType: string;
  LocationId: string;
  CustodianId: string;
}

interface Location {
  id: string;
  name: string;
}

interface Custodian {
  id: string;
  name: string;
}

interface Filters {
  calibrationTypes: CalibrationTypes;
  locationId: string;
  custodianId: string;
}

// Helper function to fetch equipment by location
const getEquipmentByLocation = async (
  locationId: string
): Promise<Equipment[]> => {
  const apiToken = await storage.getToken();
  if (!apiToken) {
    console.log('No token found for getEquipmentByLocation');
    return [];
  }

  try {
    const url = `http://app.acecms.in/api/EquipmentListApi/Location/${locationId}`;
    console.log('Fetching equipment from:', url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      );
    }

    const data: Equipment[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error in getEquipmentByLocation:', error);
    return [];
  }
};

// FilterModal Component
const FilterModal = ({
  filterModalVisible,
  setFilterModalVisible,
  filters,
  setFilters,
  locations,
  custodians,
}: {
  filterModalVisible: boolean;
  setFilterModalVisible: (visible: boolean) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  locations: Location[];
  custodians: Custodian[];
}) => {
  const [tempFilters, setTempFilters] = useState<Filters>(filters); // Temporary state for filters

  // Sync tempFilters with filters when modal opens
  useEffect(() => {
    if (filterModalVisible) {
      setTempFilters(filters);
    }
  }, [filterModalVisible, filters]);

  const toggleCalibrationType = (type: keyof CalibrationTypes) => {
    setTempFilters({
      ...tempFilters,
      calibrationTypes: {
        ...tempFilters.calibrationTypes,
        [type]: !tempFilters.calibrationTypes[type],
      },
    });
  };

  const clearFilters = () => {
    setTempFilters({
      calibrationTypes: {
        internal: false,
        external: false,
        master: false,
      },
      locationId: '',
      custodianId: '',
    });
  };

  const handleClose = () => {
    setFilters(tempFilters); // Apply changes only on explicit close
    setFilterModalVisible(false);
  };

  const handleCancel = () => {
    setTempFilters(filters); // Revert to original filters on cancel (click outside)
    setFilterModalVisible(false);
  };

  return (
    <Modal
      visible={filterModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel} // For Android back button
    >
      <TouchableOpacity
        style={styles.modalContainer}
        activeOpacity={1}
        onPressOut={handleCancel} // Cancel when clicking outside
      >
        <ScrollView contentContainerStyle={styles.scrollModalContent}>
          <TouchableOpacity
            activeOpacity={1} // Prevent closing when clicking inside content
            style={styles.modalContent}
          >
            <Text style={styles.modalTitle}>Filter Options</Text>

            {/* Calibration Types */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Calibration Types</Text>
              {(['internal', 'external', 'master'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.checkboxRow}
                  onPress={() => toggleCalibrationType(type)}
                >
                  <Ionicons
                    name={
                      tempFilters.calibrationTypes[type]
                        ? 'checkbox'
                        : 'square-outline'
                    }
                    size={24}
                    color="#007AFF"
                  />
                  <Text style={styles.checkboxText}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Locations Dropdown */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Select Location</Text>
              <ScrollView
                nestedScrollEnabled={true}
                style={styles.pickerContainer}
              >
                <Picker
                  selectedValue={tempFilters.locationId}
                  onValueChange={(itemValue) =>
                    setTempFilters({
                      ...tempFilters,
                      locationId: itemValue as string,
                    })
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Select a location" value="" />
                  {locations.map((item) => (
                    <Picker.Item
                      key={item.id}
                      label={item.name}
                      value={item.id}
                    />
                  ))}
                </Picker>
              </ScrollView>
            </View>

            {/* Custodians Dropdown */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Select Custodian</Text>
              <ScrollView
                nestedScrollEnabled={true}
                style={styles.pickerContainer}
              >
                <Picker
                  selectedValue={tempFilters.custodianId}
                  onValueChange={(itemValue) =>
                    setTempFilters({
                      ...tempFilters,
                      custodianId: itemValue as string,
                    })
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Select a custodian" value="" />
                  {custodians.map((item) => (
                    <Picker.Item
                      key={item.id}
                      label={item.name}
                      value={item.id}
                    />
                  ))}
                </Picker>
              </ScrollView>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.clearButton]}
                onPress={clearFilters}
              >
                <Text style={styles.buttonText}>Clear Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={handleClose}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </TouchableOpacity>
    </Modal>
  );
};

// Main List Component
export default function List() {
  const [searchText, setSearchText] = useState<string>('');
  const [data, setData] = useState<Equipment[]>([]);
  const [filteredData, setFilteredData] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    calibrationTypes: {
      internal: false,
      external: false,
      master: false,
    },
    locationId: '',
    custodianId: '',
  });
  const [locations, setLocations] = useState<Location[]>([]);
  const [custodians, setCustodians] = useState<Custodian[]>([]);
  const router = useRouter();

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [locationData, custodianData] = await Promise.all([
          api.LocationApi(),
          api.CustodianApi(),
        ]);

        setLocations(
          Array.isArray(locationData)
            ? locationData
                .map((item) => ({
                  id: String(item.LocationID),
                  name: item.Location,
                }))
                .filter((item) => item && item.id && item.name)
            : []
        );

        setCustodians(
          Array.isArray(custodianData)
            ? custodianData
                .map((item) => ({
                  id: String(item.CustodianID || item.id),
                  name: item.CustodianName || item.name,
                }))
                .filter((item) => item && item.id && item.name)
            : []
        );

        if (!filters.locationId) {
          const equipmentData = await api.EquipmentListApi();
          updateEquipmentData(equipmentData);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch equipment data when location changes
  useEffect(() => {
    const fetchEquipmentByLocation = async () => {
      try {
        setLoading(true);
        const equipmentData = filters.locationId
          ? await getEquipmentByLocation(filters.locationId)
          : await api.EquipmentListApi();
        updateEquipmentData(equipmentData);
      } catch (error) {
        console.error('Error fetching equipment by location:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipmentByLocation();
  }, [filters.locationId]);

  // Update and sort equipment data
  const updateEquipmentData = (equipmentData: Equipment[]) => {
    if (equipmentData && Array.isArray(equipmentData)) {
      const sortedData = equipmentData.sort((a: Equipment, b: Equipment) =>
        getCalibrationLetter(a.LastCalibrationType).localeCompare(
          getCalibrationLetter(b.LastCalibrationType)
        )
      );
      setData(sortedData);
      setFilteredData(sortedData);
    }
  };

  // Apply filters
  useEffect(() => {
    let result = [...data];

    if (searchText.trim()) {
      result = result.filter((item) =>
        item.EquipmentCode.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    const activeTypes = Object.entries(filters.calibrationTypes)
      .filter(([_, value]) => value)
      .map(([key]) => key);
    if (activeTypes.length > 0) {
      result = result.filter((item) =>
        activeTypes.includes(item.LastCalibrationType.toLowerCase())
      );
    }

    if (filters.custodianId) {
      result = result.filter(
        (item) => item.CustodianId === filters.custodianId
      );
    }

    setFilteredData(result);
  }, [searchText, data, filters.calibrationTypes, filters.custodianId]);

  const formatDate = (dateString: string): { day: number; month: string } => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    return { day, month };
  };

  const getCalibrationLetter = (type: string): string => {
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
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="filter" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : filteredData.length > 0 ? (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
        >
          {filteredData.map((item) => {
            const { day, month } = formatDate(item.LastCalibrationDate);
            const calibrationLetter = getCalibrationLetter(
              item.LastCalibrationType
            );
            return (
              <View style={styles.card} key={item.EquipmentID}>
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

      <FilterModal
        filterModalVisible={filterModalVisible}
        setFilterModalVisible={setFilterModalVisible}
        filters={filters}
        setFilters={setFilters}
        locations={locations}
        custodians={custodians}
      />
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scrollModalContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  filterSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 16,
  },
  pickerContainer: {
    maxHeight: 200, // Limit height to make it scrollable
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  clearButton: {
    backgroundColor: '#FF3B30', // Red for clear
  },
  closeButton: {
    backgroundColor: '#007AFF', // Blue for close
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
