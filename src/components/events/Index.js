import React from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import qs from 'query-string'

import EventsCard from './Card'

class EventsIndex extends React.Component{
  constructor(props){
    super(props)

    this.getMatches=this.getMatches.bind(this)

    this.state={
      events: []
    }
  }

  getMatches(){
    const re = new RegExp(this.props.match.query.search, 'i')

    return this.state.events.filter(event => re.test(event.name))
  }

  componentDidMount(){
    axios.get('/api/events')
      .then(res => this.setState({ events: res.data }))
  }

  render(){
    this.props.match.query = qs.parse(this.props.location.search)
    
    return(
      <section className="section">
        <div className="title">Events</div>
        { (this.getMatches().length===0) ? (
          <div className="zero-result container box index-card">
            <div className="columns">
              <div className="column">Sorry, we have no events matching that name. Try another search!</div>
              <div className="column is-one-fifth"><Link to="/events"><button>See all events</button></Link></div>
            </div>
          </div>
        ):(
          this.getMatches().map(event =>
            <div key={event._id} className="container index-card event-index-card">
              <Link to={`/events/${event._id}`}>
                <EventsCard {...event}/>
              </Link>
            </div>
          )
        )}
      </section>
    )
  }

}
export default EventsIndex
