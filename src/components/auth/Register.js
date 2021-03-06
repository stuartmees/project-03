import React from 'react'
import axios from 'axios'

class Register extends React.Component{
  constructor(){
    super()
    this.state ={
      data: {},
      errors: {}
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }


  handleChange(e) {
    // merge data on state with new data from the form
    const data = { ...this.state.data, [e.target.name]: e.target.value }
    // set the data back on state

    this.setState({  data })
  }

  handleSubmit(e) {
    e.preventDefault()

    axios.post('/api/register', this.state.data)
      .then(() => this.props.history.push('/login')) // redirect the user to the login page...
      .catch(err => this.setState({ errors: err.response.data.errors }))
  }

  render(){

    return(

      <section>
        <div className="title section form-title">Register</div>
        <div className="user-form">
          <form onSubmit={this.handleSubmit}>
            <div className="field">
              <label className="label">Username</label>
              <div className="control">
                <input
                  className="input"
                  name="username"
                  placeholder="eg: drakeon"
                  onChange={this.handleChange}
                />
              </div>
              {this.state.errors.username && <div className="help is-danger">{this.state.errors.username}</div>}
            </div>
            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <input   className="input"    name="email"
                  placeholder="eg: jack@hotmail.com"
                  onChange={this.handleChange}
                />
              </div>
              {this.state.errors.email && <div className="help is-danger">{this.state.errors.email}</div>}
            </div>
            <div className="field">
              <label className="label">Profile Image</label>
              <div className="control">
                <input
                  className="input"
                  name="image"
                  type="text"
                  placeholder="eg: https:myimages.com"
                  onChange={this.handleChange}
                />
              </div>
              {this.state.errors.image && <div className="help is-danger">{this.state.errors.image}</div>}
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
              {this.state.errors.password && <div className="help is-danger">{this.state.errors.password}</div>}
            </div>
            <div className="field">
              <label className="label">Password Confirmation</label>
              <div className="control">
                <input
                  className="input"
                  name="passwordConfirmation"
                  type="password"
                  placeholder="eg: ••••••••"
                  onChange={this.handleChange}
                />
              </div>
              {this.state.errors.passwordConfirmation && <div className="help is-danger">{this.state.errors.passwordConfirmation}</div>}
            </div>
            <button>Submit</button>
          </form>
        </div>
      </section>
    )
  }
}
export default Register
