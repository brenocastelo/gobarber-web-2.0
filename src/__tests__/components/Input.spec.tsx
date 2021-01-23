import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';

import Input from '../../components/Input';

jest.mock('@unform/core', () => ({
  useField() {
    return {
      fieldName: 'email',
      defaultValue: '',
      error: '',
      registerField: jest.fn(),
    };
  },
}));

describe('Input', () => {
  it('should render Input component', async () => {
    const { getByPlaceholderText } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    expect(getByPlaceholderText('E-mail')).toBeTruthy();
  });

  it('should highlight Input when it is focused', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = getByPlaceholderText('E-mail');
    const containerElement = getByTestId('input-container');

    fireEvent.focus(inputElement);

    await waitFor(() => {
      expect(containerElement).toHaveStyle({
        'border-color': '#ff9000',
      });
      expect(containerElement).toHaveStyle({
        color: '#ff9000',
      });
    });

    fireEvent.blur(inputElement);

    await waitFor(() => {
      expect(containerElement).not.toHaveStyle({
        'border-color': '#ff9000',
      });
      expect(containerElement).not.toHaveStyle({
        color: '#ff9000',
      });
    });
  });

  it('should highlight Input text color when it is filled', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = getByPlaceholderText('E-mail');
    const containerElement = getByTestId('input-container');

    fireEvent.change(inputElement, {
      target: {
        value: 'breno@email.com',
      },
    });

    fireEvent.blur(inputElement);

    await waitFor(() => {
      expect(containerElement).toHaveStyle({ color: '#ff9000' });
    });
  });
});
