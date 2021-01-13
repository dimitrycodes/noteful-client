import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NotefulForm from '../NotefulForm/NotefulForm';
import ApiContext from '../ApiContext';
import config from '../config';
import './AddNote.css';

class AddNote extends Component {
  state = {
    validName: false,
    validContent: false,
    validFolder: false,
  };

  static defaultProps = {
    history: {
      push: () => {},
    },
  };
  static contextType = ApiContext;

  handleSubmit = (e) => {
    e.preventDefault();
    const newNote = {
      title: e.target['note_name'].value,
      content: e.target['note_content'].value,
      folderId: e.target['note-folder-id'].value,
      modified: new Date(),
    };
    if (!newNote.title) {
      this.setState({ validName: true });
    } else {
      this.setState({ validName: false });
    }

    if (!newNote.content) {
      this.setState({ validContent: true });
    } else {
      this.setState({ validContent: false });
    }
    console.log('object', newNote.folderId);
    if (!newNote.folderId) {
      this.setState({ validFolder: true });
    } else {
      this.setState({ validFolder: false });
    }

    if (newNote.title && newNote.content && newNote.folderId) {
      fetch(`${config.API_ENDPOINT}/notes`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(newNote),
      })
        .then((res) => {
          if (!res.ok) return res.json().then((e) => Promise.reject(e));
          return res.json();
        })
        .then((note) => {
          this.props.history.push(`/folder/${note.folderId}`);
          window.location.reload();
        })
        .catch((error) => {
          console.error({ error });
        });
    }
  };

  render() {
    const { folders = [] } = this.context;
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='note-name'>Name</label>
            <input type='text' id='note-name' name='note_name' />
            {this.state.validName && (
              <p style={{ color: 'red' }}>Name is required</p>
            )}
          </div>
          <div className='field'>
            <label htmlFor='note-content'>Content</label>
            <textarea id='note-content' name='note_content' />
            {this.state.validContent && (
              <p style={{ color: 'red' }}>Content is required</p>
            )}
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>Folder</label>
            <select id='note-folder-select' name='note-folder-id'>
              <option value=''>Select Folder</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
            {this.state.validFolder && (
              <p style={{ color: 'red' }}>Folder is required</p>
            )}
          </div>
          <div className='buttons'>
            <button type='submit'>Add note</button>
          </div>
        </NotefulForm>
      </section>
    );
  }
}

AddNote.propTypes = {
  history: PropTypes.object,
};

export default AddNote;
