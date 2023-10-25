/* eslint-disable no-unused-vars */
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './components/layouts/Layout';
import Home from './pages/Home';
import EditPage from './pages/EditPage';
import MainEditPage from './pages/MainEditPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

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
        path: 'editor/:roomId',
        element: <EditPage />,
      },
      {
        path: 'edit',
        element: <MainEditPage />,
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
  return <RouterProvider router={router} />;
};

export default AppRoute;
