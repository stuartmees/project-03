import React from 'react'
import { withRouter } from 'react-router-dom'

class SearchBar extends React.Component {
  constructor(){
    super()

    this.state={
      searchTerm: []
    }

    this.handleChange=this.handleChange.bind(this)
    this.handleSubmit=this.handleSubmit.bind(this)
  }

  handleChange(e){
    e.preventDefault
    this.setState( { searchTerm: e.target.value } )
    console.log(this.state)
  }

  handleSubmit(e){
    e.preventDefault
    this.props.history.push('/events?search=' + this.state.searchTerm)
  }

  render(){
    return(
      <form className="level is-half" onSubmit={this.handleSubmit}>
        <input
          className="input home-main-form-item"
          placeholder="What you looking for?"
          onChange={this.handleChange}
        />
        <button className="home-main-form-item">Find it</button>
      </form>
    )
  }
}

export default withRouter(SearchBar)
