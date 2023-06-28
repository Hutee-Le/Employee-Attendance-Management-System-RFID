import axios from 'axios';

const baseUrl = 'http://localhost:5555/devices';

const DeviceApi = {
getAllDevices: async () => {
  try {
    const response = await axios.get(`${baseUrl}/getAllDevices`);
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
},

 addDevice:  async (newDevice) => {
  try {
    const response = await axios.post(`${baseUrl}//addDevice`, newDevice);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
},

updateDevice: async (deviceId, updatedDevice) => {
  try {
    const response = await axios.put(`${baseUrl}/updateDevice/${deviceId}`, updatedDevice);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
},

deleteDevice: async (deviceId) => {
  try {
    await axios.delete(`${baseUrl}/deleteDevice/${deviceId}`);
  } catch (error) {
    console.log(error);
  }
},

};

export default DeviceApi;