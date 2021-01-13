import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NotefulForm from '../NotefulForm/NotefulForm';
import ApiContext from '../ApiContext';
import config from '../config';

import './AddFolder.css';

class AddFolder extends Component {
  state = {
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
    const name = e.target['folder_name'].value;
    if (!name) {
      this.setState({ validFolder: true });
    } else {
      const folder = {
        name,
      };
      console.log('object', folder);
      this.setState({ validFolder: false });

      fetch(`${config.API_ENDPOINT}/folders`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(folder),
      })
        .then((res) => {
          if (!res.ok) return res.json().then((e) => Promise.reject(e));
          return res.json();
        })
        .then((folder) => {
          this.props.history.push(`/folder/${folder.id}`);
          window.location.reload();
        })
        .catch((error) => {
          console.error({ error });
        });
    }
  };

  render() {
    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='folder-name'>Name</label>
            <input type='text' id='folder-name' name='folder_name' />
            {this.state.validFolder && (
              <p style={{ color: 'red' }}>Empty folder name don't accept</p>
            )}
          </div>
          <div className='buttons'>
            <button type='submit'>Add folder</button>
          </div>
        </NotefulForm>
      </section>
    );
  }
}

AddFolder.propTypes = {
  history: PropTypes.object,
};

export default AddFolder;
