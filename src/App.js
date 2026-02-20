
import Dams from './dams';
import axios from 'axios';

axios.defaults.baseURL = 'https://dams-server-2.onrender.com'


export default function App() {

  return (
    <Dams />
  );
}



