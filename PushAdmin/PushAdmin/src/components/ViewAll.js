import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dataFetch, quickLogin } from '../actions';
import { push } from 'react-router-redux';
import store from '../app';

class ViewAll extends Component{
    
    componentWillMount(){
        this.setState({login: true}, function(){
            this.props.quickLogin();
        })
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps

        if (this.state.login){
            this.setState({login: false}, function(){
                if(this.props.user){
                    this.props.dataFetch(this.props.user); 
                }
                else{
                    store.dispatch(push('/authform'));
                }
            })
        }
    }

    render(){
        const userData = this.props.userData;

        return (
            <div className='container' style={{flexDirection: 'column'}}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '80%'}}>
                    <label style={{ color: 'white', display: 'flex'}} > All Registered Users </label>
                </div>
               <div style={{display: 'flex', flexDirection: 'column', width: '80%'}}>
                    {userData.map((userData, index) => 
                        <div key={index} style={{display: 'flex', flexDirection: 'row', marginTop: 80, borderWidth: 3, borderRadius: 5,  backgroundColor: '#2AA198', padding: 30, justifyContent:'space-between'}}> 
                            <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '33%'}}>
                                <label>
                                    First Name
                                </label>
                                <label>
                                    {userData.firstName} 
                                </label> 
                            </div> 
                            <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '33%'}}>
                                <label>
                                    Last Name
                                </label>
                                <label>
                                    {userData.lastName} 
                                </label> 
                            </div> 
                            <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '33%'}}>   
                                <label>
                                    Email
                                </label>
                                <label>
                                    {userData.email} 
                                </label>
                            </div>
                            <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '33%'}}>   
                                <label>
                                    Level
                                </label>
                                <label>
                                    {userData.level.name} 
                                </label>
                            </div>
                        </div>
                    )}   
                </div>
           </div>
        )
    }
}

const mapStateToProps = state => {

    console.log(state, 'all view')

    const data = state.data;
    var userData = data.userData;
    const user = state.auth.user;

    if(data){
        userData = _.map(userData, (val) => {
            return { ...val };
        });
    }

    return { userData, user };
};

export default connect(mapStateToProps, { dataFetch, quickLogin } )(ViewAll);
