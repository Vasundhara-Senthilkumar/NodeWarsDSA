const TOKEN_KEY = 'nodewars_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  const response = await fetch(endpoint, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  async login(usernameOrEmail, password) {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: usernameOrEmail, password })
    });
    if (data.token) setToken(data.token);
    return data;
  },

  async signup(payload) {
    const data = await request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (data.token) setToken(data.token);
    return data;
  },

  async getMe() {
    if (!getToken()) return null;
    try {
      const data = await request('/api/auth/me');
      return data.user;
    } catch {
      removeToken();
      return null;
    }
  },

  // Metadata
  async getCompanies() {
    const data = await request('/api/companies');
    return data.companies || [];
  },

  async getTopics() {
    const data = await request('/api/topics');
    return data.topics || [];
  },

  async getProblem(companyId, topicId) {
    const data = await request(`/api/problems/${companyId}/${topicId}`);
    return data.problem;
  },

  // Leaderboard & Users
  async getLeaderboard() {
    const data = await request('/api/users/leaderboard');
    return data.leaderboard || [];
  },

  async getUser(id) {
    const data = await request(`/api/users/${id}`);
    return data.user;
  },

  async updateProfile(updates) {
    const data = await request('/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
    return data.user;
  }
};
