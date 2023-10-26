/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React, { useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userLogin } from '../libs/user.api';
import { UserContext } from '../UserProvider';

const SignInPage = () => {
  const nameRef = useRef(null);
  const passwordRef = useRef(null);
  const navigation = useNavigate();
  const { login } = useContext(UserContext);

  const submitHandler = async () => {
    try {
      const res = await userLogin(nameRef.current.value, passwordRef.current.value);
      console.log(res);
      login(res.data)
      if (res.status === 200) navigation('/');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <div className="bg-grey-lighter min-h-screen flex flex-col">
        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
            <h1 className="mb-8 text-3xl text-center">Sign in</h1>
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

            <button
              type="button"
              onClick={submitHandler}
              className="w-full text-center py-3 rounded bg-green text-black hover:bg-green-dark focus:outline-none my-1"
            >
              Log in
            </button>
          </div>

          <div className="text-grey-dark mt-6">
            Create Account
            <Link to={'/signup'} className="no-underline border-b border-blue text-blue" href="../login/">
              {' '}
              Register
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
