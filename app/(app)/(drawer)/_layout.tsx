import { useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useAuth } from '@/context/auth';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

function CustomDrawerContent(props: any) {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {}
  );

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'home-outline',
      screen: 'dashboard',
    },
    {
      id: 'calibration',
      label: 'Calibration',
      icon: 'construct-outline',
      subMenus: [
        {
          label: 'Abstract',
          screen: 'calibration/abstract',
        },
        {
          label: 'Overdue',
          screen: 'calibration/overdue',
        },
        {
          label: 'Schedule',
          screen: 'calibration/schedule',
        },
        {
          label: 'List',
          screen: 'calibration/list',
        },
      ],
    },
    {
      id: 'msa',
      label: 'MSA',
      icon: 'cube-outline',
      subMenus: [
        {
          label: 'Abstract',
          screen: 'msa/abstract',
        },
        {
          label: 'Over due',
          screen: 'msa/overdue',
        },
        {
          label: 'Schedule',
          screen: 'msa/schedule',
        },
        {
          label: 'List',
          screen: 'msa/list',
        },
      ],
    },
    {
      id: 'scanner',
      label: 'QR Scanner',
      icon: 'qr-code-outline',
      screen: 'scanner',
    },

    {
      id: 'profile',
      label: 'Profile',
      icon: 'people-outline',
      screen: 'profile',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings-outline',
      screen: 'settings',
    },
  ];

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const renderMenuItem = (item: any) => {
    const isExpanded = expandedMenus[item.id];

    return (
      <View key={item.id}>
        <Pressable
          style={styles.menuItem}
          onPress={() => {
            if (item.subMenus) {
              toggleMenu(item.id);
            } else {
              props.navigation.navigate(item.screen);
            }
          }}
        >
          <View style={styles.menuItemContent}>
            <Ionicons name={item.icon} size={24} color="#666" />
            <Text style={styles.menuItemText}>{item.label}</Text>
          </View>
          {item.subMenus && (
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#666"
            />
          )}
        </Pressable>
        {item.subMenus && isExpanded && (
          <View style={styles.subMenu}>
            {item.subMenus.map((subItem: any, index: number) => (
              <Pressable
                key={index}
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate(subItem.screen)}
              >
                <Text style={styles.subMenuItemText}>{subItem.label}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <Text style={styles.userName}>Alan sheejil</Text>
        <Text style={styles.userRole}>TVS</Text>
      </View>
      <View style={styles.menuContainer}>{menuItems.map(renderMenuItem)}</View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const { signOut } = useAuth();
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      window.frameworkReady?.();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Drawer
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f8f9fa',
          },
          headerTintColor: '#333',
          drawerStyle: {
            backgroundColor: '#fff',
            width: 320,
          },
          headerRight: () => (
            <TouchableOpacity onPress={signOut} style={{ marginRight: 15 }}>
              <Ionicons
                name="log-out-outline"
                size={24}
                color="black"
                style={{
                  backgroundColor: '#D3D3D3',
                  borderRadius: 10,
                  padding: 5,
                  paddingRight: 2,
                }}
              />
            </TouchableOpacity>
          ),
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            drawerLabel: 'Dashboard',
          }}
        />
        <Drawer.Screen
          name="calibration/abstract"
          options={{
            title: 'Abstract',
            drawerLabel: 'Abstract',
          }}
        />
        <Drawer.Screen
          name="calibration/schedule"
          options={{
            title: 'Schedule',
            drawerLabel: 'Schedule',
          }}
        />
        <Drawer.Screen
          name="calibration/overdue"
          options={{
            title: 'Over due',
            drawerLabel: 'Over due',
          }}
        />
        <Drawer.Screen
          name="calibration/list"
          options={{
            title: 'List',
            drawerLabel: 'List',
          }}
        />
        <Drawer.Screen
          name="msa/abstract"
          options={{
            title: 'Abstract',
            drawerLabel: 'Abstract',
          }}
        />
        <Drawer.Screen
          name="msa/overdue"
          options={{
            title: 'Over due',
            drawerLabel: 'Over due',
          }}
        />
        <Drawer.Screen
          name="msa/schedule"
          options={{
            title: 'Schedule',
            drawerLabel: 'Schedule',
          }}
        />
        <Drawer.Screen
          name="msa/list"
          options={{
            title: 'List',
            drawerLabel: 'List',
          }}
        />
        <Drawer.Screen
          name="scanner"
          options={{
            title: 'QR Scanner',
            drawerLabel: 'QR Scanner',
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            title: 'Profile',
            drawerLabel: 'Profile',
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: 'Settings',
            drawerLabel: 'Settings',
          }}
        />
      </Drawer>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userRole: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'space-between',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  subMenu: {
    paddingLeft: 30,
    backgroundColor: '#f8f9fa',
  },
  subMenuItem: {
    padding: 12,
  },
  subMenuItemText: {
    fontSize: 14,
    color: '#666',
  },
});
