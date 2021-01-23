import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import SignIn from '../../pages/SignIn';

const mockedPushHistory = jest.fn();
const mockedAddToast = jest.fn();
const mockedSignIn = jest.fn();

// whenever a module is imported, it should return some mock
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockedPushHistory,
  }),
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    signIn: mockedSignIn,
  }),
}));

jest.mock('../../context/ToastContext', () => ({
  useToast: () => ({
    addToast: mockedAddToast,
  }),
}));

describe('Sign In', () => {
  beforeEach(() => {
    // limpar o mock se não o mockedPushHistory ainda vai estar como executado, por ter sido executado na primeira função
    mockedPushHistory.mockClear();
  });

  it('should be able to sign in', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'breno@email.com' } });
    fireEvent.change(passwordField, { target: { value: '12345' } });
    fireEvent.click(buttonElement);

    // wait to history push be fired
    await waitFor(() => expect(mockedPushHistory).toBeCalledWith('/dashboard'));
  });

  it('should not sing when some input is invalid', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'breno@@email..com' } });
    fireEvent.change(passwordField, { target: { value: '' } });
    fireEvent.click(buttonElement);

    await waitFor(() => expect(mockedPushHistory).not.toBeCalled());
  });

  it('should display a toast when credentials are invalid', async () => {
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'breno@email.com' } });
    fireEvent.change(passwordField, { target: { value: '12345' } });
    fireEvent.click(buttonElement);

    await waitFor(() =>
      expect(mockedAddToast).toBeCalledWith(
        expect.objectContaining({ type: 'error' }),
      ),
    );
  });
});
