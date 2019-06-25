import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import Auth from '../../lib/Auth'

import SearchBar from './SearchBar'

class Navbar extends React.Component{

  constructor(props){
    super(props)
    this.state ={ active: false}
    this.logout = this.logout.bind(this)
    this.toggleActive = this.toggleActive.bind(this)
  }
  logout() {
    Auth.removeToken()
    this.props.history.push('/')
  }

  toggleActive() {
    this.setState({ active: !this.state.active })
  }

  componentDidUpdate(prevProps) {
    if(prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({ active: false })
    }
  }
  render(){
    return(
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/" className="logo is-size-4">EvUp</Link>

          <a role="button"
            className={`navbar-burger${this.state.active ? ' is-active' : ''}`} onClick={this.toggleActive}>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>

        </div>

        <div className={`navbar-menu${this.state.active ? ' is-active' : ''}`}>
          <div className="navbar-start">
            {((this.props.location.search!=='' && this.props.location.pathname==='/events')||(this.props.location.pathname!=='/events')) && <Link to="/events" className={`navbar-item ${this.state.active ? ' is-active' : ''} `}>Events</Link>}
            {this.props.location.pathname!=='/venues' && <Link to="/venues" className={`navbar-item ${this.state.active ? ' is-active' : ''} `}>Venues</Link>}
            {Auth.isAuthenticated() && <Link to="/events/new" className={`navbar-item ${this.state.active ? ' is-active' : ''} `}>Add an Event!</Link>}
          </div>

          <div className="navbar-end">
            {!Auth.isAuthenticated() && <Link to="/register" className={`navbar-item ${this.state.active ? ' is-active' : ''} `}>Register</Link>}

            {!Auth.isAuthenticated() && <Link to="/login" className={`navbar-item ${this.state.active ? ' is-active' : ''} `}>Login</Link>}

            {Auth.isAuthenticated() && <Link to="/myprofile" className={`navbar-item ${this.state.active ? ' is-active' : ''} `}>Profile</Link>}

            {Auth.isAuthenticated() && <a className={`navbar-item ${this.state.active ? ' is-active' : ''} `} onClick={this.logout}>Logout</a>}

            {this.props.location.pathname!=='/' &&
              <SearchBar />
            }
          </div>
        </div>
      </nav>
    )
  }
}

export default withRouter(Navbar)
