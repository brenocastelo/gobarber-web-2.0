import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';

import { AuthProvider, useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth', () => {
  it('should be able to sign in', async () => {
    const mockedApiResponse = {
      user: {
        id: '44rff43-kgdg43f',
        email: 'breno@email.com',
        password: '123456',
      },
      token: 'asa4-ff43g-44',
    };

    const setItemSpyMock = jest.spyOn(Storage.prototype, 'setItem');

    apiMock.onPost('/sessions').reply(200, mockedApiResponse);

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'breno@email.com',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(setItemSpyMock).toHaveBeenCalledWith(
      '@GoBarber:token',
      mockedApiResponse.token,
    );
    expect(setItemSpyMock).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(mockedApiResponse.user),
    );
    expect(result.current.user.email).toBe('breno@email.com');
  });

  it('should be able to load auth data from storage when app initialize', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-xxxx';
        case '@GoBarber:user':
          return JSON.stringify({
            id: '44rff43-kgdg43f',
            email: 'breno@email.com',
            password: '123456',
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toEqual('breno@email.com');
  });

  it('should be able to sign out', () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // sign out is not async, but update react state, the we need to use act
    act(() => result.current.signOut());

    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    expect(result.current.user).toBeUndefined();
  });

  it('should be able to update user data', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    const user = {
      id: '44rff43-kgdg43f',
      name: 'Breno',
      email: 'breno@email.com',
      password: '123456',
      avatar_url: 'image.jpg',
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => result.current.updateUser(user));

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );
    expect(result.current.user).toBe(user);
  });
});
