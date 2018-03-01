import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logoutUser } from '../actions';
import { push } from 'react-router-redux';
import store from '../app';
import firebase from 'firebase';

class Logout extends Component{
    
    constructor(){
        super();
        this.state = {
            login: false
        }
    }

    componentWillMount(){
       this.props.logoutUser();
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;

        if(!this.props.user){
            store.dispatch(push('/authform'));
        }
    }


    render(){
        return (
            <div className='container'>
                
            </div>
        )
    }

    signIn(e){
        e.preventDefault();
        let auth = {
            email: this.refs.email.value,
            password: this.refs.password.value
        }
        this.setState({login: true}, function(){
            this.props.loginUser(auth);
        })
        return false;
    }
}

const mapStateToProps = state => {

    const loading = state.auth.loading;
    const user = state.auth.user;

    return { state, loading, user };
};

export default connect(mapStateToProps, { logoutUser })(Logout);
