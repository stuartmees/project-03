import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import Auth from '../../lib/Auth'
import axios from 'axios'



class Profile extends React.Component{

  constructor(){
    super()
    this.state={
      data: {}
    }
  }

  componentDidMount(){
    const token = Auth.getToken()

    axios.get('/api/myprofile',{
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => this.setState({data: res.data}))
      .catch(err => console.error(err))
  }

  render(){
    console.log(this.state.data)
    return(
      <section className="section">
        <div className="container">
          <div className="columns is-multiline is-full-desktop">
            <div className="column profile-left is-one-quarter ">
              <figure className="image">
                <img src={this.state.data.image} />
              </figure>
              <h2 className="title is-4 has-text-centered">{this.state.data.username}</h2>

            </div>
            <div className="column is-three-quarters">


              {this.state.data.events && <div>
                <h2 className="title is-2">My Events</h2>
                {this.state.data.events.length === 0 && <div className="index-card">You have not created any events yet</div>}
                {this.state.data.events.map(event =>
                  <div key={event._id} className="index-card">
                    <Link  to={`/events/${event._id}`}>
                      <div  className="columns event-index-card box-shadow">
                        <div className="column">
                          <img className="event-image" src={event.image}></img>
                        </div>
                        <div className="column">
                          <h1  className="title is-5">{event.name}</h1>
                          <div className="event-meta">
                            <div className="subtitle is-7">{event.date}</div>
                            <div className="subtitle is-7">{event.venue}</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>)}
              </div>}
            </div>
          </div>
        </div>
      </section>

    )
  }

}

export default Profile
