import { User, Group, Expense, DashboardData, GroupDetails } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

interface AuthResponse {
    token: string;
    user: User;
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'x-auth-token': token }),
    };
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'An error occurred');
    }
    return response.json();
};


export const api = {
  login: async (email: string, pass: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, password: pass }),
    });
    return handleResponse(response);
  },

  signup: async (name: string, email: string, pass: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, email, password: pass }),
    });
    return handleResponse(response);
  },

  getDashboardData: async (): Promise<DashboardData> => {
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getGroupDetails: async (groupId: string): Promise<GroupDetails> => {
     const response = await fetch(`${API_BASE_URL}/group/${groupId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
  
  createGroup: async (groupName: string): Promise<Group> => {
    const response = await fetch(`${API_BASE_URL}/groups`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ groupName }),
    });
    return handleResponse(response);
  },

  joinGroup: async (inviteCode: string): Promise<Group> => {
    const response = await fetch(`${API_BASE_URL}/groups/join`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ inviteCode }),
    });
    return handleResponse(response);
  },

  // NOTE: These are placeholders. The backend endpoints for these are not fully implemented.
  addExpense: async (groupId: string, description: string, amount: number, paidById: string): Promise<Expense> => {
      console.warn("addExpense API call is not fully implemented on the backend.");
      // Mocked response for now to prevent errors.
      return Promise.resolve({} as Expense);
  },

  settleDebt: async (expenseId: string, userId: string): Promise<boolean> => {
      console.warn("settleDebt API call is not fully implemented on the backend.");
       // Mocked response for now to prevent errors.
      return Promise.resolve(true);
  },
};