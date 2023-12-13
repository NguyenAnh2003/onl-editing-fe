/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import { decryptHelper, encryptHelper } from '../libs/utils';

const TestPage = () => {
  const submitHandler = () => {
    const name = 'nguyenanh';
    const password = 'dasd';
    const res = encryptHelper({ name, password });
    const r = decryptHelper(res);
    console.log('data', res, 'decrypted', r);
  };

  return <button onClick={submitHandler}>Click</button>;
};

export default TestPage;
