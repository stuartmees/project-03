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
* webpack
* git/GitHub


### Introduction
Our brief was to create a full-stack web app with a RESTful API. The API was to be made with an Express app and a MongoDB database and it was to be consumed by a React front end.

Our app is a website that enables users to register, log in and post details of music events for users of the website to see.

<img width="1419" alt="Screenshot 2019-05-25 at 16 36 38" src="https://user-images.githubusercontent.com/35113861/58371685-54778e80-7f0b-11e9-8b5e-126fd737396b.png">

The front end also pulls in information about venues and events from external APIs via HTTP requests for the user of the website to see.


## Process
_Describe the process of building the game. How did you get started? How did you manage your time? How would you do things next time?_

Working in a team of three presented the possibility of merge conflicts. Work was allocated is a way to avoid code conflicts, as far as possible, on merge and each developer worked on feature branches which we merged in to development. The GitHub repository owner pushed clean code from development, to master and then to Heroku.

After deciding on the idea, wireframes were created to ascertain the functionality we wanted the front end React app to have and therefore what data schema the database was to have

The Express App and database was the first thing to be created to enable event and user info to be stored.

Once this API was in place, and all routes tested, the building of the React app could begin to consume our API, and other external APIs.

From here the team decided who was working on what feature and merged appropriately when each feature was complete.

A one page app was created that rendered different components depending on the path:

```      <Router>
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
    )
  }
```

The Navbar component renders on every route with conditional rendering determining which link in the component to display on the specific route.

The home component:

<img width="1419" alt="Screenshot 2019-05-25 at 16 36 38" src="https://user-images.githubusercontent.com/35113861/58371685-54778e80-7f0b-11e9-8b5e-126fd737396b.png">

Users are able to search the database directly from the Home component. At the bottom it also displays three events from the external Songkick API near the users current location. These are randomly selected each time the page loads.

The EventShow component:

![image](https://user-images.githubusercontent.com/35113861/58371749-f39c8600-7f0b-11e9-9755-60aec9de0f71.png)

The event information is shown in the EventShow component which also displays a map of the venue location using ReactMapBox and users can comment on the events.

The VenueShow component:

![image](https://user-images.githubusercontent.com/35113861/58371955-77f00880-7f0e-11e9-886c-302142e4ed9d.png)

The venue information is shown in the VenueShow component which draws its information from from the external SongKick API. This component also displays upcoming events at that venue drawn from the same Songkick API.


### Challenges and wins
_Describe the biggest challenges.
  How did you overcome them?
  Did you decide to pivot because of time constraints?
  What did you learn from these problems?_

_Describe the wins.
  What are you most proud of?
  What did this project help you to understand the most?_

The biggest challenges we encountered were in the EventNew component where user could upload new event information:

![image](https://user-images.githubusercontent.com/35113861/58372027-6b1fe480-7f0f-11e9-91d5-ab57cb4f2d59.png)

This issues arised when using ReactSelect to allow users to imput Atrist names to the event and when trying to style description text the user had entered.



## Future features
_If you were to revisit this project in the future what features would you add?_
