import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean
};

const Button: React.FC<ButtonProps> = ({ children, isLoading, ...rest }) => (
  <Container type="submit" {...rest}>
    {isLoading ? 'Enviando email...' : children}
  </Container>
);

export default Button;
