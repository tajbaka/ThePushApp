import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dataFetch, quickLogin, updateContent, deleteContent } from '../actions';
import renderHTML from 'react-render-html';
import { push } from 'react-router-redux';
import store from '../app';
import ReactLoading from 'react-loading';

class AddContent extends Component{
    
    componentWillMount(){

        this.state = {
            toolData: [],
            practiceData: [],
            recordingData : []
        }

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
        else if (this.props.manage == 'Success' && this.state.manageAccountSent){
            this.setState({manageAccountSent: false}, function(){
                this.props.dataFetch(this.props.user); 
            });
        }
    }

    expand(index, type){
        switch(type){
            case 'level':
                const levelData = this.props.levelData;

                for (var i in levelData){
                    this.setState({
                        ['levelClicked' + i] : false,
                        addLevel: false,
                        addTool: false
                    });
                }

                var toolData = _.map(levelData[index].tools, (val, uid) => {
                    if(val.recordings){
                        val.recordings.addRecording = null;
                    }
                    else{
                        val.recordings = {addRecording: null};
                    }
                    return { ...val, uid };
                });

                
                toolData.push(null);
                

                this.setState({
                    toolData: toolData,
                    ['levelClicked' + index] : !this.state['levelClicked' + index]
                    
                }, function(){
                    // console.log(this.state['levelClicked' + index], 'levelclicked')
                });
                break;
            case 'tool':

                const toolData = this.state.toolData;

                for (var i in toolData){
                    this.setState({
                        ['toolClicked' + i] : false,
                        addTool: false,
                        addPractice: false
                    });
                }

                var practiceData = _.map(toolData[index].practices, (val, uid) => {
                    // console.log(val, 'practice data')
                    return { ...val, uid };
                });

                practiceData.push(null);

                this.setState({
                    practiceData: practiceData,
                    ['toolClicked' + index] : !this.state['toolClicked' + index]
                    
                },function(){
                    // console.log(this.state['toolClicked' + index], 'toolclicked')
                });

                break;
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
        const levelData = this.props.levelData;
        const toolData = this.state.toolData;
        const practiceData = this.state.practiceData;

        return (
            <div className='container addContent' style={{flexDirection: 'column'}}>

                { this.renderLoadingButton() }

                <div style={{ display: 'flex', flexDirection: 'column'}}>
                    <h3 style={{ color: 'white', display: 'flex'}} >Add or Remove Content</h3>
                </div>

                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {levelData.map((level, levelIndex) => 
                        <div key={levelIndex}>
                            {level == null ? 
                                !this.state.addLevel ?
                                <div onClick={this.addContentClicked.bind(this, 'addLevel')} style={{display: 'flex', marginTop: 10, borderRadius: 5, backgroundColor: '#2AA198', padding: 30, justifyContent:'center'}}>
                                    <label style={{color: 'white', fontSize: 40}}>
                                        +
                                    </label>
                                </div> 
                                :
                                <div style={{display: 'flex', flexDirection: 'row', marginTop: 10, borderRadius: 5,  backgroundColor: '#2AA198', padding: 30, justifyContent:'space-between'}}>
                                    <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                        <label>
                                            Level Name
                                        </label>
                                        <label style={{minHeight: '10%', minWidth: '80%'}} id={'levelname' + levelIndex} contentEditable='true'>
                                             Put In Content
                                        </label> 
                                    </div> 
                                    <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60%'}}>
                                        <label>
                                            Level Description
                                        </label>
                                        <label style={{minHeight: '30%', minWidth: '80%'}} id={'leveldescription' + levelIndex} contentEditable='true'>
                                            {renderHTML('Put In Content')}
                                        </label> 
                                    </div>
                                    <div onClick={this.editContent.bind(this, 'level', levelIndex, null, null)} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        <button className='btn btn-secondary'> Save </button>
                                    </div>
                                </div>
                            : 
                            <div onClick={this.expand.bind(this, levelIndex, 'level')} key={'level' + levelIndex}> 
                                <div style={{display: 'flex', flexDirection: 'row', marginTop: 10, borderRadius: 5,  backgroundColor: '#2AA198', padding: 30, justifyContent:'space-between'}}>
                                    <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                        <label>
                                            Level Name
                                        </label>
                                        <label style={{minHeight: '10%', minWidth: '80%'}} id={'levelname' + levelIndex}contentEditable='true'>
                                            {level.name} 
                                        </label>
                                      
                                    </div> 
                                  
                                    <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60%'}}>
                                        <label>
                                            Level Description
                                        </label>
                                        <label style={{minHeight: '30%', minWidth: '80%'}} id={'leveldescription' + levelIndex}contentEditable='true'>
                                            {renderHTML(level.description)} 
                                        </label> 
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <div onClick={this.editContent.bind(this, 'level', levelIndex, null, null)} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                            <button className='btn btn-secondary'> Save </button>
                                        </div>
                                        <div onClick={this.deleteContent.bind(this, 'level', levelIndex, null, null)} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10}}>
                                            <button className='btn btn-secondary'> Delete </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            }
                            { this.state['levelClicked' + levelIndex] ?
                                toolData.map((tool, toolIndex) =>
                                    <div key={'tool' + toolIndex}>
                                        {tool == null ? 
                                            !this.state.addTool ? 
                                            <div onClick={this.addContentClicked.bind(this, 'addTool')} style={{display: 'flex', borderRadius: 5,  backgroundColor: '#444444', padding: 30, justifyContent:'center', marginLeft: '5%', marginTop: 15}}>
                                                <label style={{color: 'white', fontSize: 40}}>
                                                    +
                                                </label>
                                            </div> 
                                            :
                                            <div style={{display: 'flex', flexDirection: 'row', borderRadius: 5,  backgroundColor: '#444444', padding: 30, justifyContent:'space-between', marginLeft: '5%', marginTop: 15}}>
                                                <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                    <label>
                                                        Tool Name
                                                    </label>
                                                    <label style={{minHeight: '10%', minWidth: '80%'}} id={'level' + levelIndex + 'toolname' + toolIndex} contentEditable='true'>
                                                        Put in Content
                                                    </label> 
                                                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                                                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                            <label> Primary </label>
                                                            <input id={'level' + levelIndex + "toolimage" + toolIndex + 'sourcePrimary'} style={{display: 'none'}} type="file" onChange={this.handleFileUpload.bind(this, 'tool', 'image', 'sourcePrimary', levelIndex, toolIndex, null)} />
                                                            <label style={{maginTop: 10}} for={'level' + levelIndex + "toolimage" + toolIndex + 'sourcePrimary'}>
                                                                <img id={'level' + levelIndex + "toolimageplacer" + toolIndex + 'sourcePrimary'} style={{width: 30, height: 30, margin: 10}}> </img> 
                                                            </label>
                                                        </div>
                                                        <div style={{display: 'flex', flexDirection: 'column', marginLeft: 10,  alignItems: 'center'}}> 
                                                            <label> Secondary </label>
                                                            <input id={'level' + levelIndex + "toolimage" + toolIndex + 'sourceSecondary'} style={{display: 'none'}} type="file" onChange={this.handleFileUpload.bind(this, 'tool', 'image','sourceSecondary', levelIndex, toolIndex, null)} />
                                                            <label for={'level' + levelIndex + "toolimage" + toolIndex + 'sourceSecondary'}>
                                                                <img id={'level' + levelIndex + "toolimageplacer" + toolIndex + 'sourceSecondary'} style={{width: 30, height: 30, margin: 10}}></img>
                                                            </label>
                                                        </div>
                                                    </div>
                                                     
                                                </div>
                                                <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '70%'}}>
                                                    <label>
                                                        Tool Description
                                                    </label>
                                                    <label style={{minHeight: '80%', minWidth: '80%'}} id={'level' + levelIndex + 'tooldescription' + toolIndex}contentEditable='true'>
                                                        {renderHTML('Put in Content')}
                                                    </label>  
                                                </div> 
                                                <div onClick={this.editContent.bind(this, 'tool', levelIndex, toolIndex, null)} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                    <button className='btn btn-secondary'> Save </button>
                                                </div>
                                            </div>  
                                        :
                                        <div onClick={this.expand.bind(this, toolIndex, 'tool')}  style={{display: 'flex', flexDirection: 'row', borderRadius: 5,  backgroundColor: '#444444', padding: 30, justifyContent:'space-between', marginLeft: '5%', marginTop: 15}}>
                                            <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                <label>
                                                    Tool Name
                                                </label>
                                                <label style={{minHeight: '10%', minWidth: '80%'}} id={'level' + levelIndex + 'toolname' + toolIndex} contentEditable='true'>
                                                    {tool.name}
                                                </label> 
                                                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                                                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                            <label> Primary </label>
                                                            <input id={'level' + levelIndex + "toolimage" + toolIndex + 'sourcePrimary'} style={{display: 'none'}} type="file" onChange={this.handleFileUpload.bind(this, 'tool', 'image', 'sourcePrimary', levelIndex, toolIndex, null)} />
                                                            <label for={'level' + levelIndex + "toolimage" + toolIndex + 'sourcePrimary'}>
                                                                <img id={'level' + levelIndex + "toolimageplacer" + toolIndex + 'sourcePrimary'} style={{width: 30, height: 30, margin: 10}} src={ tool.sourcePrimary }></img>
                                                            </label>
                                                        </div>
                                                        <div style={{display: 'flex', flexDirection: 'column', marginLeft: 10,  alignItems: 'center'}}> 
                                                            <label> Secondary </label>
                                                            <input id={'level' + levelIndex + "toolimage" + toolIndex + 'sourceSecondary'} style={{display: 'none'}} type="file" onChange={this.handleFileUpload.bind(this, 'tool', 'image','sourceSecondary', levelIndex, toolIndex, null)} />
                                                            <label for={'level' + levelIndex + "toolimage" + toolIndex + 'sourceSecondary'}>
                                                                <img id={'level' + levelIndex + "toolimageplacer" + toolIndex + 'sourceSecondary'} style={{width: 30, height: 30, margin: 10}} src={ tool.sourceSecondary }></img>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <label style={{fontSize: 20}}> Recordings </label>
                                                    {   
                                                        _.map(toolData[toolIndex].recordings, (recording, recordingKey) => 
                                                        <div style={{display: 'flex', flexDirection: 'column', marginLeft: 10,  alignItems: 'center'}}> 
                                                        <div key={recordingKey} style={{marginTop: 10}}>
                                                        {recording == null ?
                                                        <div>
                                                            <div style={{width: '30%'}}>
                                                                <input accept="audio/*" id={'level' + levelIndex + "toolrecording" + toolIndex + recordingKey} style={{display: 'none'}} type="file" onChange={this.handleFileUpload.bind(this, 'tool', 'recording', recordingKey, levelIndex, toolIndex, null)} />
                                                                <label id={'level' + levelIndex + "toolrecordingplacer" + toolIndex + recordingKey} for={'level' + levelIndex + "toolrecording" + toolIndex + recordingKey}>
                                                                    +
                                                                </label>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div style={{textAlign: 'center', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <div style={{width: '30%'}}>
                                                                <input style={{display: 'none'}} accept="audio" id={'level' + levelIndex + "toolrecording" + toolIndex + recordingKey} style={{display: 'none'}} type="file" onChange={this.handleFileUpload.bind(this, 'tool', 'recording', recordingKey, levelIndex, toolIndex, null)}/>
                                                                <label id={'level' + levelIndex + "toolrecordingplacer" + toolIndex + recordingKey} for={'level' + levelIndex + "toolrecording" + toolIndex + recordingKey} >
                                                                    {recording.name}
                                                                </label>
                                                            </div>
                                                            <button className="btn btnRecordings" id={'level' + levelIndex + "toolrecordingbutton" + toolIndex + recordingKey} onClick={this.deleteRecording.bind(this, 'tool', 'recording', recordingKey, levelIndex, toolIndex)} style={{marginLeft: 20}}> Remove </button>
                                                        </div>
                                                        }
                                                        </div>
                                                    </div>
                                                        )
                                                    }
                                            </div>
                                            <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '70%'}}>
                                                <label>
                                                    Tool Description
                                                </label>
                                                <label style={{minHeight: '80%', minWidth: '100%'}} id={'level' + levelIndex +  'tooldescription' + toolIndex} contentEditable='true'>
                                                    {renderHTML(tool.description)}
                                                </label>  
                                            </div>
                                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                                <div onClick={this.editContent.bind(this, 'tool', levelIndex, toolIndex, null)} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                    <button className='btn btn-secondary'> Save </button>
                                                </div>
                                                <div onClick={this.deleteContent.bind(this, 'tool', levelIndex, toolIndex, null)} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10}}>
                                                    <button className='btn btn-secondary'> Delete </button>
                                                </div>
                                            </div>
                                        </div>
                                        }

                                        { this.state['toolClicked' + toolIndex] ?
                                            practiceData.map((practice, practiceIndex) =>
                                                <div key={'practice' + practiceIndex}> 
                                                    
                                                    {practice == null ? 
                                                        !this.state.addPractice ? 
                                                        <div onClick={this.addContentClicked.bind(this, 'addPractice')} style={{display: 'flex', borderRadius: 5,  backgroundColor: '#135788', padding: 30, justifyContent:'center', marginLeft: '10%', marginTop: 15}}>
                                                            <label style={{color: 'white', fontSize: 40}}>
                                                                +
                                                            </label>
                                                        </div> 
                                                        : 
                                                        <div style={{display: 'flex', flexDirection: 'row', borderRadius: 5,  backgroundColor: '#135788', padding: 30, justifyContent:'space-between', marginLeft: '10%', marginTop: 15}}>
                                                            <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                                <label>
                                                                    Practice Name
                                                                </label>
                                                                <label style={{minHeight: '10%', minWidth: '100%'}} id={'level' + levelIndex +  'tool' + toolIndex + 'practicename' + practiceIndex}contentEditable='true'>
                                                                    Put in Content 
                                                                </label>
                                                                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                                                                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                                        <label> Primary </label>
                                                                        <input id={'level' + levelIndex + "tool" + toolIndex + "practiceimage" + practiceIndex + 'sourcePrimary'} style={{display: 'none'}} type="file" onChange={this.handleFileUpload.bind(this, 'practice', 'image', 'sourcePrimary', levelIndex, toolIndex, practiceIndex)} />
                                                                        <label for={'level' + levelIndex + "tool" + toolIndex + "practiceimage" + practiceIndex + 'sourcePrimary'}>
                                                                            <img id={'level' + levelIndex + "tool" + toolIndex + "practiceimageplacer" + practiceIndex + 'sourcePrimary'} style={{width: 30, height: 30, margin: 10}}/>
                                                                        </label>
                                                                    </div>
                                                                    <div style={{display: 'flex', flexDirection: 'column', marginLeft: 10,  alignItems: 'center'}}> 
                                                                        <label> Secondary </label>
                                                                        <input id={'level' + levelIndex + "tool" + toolIndex + "practiceimage" + practiceIndex + 'sourceSecondary'} style={{display: 'none'}} type="file" onChange={this.handleFileUpload.bind(this, 'practice', 'image', 'sourceSecondary', levelIndex, toolIndex, practiceIndex)} />
                                                                        <label for={'level' + levelIndex + "tool" + toolIndex + "practiceimage" + practiceIndex + 'sourceSecondary'}>
                                                                            <img id={'level' + levelIndex + "tool" + toolIndex + "practiceimageplacer" + practiceIndex + 'sourceSecondary'} style={{width: 30, height: 30, margin: 10}}/>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '70%'}}>
                                                                <label>
                                                                    Practice Description
                                                                </label>
                                                                <label style={{minHeight: '80%', minWidth: '100%'}} id={'level' + levelIndex +  'tool' + toolIndex + 'practicedescription' + practiceIndex}contentEditable='true'>
                                                                     {renderHTML('Put in Content')}  
                                                                </label>
                                                            </div> 
                                                            <div onClick={this.editContent.bind(this, 'practice', levelIndex, toolIndex, practiceIndex)} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                                <button className='btn btn-secondary'> Save </button>
                                                            </div>
                                                        </div>
                                                    :
                                                    <div style={{display: 'flex', flexDirection: 'row', borderRadius: 5,  backgroundColor: '#135788', padding: 30, justifyContent:'space-between', marginLeft: '10%', marginTop: 15}}>
                                                        <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                            <label>
                                                                Practice Name
                                                            </label>
                                                            <label style={{minHeight: '10%', minWidth: '100%'}} id={'level' + levelIndex +  'tool' + toolIndex + 'practicename' + practiceIndex} contentEditable='true'>
                                                                {practice.name}
                                                            </label> 
                                                        
                                                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                                                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                                <label> Primary </label>
                                                                <input id={'level' + levelIndex + "tool" + toolIndex + "practiceimage" + practiceIndex + 'sourcePrimary'} style={{display: 'none'}} type="file" onChange={this.handleFileUpload.bind(this, 'practice', 'image', 'sourcePrimary', levelIndex, toolIndex, practiceIndex)} />
                                                                <label for={'level' + levelIndex + "tool" + toolIndex + "practiceimage" + practiceIndex + 'sourcePrimary'}>
                                                                    <img id={'level' + levelIndex + "tool" + toolIndex + "practiceimageplacer" + practiceIndex + 'sourcePrimary'} src={practice.sourcePrimary} style={{width: 30, height: 30, margin: 10}}/>
                                                                </label>
                                                            </div>
                                                            <div style={{display: 'flex', flexDirection: 'column', marginLeft: 10,  alignItems: 'center'}}> 
                                                                <label> Secondary </label>
                                                                <input id={'level' + levelIndex + "tool" + toolIndex + "practiceimage" + practiceIndex + 'sourceSecondary'} style={{display: 'none'}} type="file" onChange={this.handleFileUpload.bind(this, 'practice', 'image', 'sourceSecondary', levelIndex, toolIndex, practiceIndex)} />
                                                                <label for={'level' + levelIndex + "tool" + toolIndex + "practiceimage" + practiceIndex + 'sourceSecondary'}>
                                                                    <img id={'level' + levelIndex + "tool" + toolIndex + "practiceimageplacer" + practiceIndex + 'sourceSecondary'} src={practice.sourceSecondary} style={{width: 30, height: 30, margin: 10}}/>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                        <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '70%'}}>
                                                            <label>
                                                                Practice Description
                                                            </label>
                                                            <label style={{minHeight: '80%', minWidth: '100%'}} id={'level' + levelIndex +  'tool' + toolIndex + 'practicedescription' + practiceIndex} contentEditable='true'>
                                                                {renderHTML(practice.description)}
                                                            </label>
                                                        </div>
                                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                                            <div onClick={this.editContent.bind(this, 'practice', levelIndex, toolIndex, practiceIndex)} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                                <button className='btn btn-secondary'> Save </button>
                                                            </div>
                                                            <div onClick={this.deleteContent.bind(this, 'practice', levelIndex, toolIndex, practiceIndex)} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10}}>
                                                                <button className='btn btn-secondary'> Delete </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    }
                                                </div>
                                        ): null }
                                    </div>
                            ): null }
                        </div>
                    )}
                </div>
            </div>
        )
    }

    addContentClicked(type){
        this.setState({
            [type] : !this.state[type]
        })
    }

    deleteRecording(type, filetype, filename, levelIndex, toolIndex){
        var id = 'level' + levelIndex + 'tool' + filetype + toolIndex + filename;
        var filePlacer = document.getElementById('level' + levelIndex + 'tool' + filetype + 'placer' + toolIndex + filename);
        var fileButton = document.getElementById('level' + levelIndex + 'tool' + filetype + 'button' + toolIndex + filename); 
            
        if (filePlacer instanceof HTMLImageElement){
            filePlacer.src = null;
        }
        else {
            filePlacer.style.display = 'none';
            fileButton.style.display = 'none';2
        }

        this.setState({[id]: 'remove'})
    }

    handleFileUpload(type, filetype, filename, levelIndex, toolIndex, practiceIndex) {
        var file, filePlacer, id, recording;

        if(type == 'level'){
            id = 'level' + filetype + levelIndex + filename;
            file = document.getElementById('level' + filetype + levelIndex + filename);
            filePlacer = document.getElementById('level' + filetype + 'placer' + levelIndex + filename); 
        }
        if(type =='tool'){
            id = 'level' + levelIndex + 'tool' + filetype + toolIndex + filename;
            file = document.getElementById('level' + levelIndex + 'tool' + filetype + toolIndex + filename);
            filePlacer = document.getElementById('level' + levelIndex + 'tool' + filetype + 'placer' + toolIndex + filename);
        }
        
        if(type =='practice'){
            id = 'level' + levelIndex + 'tool' + toolIndex + 'practice' + filetype + practiceIndex + filename; 
            file = document.getElementById('level' + levelIndex + 'tool' + toolIndex + 'practice' + filetype + practiceIndex + filename);
            filePlacer = document.getElementById('level' + levelIndex + 'tool' + toolIndex + 'practice' + filetype + 'placer' + practiceIndex + filename);
        }

        const uploadedFile = file.files[0];
        var reader  = new FileReader();
        reader.readAsDataURL(uploadedFile);

        reader.onloadend = function () {
            if (filePlacer instanceof HTMLImageElement){
                filePlacer.src = reader.result;
            }
            else {
                filePlacer.innerHTML = uploadedFile.name;
            }
        }

        console.log(id, 'the id');

        this.setState({[id]: uploadedFile})
    }

    deleteContent(type, levelIndex, toolIndex, practiceIndex){

        var uid;

        if(type == 'level'){
            uid = {
                level: 'level' + (levelIndex + 1),
                tool: '',
                practice: ''
            } 
        }
        if(type == 'tool'){
            uid = {
                level: 'level' + (levelIndex + 1),
                tool: 'tool' + (toolIndex + 1),
                practice: ''
            }
        }
        if(type == 'practice'){
            uid = {
                level: 'level' + (levelIndex + 1),
                tool: 'tool' + (toolIndex + 1),
                practice: 'practice' + (practiceIndex + 1) 
            }
        }

        this.props.deleteContent(this.props.user, uid); 
    }

    editContent(type, levelIndex, toolIndex, practiceIndex){

        var nameHTML, descriptionHTML, uid, primaryImage, secondaryImage, recordingFile;

        if(type == 'level'){
            nameHTML = document.getElementById('levelname' + levelIndex).innerHTML;
            descriptionHTML = document.getElementById('leveldescription' + levelIndex).innerHTML;
            primaryImage = this.state['levelimage' + levelIndex + 'sourcePrimary'];
            secondaryImage = this.state['levelimage' + levelIndex + 'sourceSecondary'];
            uid = {
                level: 'level' + (levelIndex + 1),
                tool: '',
                practice: ''
            } 
        }
        if(type == 'tool'){
            nameHTML = document.getElementById('level' + levelIndex + 'toolname' + toolIndex).innerHTML;
            descriptionHTML = document.getElementById('level' + levelIndex + 'tooldescription' + toolIndex).innerHTML; 
            primaryImage = this.state['level' + levelIndex + 'toolimage' + toolIndex + 'sourcePrimary'];
            secondaryImage = this.state['level' + levelIndex + 'toolimage' + toolIndex + 'sourceSecondary'];

            uid = {
                level: 'level' + (levelIndex + 1),
                tool: 'tool' + (toolIndex + 1),
                practice: ''
            }

            var i = 1;

            if(this.state.toolData[toolIndex]){
                _.map(this.state.toolData[toolIndex].recordings, (recording, recordingKey) => {
                    if(this.state['level' + levelIndex + 'toolrecording' + toolIndex + recordingKey]){
                        recordingFile = this.state['level' + levelIndex + 'toolrecording' + toolIndex + recordingKey]
                        uid.recording = 'recording' + i;
                        console.log('level' + levelIndex + 'toolrecording' + toolIndex + recordingKey, 'here it is')
                        console.log(uid.recording, 'the recording id');
                    }
                    i++;
                })
            }
        }
        if(type == 'practice'){
            nameHTML = document.getElementById('level' + levelIndex + 'tool' + toolIndex + 'practicename' + practiceIndex).innerHTML;
            descriptionHTML = document.getElementById('level' + levelIndex + 'tool' + toolIndex + 'practicedescription' + practiceIndex).innerHTML;
            primaryImage = this.state['level' + levelIndex + 'tool' + toolIndex + 'practiceimage' + practiceIndex + 'sourcePrimary'];
            secondaryImage = this.state['level' + levelIndex + 'tool' + toolIndex + 'practiceimage' + practiceIndex + 'sourceSecondary'];
            uid = {
                level: 'level' + (levelIndex + 1),
                tool: 'tool' + (toolIndex + 1),
                practice: 'practice' + (practiceIndex + 1) 
            }
        }

        this.props.updateContent(this.props.user, primaryImage, secondaryImage, recordingFile, uid, nameHTML, descriptionHTML); 
    }
} 

const mapStateToProps = state => {

    const user = state.auth.user;
    const data = state.data;
    const update = state.update;
    const loading = update.loading;
    var levelData = data.levelData;


    if(data){
        levelData = _.map(levelData, (val, uid) => {
            return { ...val, uid };
        });
        levelData.push(null);
    }

    return { user, data, levelData, loading };
};

export default connect(mapStateToProps, { dataFetch, quickLogin, updateContent, deleteContent } )( AddContent );
