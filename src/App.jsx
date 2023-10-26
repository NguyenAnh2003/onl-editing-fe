/* eslint-disable no-unreachable */
import { UserProvider } from './UserProvider';
import AppRoute from './routes';

function App() {
  return (
    <UserProvider>
      <AppRoute />
    </UserProvider>
  );
}

export default App;
