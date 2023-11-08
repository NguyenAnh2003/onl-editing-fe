/* eslint-disable no-unreachable */
import { UserProvider } from './store/UserProvider';
import AppRoute from './routes';
import { PrimeReactProvider } from 'primereact/api';

function App() {
  return (
    <UserProvider>
      <PrimeReactProvider>
        <AppRoute />
      </PrimeReactProvider>
    </UserProvider>
  );
}

export default App;
