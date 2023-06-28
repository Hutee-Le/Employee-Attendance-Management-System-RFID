import axios from 'axios';

const baseUrl = 'http://localhost:5555/employees'; // Đường dẫn gốc của API

const EmployeeApi = {
  getAllEmployees: async () => {
    try {
      const response = await axios.get(`${baseUrl}/getAllEmployees`);
      return response.data;
    } catch (error) {
      throw new Error('Lỗi khi lấy danh sách nhân viên');
    }
  },
  getEmployeeById: async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/getEmployeeById/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to get employee by ID');
    }
  },
  addEmployee: async (employeeData) => {
    try {
      const response = await axios.post(`${baseUrl}/addEmployee`, employeeData);
      return response.data;
    } catch (error) {
      throw new Error('Lỗi khi tạo nhân viên mới');
    }
  },

  updateEmployee: async (employeeId, employeeData) => {
    try {
      const response = await axios.put(`${baseUrl}/updateEmployee/${employeeId}`, employeeData);
      return response.data;
    } catch (error) {
      throw new Error('Lỗi khi cập nhật thông tin nhân viên');
    }
  },

  deleteEmployee: async (employeeId) => {
    try {
      const response = await axios.delete(`${baseUrl}/deleteEmployee/${employeeId}`);
      return response.data;
    } catch (error) {
      throw new Error('Lỗi khi xóa nhân viên');
    }
  },
};

export default EmployeeApi;