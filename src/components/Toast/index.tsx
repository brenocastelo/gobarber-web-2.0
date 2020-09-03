import React from 'react';
import { useTransition } from 'react-spring';

import { ToastMessage } from '../../context/ToastContext';
import { Container } from './styles';
import Toast from './Toast';

interface ToastProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastProps> = ({ messages }) => {
  const messagesWithTransictions = useTransition(
    messages,
    message => message.id,
    {
      from: { right: '-120%' },
      enter: { right: '0%' },
      leave: { right: '-120%' },
    },
  );

  return (
    <Container>
      {messagesWithTransictions.map(({ item, key, props }) => (
        <Toast key={key} message={item} styles={props} />
      ))}
    </Container>
  );
};

export default ToastContainer;
