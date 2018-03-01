import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dataFetch, approveAccount, quickLogin } from '../actions';
import { push } from 'react-router-redux';
import store from '../app';
import ReactLoading from 'react-loading';

class ManageUsers extends Component{
    
    componentWillMount(){
        this.setState({login: true, manageAccountSent: false}, function(){
            this.props.quickLogin();
        })
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;

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
        else if (this.props.msg == 'Success' && this.state.manageAccountSent){
            this.setState({manageAccountSent: false}, function(){
                this.props.dataFetch(this.props.user); 
            });
        }
    }

    renderLoadingButton(){
        if (this.props.loading) {
            console.log('here i am')
            return (
                <div style={{position: 'fixed', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}}>
                    <div style={{alignSelf: 'center', justifyContent: 'center', display: 'flex'}}>
                        <ReactLoading  type='bubbles' color='#ffffff' height='100' width='100' />
                    </div>    
                </div>
            )
        }
        return <div/>;
    }

    render(){
        const newUserData = this.props.newUserData;

        return (
            <div className='container manageUsers' style={{flexDirection: 'column'}}>
                { this.renderLoadingButton() }
                <div style={{ display: 'flex', flexDirection: 'column', width: '80%', margin: 'auto' }}>
                    <h3>Manage New Users</h3>
                    <p className='title2'>Please either Approve or Reject the following new users. </p>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', width: '80%', margin: 'auto'}}>
                    {newUserData.map((newUserData, index) => 
                        <div key={index} style={{display: 'flex', flexDirection: 'row', marginTop: 15, borderWidth: 3, borderRadius: 5,  backgroundColor: '#2AA198', padding: 15, justifyContent:'space-between'}}> 

                            <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '33%'}}>
                                <label>
                                    Name
                                </label>
                                <p>
                                    {newUserData.name} 
                                </p> 
                            </div> 
                            
                            <div style={{ color: 'white', display: 'flex',  flexDirection: 'column', alignItems: 'center', width: '33%'}}>
                                <label>
                                    Email
                                </label>
                                <p>
                                    {newUserData.email} 
                                </p> 
                            </div> 
                            
                            <div style={{display: 'flex', alignItems: 'center', justifyContent:'flex-end', width: '33%'}}>
                                <button className='btn btn-primary' style={{padding: 10}} children='Approve' onClick={this.approveUser.bind(this, index)}/> 
                            </div> 

                        </div>
                    )}
                </div>
            </div>
        )
    }

    // <div key={index} style={{display: 'flex', flexDirection: 'row'}}> 
    //                         <label ref='name'>   
    //                             {newUserData.name} 
    //                         </label> 
    //                         <label ref='email' >   
    //                             {newUserData.email} 
    //                         </label>
    //                     </div> 

    approveUser(index){
        const newUserData = this.props.newUserData;
        const email = newUserData[index].email;

        this.setState({manageAccountSent: true}, function(){
            this.props.approveAccount(this.props.user, email);
        });
    }
}

const mapStateToProps = state => {

    console.log(state)

    const user = state.auth.user;
    const data = state.data;
    const manage = state.manage;
    const msg = manage.msg;
    const loading = manage.loading;
    var newUserData = data.newUserData;

    if(data){
        newUserData = _.map(newUserData, (val) => {
            return { ...val };
        });
    }

    return { user, data, newUserData, msg };
};

export default connect(mapStateToProps, { dataFetch, approveAccount, quickLogin } )(ManageUsers);
