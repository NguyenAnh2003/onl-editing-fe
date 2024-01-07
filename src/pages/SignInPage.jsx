/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React, { useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userLogin } from '../libs/user.api';
import { UserContext } from '../store/UserProvider';
import { decryptHelper } from '../libs/utils';
import Input from '../components/Input';

const SignInPage = () => {
  const nameRef = useRef(null);
  const passwordRef = useRef(null);
  const navigation = useNavigate();
  const { login } = useContext(UserContext);

  /**
   * Sign in get user data
   * Save currentUser in state -> cookie
   */
  const submitHandler = async () => {
    try {
      const { data, status } = await userLogin(nameRef.current.value, passwordRef.current.value);
      /** encrypted data */
      console.log(data);
      const { userId, username } = decryptHelper(data);
      login({ userId, username });
      /** Navigate to home */
      if (status === 200) navigation('/');
    } catch (error) {
      console.error(error);
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
  ];

  return (
    <div>
      <div className="bg-grey-lighter min-h-screen flex flex-col">
        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
            <h1 className="mb-8 text-3xl text-center">Sign in</h1>
            {inputProps.map((i, index) => (
              <Input key={index} {...i.props} ref={i.ref} />
            ))}

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
            <Link
              to={'/signup'}
              className="no-underline border-b border-blue text-blue"
              href="../login/"
            >
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
