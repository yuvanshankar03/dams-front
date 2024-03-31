
import Dams from './dams';
import axios from 'axios';

axios.defaults.baseURL = 'http://192.168.10.3:3001'


export default function App() {

  return (
    <Dams />
  );
}


