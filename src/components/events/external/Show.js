import React from 'react'

import { Link } from 'react-router-dom'
import axios from 'axios'



class Show extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    console.log(this.props.match.params.id)

    axios.get(`https://api.songkick.com/api/3.0/events/${this.props.match.params.id}.json`, {
      params: { apikey: process.env.SONG_KICK_KEY }
    })
      .then(res => {
        console.log(res.data)
        this.setState(res.data)
      })

  }

  render () {
    console.log(this.state)
    return (
      <div className="section">
        <div className="container box">

          <div className="columns show-body">
            <div className="column">
              {this.state.resultsPage &&
                <figure  className="image is-640x640  box ">
                  <img  src={`https://images.sk-static.com/images/media/profile_images/artists/${this.state.resultsPage.results.event.performance[0].artist.id}/huge_avatar`} />
                </figure>
              }
            </div>
            {this.state.resultsPage &&

            <div className="column external-event">

              <h1  className="title is-4">{this.state.resultsPage.results.event.displayName}</h1>


              <div  className="event-meta">
                <div className="subtitle is-7">{this.state.resultsPage.results.event.venue.displayName}</div>

                <div className="subtitle is-7">{this.state.resultsPage.results.event.start.date}</div>

                <div className="subtitle is-7">{this.state.resultsPage.results.event.venue.street}-{this.state.resultsPage.results.event.venue.zip}</div>


                <div className="subtitle is-7">Over 16s only</div>


              </div>
              <div className="subtitle is-5">
                {!!this.state.resultsPage &&
                  <div ><strong>Artists:</strong>
                    {this.state.resultsPage.results.event.performance.map(artist => {
                      return <span key={artist.id} className="event-show-artist" >{artist.displayName},</span>
                    })}
                  </div>
                }
              </div>


            </div>
            }
          </div>


          <div className="columns">
            <div className="column">

              <div className="event-meta"><span>Courtesy of Songkick</span>
              </div>

            </div>


          </div>

        </div>
      </div>

    )
  }
}

export default Show
