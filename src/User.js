import React, { Component } from 'react';
import axios from 'axios';

class User extends Component{
  constructor(){
    super();
    this.state = {
      user: {},
      stories: [],
      title: 'Story title',
      body: 'Story body'
    };
    this.deleteAStory = this.deleteAStory.bind(this);
    this.createAStory = this.createAStory.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleBodyChange = this.handleBodyChange.bind(this);
  }
  async componentDidMount(){
    let response = await axios.get(`/api/users/${this.props.userId}`);
    this.setState({ user: response.data });
    response = await axios.get(`/api/users/${this.props.userId}/stories`);
    this.setState({ stories: response.data });

  }
  async componentDidUpdate(prevProps){
    if(prevProps.userId !== this.props.userId){
      let response = await axios.get(`/api/users/${this.props.userId}`);
      this.setState({ user: response.data });
      response = await axios.get(`/api/users/${this.props.userId}/stories`);
      this.setState({ stories: response.data });
      
    }
  }

  async deleteAStory(story){
    await axios.delete(`/api/stories/${story.id}`);
    const stories = this.state.stories.filter(_story => _story.id !== story.id);
    this.setState({stories});
  }
  async createAStory(){
    const response = await axios.post('/api/stories', {userId: this.props.userId, title: this.state.title, body: this.state.body});
    const stories = [...this.state.stories, response.data];
    this.setState({ stories });
  }
  handleTitleChange(event) {
    this.setState({title: event.target.value});
    //might need to fix this.
  }
  handleBodyChange(event) {
    this.setState({body: event.target.value});
  }
  render(){
    const { user, stories } = this.state;
    const { createAStory, handleBodyChange, handleTitleChange} = this;
    return (
      <div>
        Details for { user.name }
        <p>
          { user.bio }
        </p>
        <ul>
          {
            stories.map( story => {
              return (
                <li key={ story.id }>
                  { story.title } <button onClick ={ () => this.deleteAStory(story)}>X</button>
                  <p>
                  { story.body }
                  </p>
                </li>

              );
            })
          }
          <form onSubmit = {createAStory}>
            <input type="text" value={this.state.title} onChange={handleTitleChange}></input>
            <input type="text" value={this.state.body} onChange={handleBodyChange}></input>
            <button type = "submit">Create Story</button>
          </form>
        </ul>
      </div>
    );
  }
}



export default User;
