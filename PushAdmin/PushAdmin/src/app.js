import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import logger from "redux-logger";
import promise from 'redux-promise-middleware';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'
import NavComponent from './components/common/NavComponent'
import { createHashHistory } from 'history'
import { Route, Switch } from 'react-router';
import firebase from 'firebase';

const history = createHashHistory();
const middleware = routerMiddleware(history)

import reducers from "./reducers";
import AppComponent from './components/App.js';
import AuthForm from './components/AuthForm.js'
import ManangeUsers from './components/ManageUsers';
import ViewAll from './components/ViewAll';
import AddContent from './components/AddContent';
import Logout from './components/Logout';

const config = {
    apiKey: "AIzaSyC3WIOnfoOjmPYaZzpjS6J8Fm5xQN7NMkk",
    authDomain: "push-b4d4b.firebaseapp.com",
    databaseURL: "https://push-b4d4b.firebaseio.com",
    projectId: "push-b4d4b",
    storageBucket: "push-b4d4b.appspot.com",
    messagingSenderId: "355077151040"
};

firebase.initializeApp(config);

export const store = createStore(
  reducers,
  applyMiddleware(middleware, thunk, promise())
)

const app = document.getElementById('app');
ReactDOM.render(
    <Provider store={store}>    
        <ConnectedRouter history={history}>
            <div>
                <Switch>
                    <Route exact path="/" component={AppComponent} />
                    <Route path="/authform" component={AuthForm} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/addcontent" component={AddContent} />
                    <Route path="/manageusers" component={ManangeUsers} />
                    <Route path='/allusers' component={ViewAll} />
                </Switch>
            </div>
        </ConnectedRouter>
    </Provider>,app
);

const unlisten = history.listen((location, action) => {
  // location is an object like window.location
  console.log(action, location.pathname, location.state)
})

export default store;