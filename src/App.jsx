/* eslint-disable no-unreachable */
import { UserProvider } from './store/UserProvider';
import AppRoute from './routes';
import { PrimeReactProvider } from 'primereact/api';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <UserProvider>
      <PrimeReactProvider>
        <Toaster reverseOrder={false} position='top-right'/>
        <AppRoute />
      </PrimeReactProvider>
    </UserProvider>
  );
}

export default App;
