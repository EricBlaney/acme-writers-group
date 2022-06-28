import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import Users from './Users';
import User from './User';


class App extends Component{
  constructor(){
    super();
    this.state = {
      users: [],
      userId: '',
      value: 'name'
    };
    this.deleteAUser = this.deleteAUser.bind(this);
    this.createAUser = this.createAUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  async componentDidMount(){
    try {
      const userId = window.location.hash.slice(1);
      this.setState({ userId });
      const response = await axios.get('/api/users');
      this.setState({ users: response.data });
      window.addEventListener('hashchange', ()=> {
      const userId = window.location.hash.slice(1);
      this.setState({ userId });
      });
    }
    catch(ex){
      console.log(ex);
    }

  }
  async deleteAUser(user){
    await axios.delete(`/api/users/${user.id}`);
    const users = this.state.users.filter(_user => _user.id !== user.id);
    this.setState({ users });
  }
  async createAUser(){
    const response = await axios.post('/api/users', {name: this.state.value});
    const users = [...this.state.users, response.data];
    this.setState({ users });
  }
  handleChange(event) {
    this.setState({value: event.target.value});
  }
  render(){
    const { users, userId } = this.state;
    const { deleteAUser, createAUser, handleChange } = this;
    return (
      <div>
        <h1>Acme Writers Group ({ users.length })</h1>
        <main>
          <div>
          <Users users = { users } userId={ userId } deleteAUser = {deleteAUser} />
          <form onSubmit = {createAUser}>
            <input type="text" value={this.state.value} onChange={handleChange}></input>
            <button type = "submit">Create User</button>
          </form>
          </div>
          {
            userId ? <User userId={ userId } /> : null
          }

        </main>
      </div>
    );
  }
}

const root = document.querySelector('#root');
render(<App />, root);


