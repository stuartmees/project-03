import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Auth from '../../lib/Auth'

import mapboxgl from 'mapbox-gl'



mapboxgl.accessToken = process.env.MAPBOX
class Show extends React.Component {
  constructor() {
    super()

    this.state = {
      data: null,
      comment: {
        content: ''
      },
      user: {}

    }
    this.getMap = this.getMap.bind(this)
    this.makeMap = this.makeMap.bind(this)
    this.canModify= this.canModify.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)

  }

  getMap(data){

    // SORT IT AAAAAAAAT

    console.log(data,this.state.data,'messi')

    axios.get(`https://api.songkick.com/api/3.0/venues/${data.skId}.json?&apikey=${process.env.SONG_KICK_KEY}`)
      .then(res => this.setState({ data: data,
        lat: res.data.resultsPage.results.venue.lat,
        long: res.data.resultsPage.results.venue.lng

      }))
      .then(this.makeMap)
  }

  handleChange({ target: { name, value } }){
    this.setState({ comment: { [name]: value } })
  }

  handleSubmit(e){
    e.preventDefault()
    const token = Auth.getToken()

    axios.post(`/api/events/${this.state.data.id}/comments`, this.state.comment, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => this.setState({ data: { ...this.state.data, comments: res.data.comments }, comment: { content: '' } }))
      .catch(err => console.error(err))
  }


  makeMap(){
    console.log(this)
    this.map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
      center: [this.state.long, this.state.lat], // starting position [lng, lat]
      zoom: 15 // starting zoom
    })
    this.marker = new mapboxgl.Marker()
      .setLngLat([this.state.long, this.state.lat])
      .addTo(this.map)
  }

  componentDidMount() {
    const token = Auth.getToken()
    axios.get('/api/myprofile',{
      headers: { 'Authorization': `Bearer ${token}` }
    })

      .then(res =>this.setState({user: res.data}))
    axios.get(`/api/events/${this.props.match.params.id}`)
      .then(res => this.getMap(res.data))
  }
  handleDelete() {
    const token = Auth.getToken()
    axios.delete(`/api/events/${this.props.match.params.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => this.props.history.push('/events'))
  }

  canModify() {
    console.log('I am running')

    console.log(this.state)
    // if the user is logged in AND the user's id matches the characters' user's id return true
    return Auth.isAuthenticated() && Auth.getPayload().sub === this.state.data.createdBy._id
  }

  render () {

    if(!this.state.data) return null
    console.log(this.state,'eeee')

    return (
      <div className="section">
        <div className="container">

          <div className="columns ">
            <div className="column">
              <img className="event-image box" src={this.state.data.image} />
              <div id="map"></div>
            </div>

            <div className="column external-event">
              <h1  className="title is-1">{this.state.data.name}</h1>
              <div className="event-meta">
                <div className="subtitle is-7">{this.state.data.date}</div>
                <Link to={`/venues/${this.state.data.skId}`}>
                  <div className="subtitle is-7">{this.state.data.venue}, {this.state.data.postcode}</div>
                </Link>}
                <div className="subtitle is-7">£{this.state.data.price}</div>
                <div className="subtitle is-7">Over {this.state.data.minimumAge}s only</div>
                {this.state.data.start} - {this.state.data.finish}
              </div>


              <h2>{this.state.description}</h2>

              {this.state.data.description && this.state.data.description.split('\n').map((paragraph, i) =>
                <p key={i}><br />{paragraph}</p>
              )}
            </div>
          </div>

          <div className="columns">
            <div className="column">


              <div className="columns">
                {this.state.createdBy &&
                  <div className="event-meta column">
                    <span>Organised by {this.state.data.createdBy.username}</span>
                  </div>
                }
                {this.canModify() &&
                  <div className="column">
                    <div className="columns event-buttons">
                      <Link to={`/events/${this.state.data ._id}/edit`}><button>Edit</button></Link>
                      <button onClick={this.handleDelete}>Delete</button>
                    </div>
                  </div>
                }
              </div>

            </div>

            <div className="column">
              {!!this.state.data.artist &&
                <div className="event-show-artists">
                  <div className="columns">
                    {this.state.data.artist.map(artist =>
                      <span key={artist.label} className="column is-one-quarter event-show-artist" >{artist.label}</span>
                    )}
                  </div>
                </div>
              }
            </div>
          </div>

          <div>
            {Auth.isAuthenticated() &&
          <form className="level is-half search-bar" onSubmit={this.handleSubmit}>
            <input
              className="input home-main-form-item"
              placeholder="Say whatever you want"
              onChange={this.handleChange}
              name="content"
              value={this.state.comment.content}
            />
            <button className="home-main-form-item">Comment</button>
          </form>
            }
          </div>

          <div className="section">

            {this.state.data.comments.map(comment =>
              <div key={comment._id} className="columns box-shadow box">

                <div className="column profile-left is-one-quarter  ">
                  <figure className="image is-96x96 box ">
                    <img className="event-image" src={comment.user.image} />
                  </figure>
                  <div className="subtitle is-6  has-text-left">{comment.user.username}</div>
                </div>
                <div className="column  is-three-quarters box mycomment">

                  <div key={comment._id} className="subtitle is-6 ">{comment.content}</div>

                </div>
              </div>

            ) }
          </div>
        </div>
      </div>
    )
  }
}

export default Show
