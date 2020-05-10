import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Promise from 'bluebird'

import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = process.env.MAPBOX

let index=0
let eventsLength=0

class VenuesShow extends React.Component{
  constructor(props){
    super(props)
    this.state ={
      venue: { },
      upcoming: {},
      currentEvent: {}

    }
    this.nextEvent=this.nextEvent.bind(this)
    this.previousEvent=this.previousEvent.bind(this)
    this.makeMap=this.makeMap.bind(this)
  }

  componentDidMount(){
    Promise.props({
      venue: axios.get(`https://api.songkick.com/api/3.0/venues/${this.props.match.params.id}.json`, {
        params: {
          apikey: process.env.SONG_KICK_KEY
        }
      }).then(res => res.data),
      upcoming: axios.get(`https://api.songkick.com/api/3.0/venues/${this.props.match.params.id}/calendar.json`, {
        params: {
          apikey: process.env.SONG_KICK_KEY
        }
      }).then(res => res.data)
    })
      .then(res => this.setState({ venue: res.venue, upcoming: res.upcoming}))
      .then(this.makeMap)
  }

  nextEvent(){
    index++

    eventsLength=this.state.upcoming.resultsPage.results.event.length

    this.setState({currentEvent: this.state.upcoming.resultsPage.results.event[index]})
  }

  previousEvent(){
    index--

    eventsLength=this.state.upcoming.resultsPage.results.event.length

    this.setState({currentEvent: this.state.upcoming.resultsPage.results.event[index]})
  }

  makeMap(){
    this.map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
      center: [this.state.venue.resultsPage.results.venue.lng, this.state.venue.resultsPage.results.venue.lat], // starting position [lng, lat]
      zoom: 15 // starting zoom
    })

    const marker = new mapboxgl.Marker()
      .setLngLat([this.state.venue.resultsPage.results.venue.lng, this.state.venue.resultsPage.results.venue.lat])
      .addTo(this.map)
  }

  render(){

    return(
      <section className="section">
        <div className="container box">
          <div className="columns is-multiline">
            <div className="column is-one-quarter">
              <div id="map" />
            </div>
            <div className="column is-three-quarters">
              {!!this.state.venue.resultsPage &&
                <div className="title is-1"><span> {this.state.venue.resultsPage.results.venue.displayName}</span>
                </div>
              }
              <div className="event-meta">
                {!!this.state.venue.resultsPage &&
                <div className=" subtitle is-7 is-one-quarter"><span> Capacity:{this.state.venue.resultsPage.results.venue.capacity}</span>
                </div>
                }
                {!!this.state.venue.resultsPage &&
                <div className=" subtitle is-7 is-one-quarter"><span> {this.state.venue.resultsPage.results.venue.street} - {this.state.venue.resultsPage.results.venue.zip}</span>
                </div>
                }
                {!!this.state.venue.resultsPage &&
                <div className=" subtitle is-7 is-one-quarter"><span> {this.state.venue.resultsPage.results.venue.phone}</span>
                </div>
                }
                {!!this.state.venue.resultsPage &&
                <div className=" subtitle is-7 is-one-quarter"><span><a href={this.state.venue.resultsPage.results.venue.website}> {this.state.venue.resultsPage.results.venue.website}</a></span>
                </div>
                }

              </div>
              {!!this.state.venue.resultsPage &&
              <div className=" subtitle is-7 "><span> {this.state.venue.resultsPage.results.venue.description}</span>
              </div>
              }
            </div>
          </div>
          <div className="upcoming">
            <h1 className="title is-3">UpComing Events</h1>

            <div className="columns upVevents is-multiline is-full-desktop ">
              <div className="column is-one-quarter">
                <button  onClick={this.previousEvent} disabled={index === 0}> Previous
                </button>
              </div>
              <div className="column is-one-half">
                <Link to={`/events/external/${this.state.currentEvent.id}`}>
                  <div  className="cards-slider">
                    <div className="cards-slider-wrapper ">
                      {!!this.state.upcoming.resultsPage &&
                    <div key={this.state.currentEvent.id} className="column card uevents ">
                      <span className="subtitle is-4 has-text-light">{this.state.currentEvent.displayName}</span>
                    </div>
                      }
                    </div>
                  </div>
                </Link>
              </div>
              <div className="column is-one-quarter">
                <button onClick={this.nextEvent} disabled ={index === eventsLength-1}  > Next
                </button>
              </div>
            </div>
          </div>
        </div>


      </section>
    )
  }
}

export default VenuesShow
