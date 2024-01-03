/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userRegister } from '../libs/user.api';
import Input from '../components/Input';

const SignUpPage = () => {
  const nameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPassRef = useRef(null);
  const navigate = useNavigate();

  const submitHandler = async () => {
    try {
      console.log(nameRef.current.value, passwordRef.current.value);
      const { data, status } = await userRegister(
        nameRef.current.value,
        passwordRef.current.value
      );
      /** if data navigate to sign in page (save info on browser manager) */
      if (status === 200) navigate('/signin');
    } catch (error) {
      console.log(error);
    }
  };

  const inputProps = [
    {
      props: {
        name: 'name',
        type: 'text',
        placeholder: 'Your full name',
      },
      ref: nameRef,
    },
    {
      props: {
        name: 'password',
        type: 'password',
        placeholder: 'Your password',
      },
      ref: passwordRef,
    },
    {
      props: {
        name: 'confirm-password',
        type: 'password',
        placeholder: 'Confirm your pasword',
      },
      ref: confirmPassRef,
    },
  ];

  return (
    <div>
      <div className="bg-grey-lighter min-h-screen flex flex-col">
        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
            <h1 className="mb-8 text-3xl text-center">Sign up</h1>
            {inputProps.map((i, index) => (
              <Input key={index} {...i.props} ref={i.ref} />
            ))}
            <button
              type="button"
              onClick={submitHandler}
              className="w-full text-center py-3 rounded bg-green text-black hover:bg-green-dark focus:outline-none my-1"
            >
              Create Account
            </button>
          </div>

          <div className="text-grey-dark mt-6">
            Already have an account?
            <Link
              to={'/signin'}
              className="no-underline border-b border-blue text-blue"
              href="../login/"
            >
              {' '}
              Log in
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
