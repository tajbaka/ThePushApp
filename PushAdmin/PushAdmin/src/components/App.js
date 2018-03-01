import React, {Component} from 'react';
import { connect } from 'react-redux';
import ViewAll from './ViewAll';
import AuthForm from './AuthForm';
import { quickLogin } from '../actions';

class App extends Component{
    
    componentWillMount(){
        console.log('made it in app.js')

        this.setState({login: true}, function(){
            this.props.quickLogin();
        })
    }

    render(){
        return (
            <div className='main'>
                { this.state.login && this.props.user ?  <ViewAll /> : <AuthForm /> }
            </div>
        )
    }
}

const mapStateToProps = state => {
    const user = state.auth.user;
    return { user };
};

export default connect(mapStateToProps, { quickLogin })(App);
