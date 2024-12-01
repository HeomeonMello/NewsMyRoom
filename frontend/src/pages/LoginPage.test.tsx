import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from './LoginPage';
import apiClient from '../services/api';

// Mocking the API client
jest.mock('../services/api');

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form correctly', () => {
    render(<LoginPage />);

    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('updates input fields when typing', () => {
    render(<LoginPage />);

    const usernameInput = screen.getByPlaceholderText(/Username/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('password123');
  });

  it('calls alert on successful login', async () => {
    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      data: { username: 'testuser' },
    });

    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Welcome, testuser');
    });
  });

  it('calls alert on login failure', async () => {
    (apiClient.post as jest.Mock).mockRejectedValueOnce(new Error('Login failed'));

    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: 'wronguser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Login failed');
    });
  });
});
