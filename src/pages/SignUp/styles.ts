import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

import background from '../../assets/sign-up-background.png';

export const Container = styled.div`
  /*
    * faz com que a página tente ocupar todo espaço de tela
    * isso pode levar a problemas quando a tela tem muitos elementos e
    * alguns vão encolhendo
    * ex: header da tela de perfil
   */
  height: 100vh;

  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  max-width: 700px;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 20px;
    }

    a {
      display: block;
      margin-top: 24px;
      text-decoration: none;
      color: #f4ede8;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }
  }

  > a {
    display: flex;
    align-items: center;
    margin-top: 24px;
    text-decoration: none;
    color: #f4ede8;
    transition: color 0.2s;

    &:hover {
      color: ${shade(0.2, '#f4ede8')};
    }

    svg {
      margin-right: 18px;
    }
  }
`;

const appearFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }

  to {
    opacity: 1;
    transform: translateX(0px);
  }
`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${appearFromRight} 1s;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 20px;
    }

    a {
      display: block;
      margin-top: 24px;
      text-decoration: none;
      color: #f4ede8;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }
  }

  > a {
    display: flex;
    align-items: center;
    margin-top: 24px;
    text-decoration: none;
    color: #ff9000;
    transition: color 0.2s;

    &:hover {
      color: ${shade(0.2, '#ff9000')};
    }

    svg {
      margin-right: 18px;
    }
  }
`;

export const Background = styled.div`
  flex: 1;
  background: url(${background}) no-repeat;
  background-size: cover;
`;
