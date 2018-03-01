import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginUser, setError, dataFetch } from '../actions';
import { push } from 'react-router-redux';
import store from '../app';
import ReactLoading from 'react-loading';

class AuthForm extends Component{
    
    constructor(){
        super();
        this.state = {
            login: false
        }
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps

        if (this.state.login && this.props.user){
            this.setState({login: false}, function(){
                console.log(this.props.user, 'here')
                this.props.dataFetch(this.props.user);
                store.dispatch(push('/allusers'));
            })
        }
    }

    renderButton(){
        if (this.props.loading) {
            return (
                <div style={{alignSelf: 'center', justifyContent: 'center', display: 'flex'}}>
                    <ReactLoading  type='bubbles' color='#ffffff' height='100' width='100' />
                </div>
            )
        }
        return <input type='submit' className='btn btn-primary btn-block' value='Submit'/>;
    }

    render(){
        return (
            <div className='container loginForm'>
                <form className='form-group column item' onSubmit={this.signIn.bind(this)}>
                    <p className='introText1'>Welcome to ThePushProgram</p>
                    <p className='introText2'>Admin Panel</p>
                    <div className='form-group'>
                        <input type='text' className='form-control' ref='email' placeholder='Enter Username'/>
                    </div>
                    <br/>
                    <div className='form-group'>
                        <input type='password' className='form-control'  ref='password' placeholder='Enter Password'/>
                    </div>    
                    <br/>
                    { this.renderButton() }
                </form>
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

    console.log(loading, 'loading');

    return { state, loading, user };
};

export default connect(mapStateToProps, { loginUser, setError, dataFetch })(AuthForm);
