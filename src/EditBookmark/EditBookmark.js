import React, { Component } from 'react'; 
import config from '../config'
import BookmarksContext from '../BookmarksContext'
import './EditBookmark.css'

export default class EditBookmark extends Component {


  static contextType = BookmarksContext

  state = {
    id: '',
    title: '',
    description: '',
    url: '', 
    rating: 1, 
    error: null, 
  }


  componentDidMount() {
    const { bookmarkId } = this.props.match.params
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(error => Promise.reject(error))

        return res.json()
      })
      .then(responseData => {
        this.setState({
          id: responseData.id,
          title: responseData.title,
          url: responseData.url,
          description: responseData.description,
          rating: responseData.rating,
        })
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

  handleChangeTitle = e => {
    this.setState({ title: e.target.value})
  }

  handleChangeUrl = e => {
    this.setState({ url: e.target.value})
  }

  handleChangeDescription = e => {
    this.setState({ description: e.target.value})
  }

  handleChangeRating = e => {
    this.setState({ rating: e.target.value})
  }

  cancel = e => {
    this.props.history.push('/')
  }

  handleSubmit = e => {
    e.preventDefault()
    const { bookmarkId } = this.props.match.params
    const { id, title, url, description, rating } = this.state
    const newBookmark = { id, title, url, description, rating }
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'PATCH',
      body: JSON.stringify(newBookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${config.API_KEY}`
      },
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(error => Promise.reject(error))
      })
      .then(() => {
        this.resetFields(newBookmark)
        this.context.updateBookmark(newBookmark)
        this.props.history.push('/')
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

  resetFields = (newFields) => {
    this.setState({
      id: newFields.id || '',
      title: newFields.title || '',
      url: newFields.url || '',
      description: newFields.description || '',
      rating: newFields.rating || '',
    })
  }


  render() {
    const {title, id, url, description, error, rating } = this.context
    return (
    <div>
      <h1>Edit Bookmark</h1>
      <form className="EditBookmark__form" onSubmit={this.handleSubmit}> 
        <label htmlFor="title">Title
          <input type="text" name="title" id="title" value={title} onChange={this.handleChangeTitle}></input>
        </label>
        <label htmlFor="url">Url
          <input type="text" name="url" id="url" value={url} onChange={this.handleChangeUrl}></input>
        </label>
        <label htmlFor="description">Description
          <input type="text" name="description" id="description" value={description} onChange={this.handleChangeDescription}></input>
        </label>
        <label htmlFor="rating">Rating
         <input onChange={this.handleChangeRating}
              type='number'
              name='rating'
              id='rating'
              value= {rating}
              min='1'
              max='5'
              required
            />
        </label>
        <div className="EditBookmark__buttons">
          <button onClick={this.cancel}>
            Cancel
          </button>
          <button type = "submit">
            Update
          </button>
        </div>
      </form>
      <div>
        <p>{error}</p>
      </div>
    </div>
    )
  }
}
