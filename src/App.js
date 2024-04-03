
import Dams from './dams';
import axios from 'axios';

axios.defaults.baseURL = 'https://dams-server-1.onrender.com'


export default function App() {

  return (
    <Dams />
  );
}


