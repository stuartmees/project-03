import React from 'react'
import axios from 'axios'

import Auth from '../../lib/Auth'
import Flash from '../../lib/Flash'

class Login extends React.Component{
  constructor(){
    super()
    this.state = {
      data: {},
      error: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    // merge data on state with new data from the form
    const data = { ...this.state.data, [e.target.name]: e.target.value }
    // set the data back on state
    this.setState({ data }) // equivalent to { data: data }
  }

  handleSubmit(e) {
    e.preventDefault()

    axios.post('/api/login', this.state.data)
      .then(res => {
        Auth.setToken(res.data.token)
        Flash.setMessage('success', res.data.message)
        this.props.history.push('/events')
      })
      .catch(() => this.setState({ error: 'Invalid credentials' }))
  }
  
  render() {
    console.log(this.state)
    return (
      <div>
        <div className="title section form-title">Login</div>
        <div className="user-form">
          <form onSubmit={this.handleSubmit}>
            <div className="field">
              <label className="label">Email</label>
              <input
                className="input"
                name="email"
                placeholder="eg: jack@hotmail.com"
                onChange={this.handleChange}
              />
            </div>
            <div className="field">
              <label className="label">Password</label>
              <div className="control">
                <input
                  className="input"
                  name="password"
                  type="password"
                  placeholder="eg: ••••••••"
                  onChange={this.handleChange}
                />
              </div>
              {this.state.error && <div className="help is-danger">{this.state.error}</div>}
            </div>
            <button>Submit</button>
          </form>
        </div>
      </div>


    )
  }
}
export default Login
