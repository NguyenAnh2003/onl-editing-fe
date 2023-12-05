/* eslint-disable no-unused-vars */
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './components/layouts/Layout';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { useContext } from 'react';
import { UserContext } from './store/UserProvider';
import Home from './pages/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'signin',
        element: <SignInPage />,
      },
      {
        path: 'signup',
        element: <SignUpPage />,
      },
    ],
  },
]);

const AppRoute = () => {
  const { currentUser } = useContext(UserContext);
  console.log(currentUser);
  return <RouterProvider router={router} />;
};

export default AppRoute;
