import './App.css';
import { BatchTracking } from './components/tracking/BatchTracking';
import { Tab } from 'bootstrap';
import { Tabs } from 'react-bootstrap';
import { Tracking } from './components/tracking/Tracking';
import { RawTracking } from './components/tracking/RawTracking';
import { Dashboard } from './components/dashboard/Dashboard';

function App() {

  return (
    <div className='application'>
      <Dashboard />
    </div>
  );
}

export default App;
