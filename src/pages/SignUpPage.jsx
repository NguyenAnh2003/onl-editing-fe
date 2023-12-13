/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userRegister } from '../libs/user.api';

const SignUpPage = () => {
  const nameRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const submitHandler = async () => {
    try {
      console.log(nameRef.current.value, passwordRef.current.value);
      const { data, status } = await userRegister(
        nameRef.current?.value,
        passwordRef.current?.value
      );
      /** if data navigate to sign in page (save info on browser manager) */
      if (status === 200 && data) navigate('/signin');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="bg-grey-lighter min-h-screen flex flex-col">
        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
            <h1 className="mb-8 text-3xl text-center">Sign up</h1>
            <input
              ref={nameRef}
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              name="fullname"
              placeholder="Full Name"
            />

            <input
              ref={passwordRef}
              type="password"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              name="password"
              placeholder="Password"
            />
            <input
              type="password"
              ref={passwordRef}
              className="block border border-grey-light w-full p-3 rounded mb-4"
              name="confirm_password"
              placeholder="Confirm Password"
            />

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
