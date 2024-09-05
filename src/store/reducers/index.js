// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import auth from './auth';
import prescription from './prescription';
import patient from './patient';
import home from './home';
import dashboard from './dashboard';
import credit from './credit';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, auth, prescription, patient, home, dashboard, credit });

export default reducers;
