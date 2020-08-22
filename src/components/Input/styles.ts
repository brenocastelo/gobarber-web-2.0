import styled, { css } from 'styled-components';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #232129;
  border-radius: 10px;
  border: 2px solid #232129;
  padding: 16px;
  width: 100%;
  color: #665360;

  display: flex;
  align-items: center;

  ${({ isFocused, isFilled }) =>
    (isFocused || isFilled) &&
    css`
      color: #ff9000;
    `}

  ${({ isFocused }) =>
    isFocused &&
    css`
      border-color: #ff9000;
    `}

  & + div {
    margin: 8px 0;
  }

  input {
    background: transparent;
    border: 0;
    color: #f4ede8;
    flex: 1;

    &::placeholder {
      color: #665360;
    }
  }

  svg {
    margin-right: 16px;
  }
`;
