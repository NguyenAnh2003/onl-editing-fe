/* eslint-disable no-unused-vars */
import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import Layout from './components/layouts/Layout';
import Home from './pages/Home';
import EditRoom from './pages/EditRoom';

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
        element: <EditRoom />,
      }
    ],
  },
]);

const AppRoute = () => {
  return <RouterProvider router={router} />;
};

export default AppRoute;
