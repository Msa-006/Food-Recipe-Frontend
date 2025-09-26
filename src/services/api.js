const API_BASE_URL = 'http://localhost:9090/foodrecipie_backend/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.text();
      
      // Try to parse as JSON, fallback to text
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User authentication methods
  async signUp(userData) {
    return this.request('/users/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async signIn(email, password) {
    return this.request('/users/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async forgotPassword(email) {
    return this.request(`/users/forgotpassword/${email}`, {
      method: 'GET',
    });
  }

  async getFullName(csrid) {
    return this.request('/users/fullname', {
      method: 'POST',
      body: JSON.stringify({ csrid }),
    });
  }
}

export default new ApiService();
