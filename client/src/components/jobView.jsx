import React from 'react';
import Modal from 'react-modal';
import Datetime from 'react-datetime';

import { connect } from 'react-redux';
import * as User from '../actions/user.js';
import * as Job from '../actions/job.js';
import * as JobList from '../actions/joblist.js';
import * as Debug from '../actions/debug.js';
import * as Event from '../actions/event.js';

class JobView extends React.Component {
  constructor(props) {
    super(props);

    let company = '';
    let title = '';
    this.methods = props.methods;
    console.log('t')

    //object to hold all the events being rendered
    //key 0 is a dummy so that we won't run into 'undefined' errors
    this.eventHolder = {
      '0': {
        company: '',
        date: "",
        description: '',
        isInterview: '',
        interviewers: '',
        note: '',
        complete: '',
        emotion: '',
        positionId: ''
      }
    };

    //this eventId will be changed according to which event edit button is triggered
    this.eventId = '0';

    this.icons = {
      //from flaticon and noun project
      add: 'http://bit.ly/22ANd6h',
      edit: 'http://bit.ly/1sPUv9F',
      person: 'http://bit.ly/1VzViXR',
      phone: 'http://bit.ly/1XlMgzo',
      test: 'http://bit.ly/1RRIDJ1',
      apply: 'http://bit.ly/1XTFqj9',
      start: 'http://bit.ly/1qvVKtM',
      stop: 'http://bit.ly/1r4nbuq'
    }

    this.emoji = {
      //from twitter emoji
      'happy': 'http://bit.ly/1VHa8Mi',
      'delighted': 'http://bit.ly/1X6sFT0',
      'sunglasses': 'http://bit.ly/1WBDs7V', 
      'money': 'http://bit.ly/1RV7qeY',
      'smirk': 'http://bit.ly/1PzbOWS',
      'soso': 'http://bit.ly/1UlPigr',
      'notsure': 'http://bit.ly/1tbv2s5',
      'crying': 'http://bit.ly/1UCvB6w',
      'wtf': 'http://bit.ly/1U3qgVY',
      'angry': 'http://bit.ly/1Y2ARTv' 
    }

    //modal business
    this.state = {
      open: false
    }

    this.closeModal = this.closeModal.bind(this);

    //to determine whether questions or notes section will be rendered
    this.haveQuestions = false;
    this.haveNotes = false;

    //modal business - all three buttons (addEvent, editEvent and editJob)
    //share the same modal, so the following is to determine which forms to hide
    this.addFlag = true;
    this.editJobFlag = true;
    this.editEventFlag = true;

    this.addEvent = () => {
      this.addFlag = false;
      this.editJobFlag = true;
      this.editEventFlag = true;
    };

    this.updateEvent = () => {
      this.addFlag = true;
      this.editJobFlag = true;
      this.editEventFlag = false;
    };

    this.updateJob = () => {
      this.addFlag = true;
      this.editJobFlag = false;
      this.editEventFlag = true;
    };

  }

  openModal() { console.log(this.props);
    this.setState({open: true}); }

  closeModal() { this.setState({open: false}); }


  componentWillMount() {
    // var { id } = this.context.router.getCurrentQuery();
    var id = this.props.location.query.id;
    this.props.methods.getJob(id);
  }

  componentWillReceiveProps(nextProps) {
   // this.user = nextProps.user;
   this.methods = nextProps.methods;
   this.job = nextProps.job;
   // this.jobList = nextProps.jobList;
   // this.event = nextProps.event;

   this.company = this.job.company;
   this.title = this.job.title;
   this.events = this.job.events;
   this.notes = this.job.notes;
   this.jobURL = this.job.jobURL;
   this.complete = this.job.complete;

   console.log('next', nextProps);
   console.log('events', this.job.events);
   console.log('test', this.test);

   this.render();
  }

  createEvent(event) {
    event.preventDefault();

    let eventData = {
      description: this.refs.createEventDescription.value,
      interviewers: this.refs.createEventInterviewers.value,
      note: this.refs.createEventNote.value,
      complete: false,
      emotion: '',
      start: this.refs.addEventStart.state.inputValue,
      end: this.refs.addEventEnd.state.inputValue,
      followup: '',
      questions: '',
      positionId: 1
    }

    this.methods.postEvent(eventData);
  }

  editJob(event) {
   event.preventDefault();

   let completed = false;
   this.refs.editJobComplete.value === 'true' ? completed = true : completed;

    let jobData = {
      title: this.refs.editJobTitle.value,
      notes: this.refs.editJobNotes.value,
      complete: completed,
      id: 1
    }

    //this.test.push(this.refs);

    this.methods.putJob(jobData);
  }

  editEvent(event) {
   event.preventDefault();

    let eventData = {
      description: this.refs.editEventDescription.value,
      interviewers: this.refs.eventinterviewers,
      note: this.refs.editEventNote,
      complete: this.refs.editEventComplete,
      emotion: this.emotion,
      start: this.refs.addEventStart.state.inputValue,
      end: this.refs.addEventEnd.state.inputValue,
      questions: this.refs.editEventQuestions,
      positionId: 1,
      followup: this.refs.followup.state.inputValue,
      id: this.eventId
    }

    console.log(this.eventId)

    this.methods.putEvent(eventData);
  }


  render() {
    this.emotion = '';
    this.renderEmo = () => {
      return this.emotion;
    };
    this.complete ? this.status = 'Completed' : this.status = 'In Progress';
    if(this.events) {
    const company = this.jobURL.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im)[1];
    const compLogo = `https://logo.clearbit.com/${company}`;
      return( 
      <div className='container job-body'>
        <div className="container col-xs-10 job-details">
          <h2 className="col-xs-12 vcenter">{this.company}</h2>
          <h4 className="col-xs-12 vcenter" ><a href={this.jobURL}>{this.title}</a></h4>
          <div className="col-xs-12 vcenter"><h5>{this.status}</h5></div>
          <div className="col-xs-12 vcenter"><h5>Note:</h5></div>
          <div className="col-xs-8 vcenter"><div className='note'contenteditable><ul><li>{this.notes}</li></ul></div></div>
        </div>
        <div className='col-xs-2'>
          <img className='logo' src={compLogo} data-default-src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Example_image.png"/>
        </div>
        <div className="col-xs-2">
          <button className='btnoption' id='addbtn' onClick={() => { this.addEvent(); this.openModal()}}>
            <img className='options' src={this.icons.add}/>
          </button>
          <button className='btnoption' onClick={() => { this.updateJob(); this.openModal()}}>
            <img className='options' src={this.icons.edit}/>
          </button>
        </div>
    
        <Modal isOpen={this.state.open} onRequestClose={this.closeModal}>
          <form className='add-modal' hidden={this.addFlag}>
            <h2>Add Event</h2>
            <button onClick={this.closeModal}>Close</button>
            <button onClick={this.createEvent.bind(this)}>Submit</button>
            <p>Start Time:</p>
            <Datetime ref="addEventStart" />
            <p>End Time:</p>
            <Datetime ref="addEventEnd" />
            <p>Description:</p>
            <input className='form-control' ref='createEventDescription' defaultValue='In Person or Phone'/>
            <p>Interviewers:</p>
            <input className='form-control' ref='createEventInterviewers'/>
            <p>Follow Up:</p>
            <input className='form-control' ref='followup'/>
            <p>Status:</p>
            <input className='form-control' ref='status'/>
            <p>Note:</p>
            <input className='form-control' ref='createEventNote'/> 
          </form>
          
          <form className='edit-modal' hidden={this.editJobFlag}>
            <h2>Edit Job</h2>
            <button onClick={this.closeModal}>Close</button>
            <button onClick={this.editJob.bind(this)}>Submit</button>
            <p>Title:</p>
            <input className='form-control' ref='editJobTitle' defaultValue={this.title}/>
            <p>Notes:</p>
            <input className='form-control' ref='editJobNotes' defaultValue={this.notes}/>
            <p>Completed?</p>
            <input className='form-control' ref='editJobComplete' defaultValue={this.complete}/>
          </form>

          <form className='edit-modal' hidden={this.editEventFlag}>
            <h2>Edit Event</h2>
            <button onClick={this.closeModal}>Close</button>
            <button onClick={this.editEvent.bind(this)}>Submit</button>
            <p>Start Time:</p>
            <Datetime ref="editEventStart" defaultValue={this.eventHolder[this.eventId].start}/>
            <p>End Time:</p>
            <Datetime ref="editEventEnd" defaultValue={this.eventHolder[this.eventId].end}/>
            <p>Description:</p>
            <input className='form-control' ref='type'/>
            <p>Interviewers:</p>
            <input className='form-control' ref='interviewers' defaultValue={this.eventHolder[this.eventId].interviewers}/>
            <p>Follow Up:</p>
             <Datetime ref="editFollowUp" defaultValue={this.eventHolder[this.eventId].followup}/>
            <p>Questions:</p>
            <input className='form-control' ref='editEventQuestions' defaultValue={this.eventHolder[this.eventId].questions}/>
            <p>Description:</p>
            <input className='form-control' ref='editEventDescription' defaultValue={this.eventHolder[this.eventId].description}/>
            <p>Completed?</p>
            <input className='form-control' ref='editEventComplete' defaultValue={this.eventHolder[this.eventId].complete}/>
            <p>Note:</p>
            <input className='form-control' ref='editEventNote' defaultValue={this.eventHolder[this.eventId].note}/> 
            <p>Emotion:</p>
              <button type='button' className='emojibtn' onClick={() => {this.emotion = 'happy'; console.log(this.emotion); this.renderEmo()}}><img src={this.emoji.happy}/></button>
              <button type='button' className='emojibtn' onClick={() => {this.emotion = 'delighted'; console.log(this.emotion); this.renderEmo()}}><img src={this.emoji.delighted}/></button>
              <button type='button' className='emojibtn' onClick={() => {this.emotion = 'sunglasses'; console.log(this.emotion); this.renderEmo()}}><img src={this.emoji.sunglasses}/></button>
              <button type='button' className='emojibtn' onClick={() => {this.emotion = 'money'; console.log(this.emotion); this.renderEmo()}}><img src={this.emoji.money}/></button>
              <button type='button' className='emojibtn' onClick={() => {this.emotion = 'smirk'; console.log(this.emotion); this.renderEmo()}}><img src={this.emoji.smirk}/></button>
              <button type='button' className='emojibtn' onClick={() => {this.emotion = 'soso'; console.log(this.emotion); this.renderEmo()}}><img src={this.emoji.soso}/></button>
              <button type='button' className='emojibtn' onClick={() => {this.emotion = 'notsure'; console.log(this.emotion); this.renderEmo()}}><img src={this.emoji.notsure}/></button>
              <button type='button' className='emojibtn' onClick={() => {this.emotion = 'crying'; console.log(this.emotion); this.renderEmo()}}><img src={this.emoji.crying}/></button>
              <button type='button' className='emojibtn' onClick={() => {this.emotion = 'wtf'; console.log(this.emotion); this.renderEmo()}}><img src={this.emoji.wtf}/></button>
              <button type='button' className='emojibtn' onClick={() => {this.emotion = 'angry'; console.log(this.emotion); this.renderEmo()}}><img src={this.emoji.angry}/></button>
          </form>
        </Modal>

        <div className="container event-list timeline col-xs-12">
          {this.events.map((event) => {
            event.questions === null ? this.noQuestions = true : this.noQuestions = false;
            event.note === null ? this.noNotes = true : this.noNotes = false;
            this.eventHolder[event.id] = event;
            return (
              <div className='event col-xs-11 vcenter'>
                <div className='event-icon col-xs-1'><img src={this.icons.person}/></div>
                <div className='col-xs-9'><h4>{event.description}</h4></div>
                <div className='col-xs-1'>
                  <button className='edit' onClick={() => { this.eventId = JSON.stringify(event.id); this.updateEvent(); this.openModal()}}>
                    <img className='editimg' src={this.icons.edit}/>
                  </button>
                </div>
                <div className='col-xs-10'><h4>1st Round In Person Interview</h4></div>
                <div className='col-xs-10 event-body'>
                  <div className='col-xs-10 h5-no-pad'><h5 className=''>Interviewer: {event.interviewers}</h5></div>
                  <div className='col-xs-2'><img className="emoji" src={this.emoji.wtf}/></div>

                  <div className='col-xs-10 h5-no-pad' hidden={this.noQuestions}>
                    <p><b>Questions asked:</b></p>
                    <ol>
                    <li>{event.questions}</li>
                    </ol>
                  </div>

                  <div className='col-xs-10 h5-no-pad' hidden={this.noNotes}>
                    <p><b>Note:</b></p>
                    <ul>
                    <li>{event.note}</li>
                    </ul>
                    </div>
                  </div>
           
                  <div className='line'></div>
              </div>
            )
          })}

        <div className='event col-xs-11 vcenter'>
          <div className='event-icon col-xs-1'><img src={this.icons.start}/></div>
          <div className='col-xs-10'><h4>1 May 2016</h4></div>
          <div className='col-xs-10'><h4>Show of Interest</h4></div>
        </div>
    
      </div>
  
    </div>  

    );


  } else {
    return(
      <div>loading</div>
    );
  }
 }
}


const mapStateToProps = function mapStateToProps(state) {
  const {debug, user, job, jobList, event} = state;

  return {
    debug,
    user,
    job,
    jobList,
    event
  }
}

const mapDispatchToProps = function mapDispatchToProps(dispatch) {
  //PUTs currently crash server if no id is provided in data object
  return {
    methods : {
      debugOn: () => {
        dispatch(Debug.on());
      },
      debugOff: () => {
        dispatch(Debug.off());
      },
      getUser: () => {          //GETs /api/user/:id and sets user to response
        dispatch(User.get());
      },
      postUser: (data) => {     //POSTs /api/user and sets user to response
        dispatch(User.post(data));
      },
      putUser: (data) => {      //PUTs /api/user and sets user to response
        dispatch(User.put(data));
      },
      getJob: (id) => {
        dispatch(Job.get(id));
      }, 
      postJob: (data) => {
        dispatch(Job.post(data));
      },
      putJob: (data) => {
        dispatch(Job.put(data));
      },
      getJobList: () => {
        dispatch(JobList.get());
      },
      getEvent: () => {
        dispatch(Event.get());
      },
      postEvent: (data) => {
        dispatch(Event.post(data));
      },
      putEvent: (data) => {
        dispatch(Event.put(data));
      }
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (JobView);