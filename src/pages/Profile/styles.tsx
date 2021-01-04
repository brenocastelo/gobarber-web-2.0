import { shade } from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  header {
    height: 144px;
    background: #28262e;

    display: flex;
    align-items: center;
    padding-left: 144px;

    a {
      color: #999591;

      svg {
        width: 35px;
        height: 35px;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  margin-top: -100px;

  form {
    display: flex;
    flex-direction: column;

    width: 340px;

    h1 {
      font-size: 20px;
      margin-bottom: 20px;
    }

    button {
      margin-top: 24px;
    }

    /**
    estilizar um elemento de acordo com uma propriedade
    input[name='current_password'] {
      margin-top: 24px;
    }
    */
  }
`;

export const Avatar = styled.div`
  position: relative;
  align-self: center;
  margin-bottom: 32px;

  img {
    height: 186px;
    width: 186px;
    border-radius: 50%;
  }

  label {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 48px;
    width: 48px;
    border: 0;
    border-radius: 50%;
    background: #ff9000;
    transition: background 0.2s;

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: ${shade(0.2, '#ff9000')};
      cursor: pointer;
    }

    input {
      display: none;
    }

    svg {
      width: 20px;
      height: 20px;
      color: #312e38;
    }
  }
`;
