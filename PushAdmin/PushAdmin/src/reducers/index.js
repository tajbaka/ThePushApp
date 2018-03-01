import AuthReducer  from './AuthReducer';
import DataReducer from './DataReducer';
import ManageAccountsReducer from './ManageAccountsReducer';
import UpdateContentReducer from './UpdateContentReducer';
import { combineReducers } from 'redux';


export default combineReducers({
    auth: AuthReducer,
    data : DataReducer,
    manage: ManageAccountsReducer,
    update: UpdateContentReducer
  });