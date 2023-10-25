/* eslint-disable no-unused-vars */
import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import Layout from './components/layouts/Layout';
import Home from './pages/Home';
import EditPage from './pages/EditPage';
import MainEditPage from './pages/MainEditPage';

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
      }
    ],
  },
]);

const AppRoute = () => {
  return <RouterProvider router={router} />;
};

export default AppRoute;
