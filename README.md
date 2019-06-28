# EventUp
project-03

### Timeframe
7 days

## Technologies used

* React
* MongoDB
* Express
* Mongoose
* JavaScript (ES6)
* HTML5
* CSS
* Bulma
* Ajax
* React Select
* ReactMapBox-GL
* OpenCageData - location lookup
* Webpack
* Git/GitHub


### Introduction
Our brief was to create a full-stack web app with a RESTful API. The API was to be made with an Express app and a MongoDB database and it was to be consumed by a React front end.

Our app is a website that enables users to register, log in and post details of music events for users of the website to see.

<img width="1419" alt="Screenshot 2019-05-25 at 16 36 38" src="https://user-images.githubusercontent.com/35113861/58371685-54778e80-7f0b-11e9-8b5e-126fd737396b.png">

The front end also pulls in information about venues and events from external APIs via HTTP requests for the user of the website to see.


## Process

Working in a team of three presented the possibility of merge conflicts. Work was allocated is a way to avoid code conflicts, as far as possible, on merge and each developer worked on feature branches which we merged in to development. The GitHub repository owner pushed clean code from development, to master and then to Heroku.

After deciding on the idea, wireframes were created to ascertain the functionality we wanted the front end React app to have and therefore what data schema the database was to have

The Express App and database was the first thing to be created to enable event and user info to be stored.

Once this API was in place, and all routes tested, the building of the React app could begin to consume our API, and other external APIs.

From here the team decided who was working on what feature and merged appropriately when each feature was complete.

A one page app was created that rendered different components depending on the path:

```    
      <Router>
        <main>
          <Navbar />
          <FlashMessages />

          <Switch>
            <Route path="/artists/:id" component={ArtistShow}/>
            <SecureRoute path="/events/new" component={EventsNew} />
            <Route path="/events/external/:id" component={SEventsShow}/>
            <SecureRoute path="/events/:id/edit" component={EventsEdit} />
            <Route path="/events/:id" component={EventsShow} />
            <Route path="/events" component={EventsIndex} />

            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <SecureRoute path="/myprofile" component={Profile} />

            <Route path="/venues/:id" component={VenuesShow} />
            <Route path="/venues" component={VenuesSearch} />
            <Route path="/" render={(props) => <Home location={this.state.location} {...props} />} />
          </Switch>

        </main>
      </Router>
```

The Navbar component renders on every route with conditional rendering determining which links in the component to display on the specific route.

The EventShow component:

![image](https://user-images.githubusercontent.com/35113861/58371749-f39c8600-7f0b-11e9-9755-60aec9de0f71.png)

The event information is shown in the EventShow component which also displays a map of the venue location using ReactMapBox and users can comment on the events.

The VenueShow component:

![image](https://user-images.githubusercontent.com/35113861/58371955-77f00880-7f0e-11e9-886c-302142e4ed9d.png)

The venue information is shown in the VenueShow component which draws its information from from the external SongKick API. This component also displays upcoming events at that venue drawn from the same Songkick API.


## Challenges and wins

### The Home and SearchBar Components
<br>
  <img width="1419" alt="Screenshot 2019-05-25 at 16 36 38" src="https://user-images.githubusercontent.com/35113861/58371685-54778e80-7f0b-11e9-8b5e-126fd737396b.png">
<br>
<br>
  Users are able to search the event database directly from the Home component using the SearchBar component which takes the user input and pushes the app to the EventsIndex page with a query string in the URL:

  ```
  handleChange(e){
    this.setState( { searchTerm: e.target.value } )
  }

  handleSubmit(e){
    e.preventDefault()
    this.props.history.push('/events?search=' + this.state.searchTerm)
  }
  ```

  The EventsIndex component then filters the database based on the search term found in the query string:

  ```
  getMatches(){
    const re = new RegExp(this.props.match.query.search, 'i')
    return this.state.events.filter(event => re.test(event.name))
  }
  ```
  The SearchBar component is also included in the NavBar in all other routes.

  At the bottom of the Home component three events from the external Songkick API near the users current location. These are randomly selected each time the page loads.

  ```
  getMetroEvents(){
    axios.get('https://api.songkick.com/api/3.0/search/locations.json', {
      params: {
        location: `geo:${this.state.location.lat},${this.state.location.lon}`,
        apikey: process.env.SONG_KICK_KEY
      }
    })
      .then(res => {
        const [{ metroArea }] = res.data.resultsPage.results.location

        return axios.get(`https://api.songkick.com/api/3.0/metro_areas/${metroArea.id}/calendar.json`, {
          params: {
            apikey: process.env.SONG_KICK_KEY,
            per_page: 30
          }
        })
      })
      .then(res => {
        const { event } = res.data.resultsPage.results
        const recEvents = []

        const activeEvents = event.filter(event => event.status !== 'cancelled')

        let randomEvent = activeEvents[Math.floor(Math.random() * activeEvents.length)]
        while(recEvents.length < 3 && !recEvents.includes(randomEvent)) {
          recEvents.push(randomEvent)
          randomEvent = activeEvents[Math.floor(Math.random() * activeEvents.length)]
        }

        this.setState({ recEvents })
      })
  }
  ```
  ### The EventsNew Component

  The biggest challenges we encountered were in the EventNew component where user could upload new event information:

  ![image](https://user-images.githubusercontent.com/35113861/58372027-6b1fe480-7f0f-11e9-91d5-ab57cb4f2d59.png)

  We wanted to be able to provide users of the site with accurate information about the venues events were being held at. This meant that we couldn't simply allow users to type a venue name into a textbox as multiple venues exist with the same names in different places. To do this we provided a search tool that made use of the SongKick api so that users could correctly select the venue they meant. This would allow us to provide a map on the event page and for us to be able to direct users to more information about the venue from the event page if they wanted. it.

  ```
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
  ```
  We needed a way for users to be able to add as many artists to an event as they required. Firstly we started off trying to write a function that would handle this ourselves but then we discovered React Select's mulit-creatable component which proved to be a much simpler way of handling the issue.


  The description portion of the form also proved to be a surprising challenge. A user could submit what they wanted  with no problem but we discovered that when we pulled the information back out of out database and displayed it on the page all line-breaks had been removed. The \n's were being ignored by the JSX. We solved this by splitting the string at the \n's and mapping this onto the page while adding in ```<br/>```'s to preserve the formatting.       

  ```
  {this.state.data.description && this.state.data.description.split('\n').map((paragraph, i) =>
    <p key={i}><br />{paragraph}</p>
  )}
  ```


### The Upcoming Events Slider in VenueShow Component
<br>
It was a challenge to find the right slider for React.js. We searched for React.js sliders but we could not find an appropriate one. We decided to make our own slider.

<br>
We defined two global variables for the movement of the slider. We called index for the current position of the event and eventsLength for the number of the events.

```
let index=0
let eventsLength=0

class VenuesShow extends React.Component{

```  
We created two functions for the movement of the slider.

We called nextEvent function.When User clicked the right arrow of the slider. It called nextEvent function and increase the index variable to go forward.
```
nextEvent(){
  index++
  eventsLength=this.state.upcoming.resultsPage.results.event.length
  this.setState({currentEvent: this.state.upcoming.resultsPage.results.event[index]})
  console.log(this.state.currentEvent)
  console.log(this.state)
}
```
We called previousEvent. When User clicked the left arrow of the slider. It called previousEvent function and decrease the index variable to go backward.
```
previousEvent(){
  index--
  eventsLength=this.state.upcoming.resultsPage.results.event.length
  this.setState({currentEvent: this.state.upcoming.resultsPage.results.event[index]})
}
```

This is how to click  the left and right arrows of the slider.
```
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

```  

## Reflections

We decided to work on the functionality of the app primarily at the outset and ignored styling. We tried to apply styling all in one go towards the end, which was very difficult as we did not have the classes and ids fresh in our memories. This made the task very time consuming.

On top of this we did not come to an over riding agreement at the outset on what the app should look like in terms of fonts, colours and over all feel. This led to conflicting additions to style and inconsistency across the whole app. As part of a bigger picture it emphasised the need to have a plan and vision agreed by the whole team at the outset.

## Future Features

* Currently the SearchBar only filter for a match in the even title. Ideally this should search the event venue and description as well and would be something to add in the future.

* We would like to enable users to message each other.
  * For users to message each other they would need to sign up. This leads to the requirement of two different types of users, and thus models in the database: event organisers and regular users.
