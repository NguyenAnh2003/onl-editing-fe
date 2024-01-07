/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';

const Input = forwardRef((props, ref) => {
  /**
   * @argument ref
   * @argument placeholder
   * @argument name
   * @argument type
   */
  const { placeholder, name, type } = props;
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      ref={ref}
      className="block border border-grey-light w-full p-3 rounded mb-4"
    />
  );
});

export default Input;
