import React from 'react';
import styled, { css } from 'styled-components';

const Message = styled.p`
  padding-left: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 10px;
  background-color: ${(props) => (props.variant === 'user' ? '#06c' : '#000')};
  color: #fff;
  text-align: ${props => props.variant === 'user' ? 'end' : 'start'};
`;

export default Message;