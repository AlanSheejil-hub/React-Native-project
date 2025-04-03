import storage from '../service/storage';

storage;

const api = {
  EquipmentSummaryAPI: async () => {
    const apiToken = await storage.getToken();

    if (apiToken) {
      const res = await fetch('http://app.acecms.in/api/EquipmentSummaryAPI', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const data = await res.json();
      return data;
    } else {
      console.log('No token found');
    }
  },

  OverDueAPI: async () => {
    const apiToken = await storage.getToken();
    if (apiToken) {
      const res = await fetch('http://app.acecms.in/api/OverDueAPI', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const data = await res.json();
      return data;
    } else {
      console.log('No token found');
    }
  },

  MonthDueAPI: async () => {
    const apiToken = await storage.getToken();
    if (apiToken) {
      const res = await fetch('http://app.acecms.in/api/MonthDueAPI', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const data = await res.json();
      return data;
    } else {
      console.log('No token found');
    }
  },

  WeekDueAPI: async () => {
    const apiToken = await storage.getToken();
    if (apiToken) {
      const res = await fetch('http://app.acecms.in/api/WeekDueAPI', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const data = await res.json();
      return data;
    } else {
      console.log('No token found');
    }
  },

  YearDueAPI: async () => {
    const apiToken = await storage.getToken();
    if (apiToken) {
      const res = await fetch('http://app.acecms.in/api/YearDueAPI', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const data = await res.json();
      return data;
    } else {
      console.log('No token found');
    }
  },

  EquipmentListApi: async () => {
    const apiToken = await storage.getToken();
    if (apiToken) {
      const res = await fetch('http://app.acecms.in/api/EquipmentListApi', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const data = await res.json();
      return data;
    } else {
      console.log('No token found');
    }
  },

  LocationApi: async () => {
    const apiToken = await storage.getToken();
    if (apiToken) {
      const res = await fetch('http://app.acecms.in/api/LocationListApi', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const data = await res.json();
      return data;
    } else {
      console.log('No token found');
    }
  },

  CustodianApi: async () => {
    const apiToken = await storage.getToken();
    if (apiToken) {
      const res = await fetch('http://app.acecms.in/api/CustodianListApi', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const data = await res.json();
      return data;
    } else {
      console.log('No token found');
    }
  },
};

export default api;
