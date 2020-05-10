import React from 'react'
import axios from 'axios'
import Auth from '../../lib/Auth'
import 'react-datepicker/dist/react-datepicker.css'
import CreatableSelect from 'react-select/lib/Creatable'
import DatePicker from 'react-datepicker'

const selectStyles = {
  control: (styles, state) => ({
    ...styles,
    backgroundColor: '#fafaff',
    borderRadius: '0',
    border: state.isFocused ? 0:0,
    boxShadow: state.isFocused ? 0:0,
    borderBottom: '0.5px solid rgb(223, 231, 236)',
    '&:hover': {
      borderBottom: '0.5px solid rgb(223, 231, 236)'
    }
  })
}

class EventsNew extends React.Component {

  constructor() {
    super()

    this.state = {
      data: {
        artist: [],
        date: '',
        start: '',
        finish: ''

      },
      errors: {},
      venues: [],
      venue: {}
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.findVenue = this.findVenue.bind(this)
    this.selectVenue = this.selectVenue.bind(this)
    this.handleChangeDate = this.handleChangeDate.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleStartTime = this.handleStartTime.bind(this)
    this.handleFinishTime = this.handleFinishTime.bind(this)
  }

  handleChange(e) {
    const data = { ...this.state.data, [e.target.name]: e.target.value }

    this.setState({ data })
  }

  handleSelectChange(e) {
    const data = { ...this.state.data, artist: e }
    this.setState({ data })
  }

  handleChangeDate(date) {
    this.setState({
      data: {
        ...this.state.data,
        date: date.toLocaleDateString()
      }
    })
  }

  handleStartTime(date) {
    this.setState({
      data: {
        ...this.state.data,
        start: date.toLocaleTimeString()
      }
    })
  }

  handleFinishTime(date) {
    this.setState({
      data: {
        ...this.state.data,
        finish: date.toLocaleTimeString()
      }
    })
  }

  selectVenue(venue){
    const { displayName: name, zip: postcode, id: skId } = venue
    const data = { ...this.state.data, venue: name, postcode, skId }

    this.setState({ data })
  }

  findVenue(e){
    e.preventDefault()

    if(this.state.data.skId ){
      this.setState({
        data: {
          ...this.state.data,
          skId: ''
        }
      })
    }

    axios.get('https://api.songkick.com/api/3.0/search/venues.json', {
      params: {
        query: this.state.data.venue,
        apikey: process.env.SONG_KICK_KEY
      }
    })
      .then(res => this.setState({ venues: res.data.resultsPage.results.venue }))
  }

  handleSubmit(e) {
    e.preventDefault()
    const token = Auth.getToken()
    axios.post('/api/events', this.state.data, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res  => this.props.history.push(`/events/${res.data._id}`))
      .catch(err => this.setState({ errors: err.response.data.errors }))

  }

  render() {

    return (
      <section className="section">
        <div className="title">Enter Event Details</div>

        <form className="event-form" onSubmit={this.handleSubmit}>

          <div className="columns">

            <div className="column">
              <div className="field">
                <label className="label">Name</label>
                <div className="control">
                  <input
                    className="input"
                    name="name"
                    placeholder="The name of your event!"
                    onChange={this.handleChange}
                    value={this.state.data.name || ''}
                  />
                </div>
                {this.state.errors.name && <div className="help is-danger">{this.state.errors.name}</div>}
              </div>
            </div>

            <div className="column">
              <form onSubmit={this.findVenue}>
                <div className="field">
                  <label className="label">Venue</label>
                  <div className="control level">
                    <input
                      className="input "
                      name="venue"
                      placeholder="Type the name of the venue to find it"
                      onChange={this.handleChange}
                      value={this.state.data.venue || ''}
                    />
                    <button className="find-button">Find</button>
                  </div>
                  {this.state.errors.name && <div className="help is-danger">{this.state.errors.name}</div>}
                </div>
              </form>
              {this.state.data.venue && !this.state.data.skId &&<div className="venue-search-modal">
                {this.state.venues.map(venue =>
                  <div key={venue.id}>
                    <div
                      className="venue-index-card index-card"
                      onClick={() => this.selectVenue(venue)}
                    >
                      <span className="title is-5">{venue.displayName}</span>
                      <span className="subtitle"> {venue.city.displayName}  {venue.city.country.displayName}</span>
                    </div>
                  </div>
                )}
              </div>}
            </div>
          </div>

          <div className="columns">
            <div className="column">
              <div className="field">
                <label className="label">Image</label>
                <div className="control">
                  <input
                    className="input"
                    name="image"
                    placeholder="eg: The poster for your event!"
                    onChange={this.handleChange}
                    value={this.state.data.image || ''}
                  />
                </div>
                {this.state.errors.image && <div className="help is-danger">{this.state.errors.image}</div>}
              </div>
              <form>
                <div className="field">
                  <label className="label">Artist</label>
                </div>
                <CreatableSelect
                  onChange={this.handleSelectChange}
                  styles={selectStyles}
                  isMulti
                />
              </form>
            </div>

            <div className="column">
              <div className="field">
                <label className="label">Description</label>
                <div className="control">
                  <textarea
                    className="textarea"
                    name="description"
                    placeholder="A description of your event"
                    onChange={this.handleChange}
                    value={this.state.data.description || ''}
                  />
                </div>
                {this.state.errors.description && <div className="help is-danger">{this.state.errors.description}</div>}
              </div>
            </div>
          </div>

          <div className="columns">

            <div className="column">
              <div className="field">
                <label className="label">Price</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    name="price"
                    placeholder="the price of your event"
                    onChange={this.handleChange}
                    value={this.state.data.price || ''}
                  />
                </div>
                {this.state.errors.date && <div className="help is-danger">{this.state.errors.price}</div>}
              </div>
            </div>

            <div className="column">
              <div className="field">
                <label className="label">Minimum Age</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    name="minimumAge"
                    placeholder="Minimum Age for the event"
                    onChange={this.handleChange}
                    value={this.state.data.minimumAge || ''}
                  />
                </div>
                {this.state.errors.minimumAge && <div className="help is-danger">{this.state.errors.minimumAge}</div>}
              </div>
            </div>
          </div>

          <div className="columns">
            <div className="column">
              <div className="field columns">
                <div className="column">
                  <label className="label">Date</label>
                  {this.state.data.date &&  <h1>{this.state.data.date || ''}</h1>}
                  <DatePicker
                    onChange={this.handleChangeDate}
                    value={this.state.data.date || ''}
                  />
                </div>
                <div className="column">
                  <label className="label">Start Time</label>
                  {this.state.data.start && <h1>{this.state.data.start || ''}</h1>}
                  <DatePicker
                    showTimeSelect
                    showTimeSelectOnly
                    onChange={this.handleStartTime}
                    value={this.state.data.start || ''}
                  />
                </div>
                <div className="column">
                  <label className="label">Finish Time</label>
                  {this.state.data.finish && <h1>{this.state.data.finish}</h1>}
                  <DatePicker
                    showTimeSelect
                    showTimeSelectOnly
                    onChange={this.handleFinishTime}
                    value={this.state.data.finish || ''}
                  />
                </div>
                {this.state.errors.date && <div className="help is-danger">{this.state.errors.date}</div>}
              </div>
            </div>

            <div className="column new-event-submit">
              <button>Submit</button>
            </div>
          </div>

        </form>
      </section>
    )
  }
}

export default EventsNew
