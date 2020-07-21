import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

interface ButtonProps {
  isDisabled?: boolean;
  outlined: boolean;
}

export const ButtonContainer = styled(RectButton)<ButtonProps>`
  height: 50px;
  border: #000;
  background: #000;
  flex-direction: row;
  padding: 10px 50px;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  margin: 20px auto;

  opacity: ${props => (props.isDisabled ? 0.7 : 1)};

  ${props =>
    props.outlined &&
    css`
      background: #fff;
    `}
`;

export const ButtonText = styled.Text<ButtonProps>`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  margin-left: 10px;
  text-transform: uppercase;

  ${props =>
    props.outlined &&
    css`
      color: #000;
    `}
`;
