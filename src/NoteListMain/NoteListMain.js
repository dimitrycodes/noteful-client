import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Note from '../Note/Note';
import CircleButton from '../CircleButton/CircleButton';
import ApiContext from '../ApiContext';
import { getNotesForFolder } from '../notes-helpers';
import './NoteListMain.css';
import PropTypes from 'prop-types'

export default class NoteListMain extends React.Component {
  state = {
    notes: [],
  };
  static defaultProps = {
    match: {
      params: {},
    },
  };
  static contextType = ApiContext;

  componentDidUpdate(prevProps, prevState) {
    const { notes } = this.context;
    if (notes !== this.state.notes) {
      this.setState({ notes });
    }
  }

  onDeleteNote(noteId) {
    this.setState({
      notes: this.state.notes.filter((note) => note.id !== noteId),
    });
  }

  render() {
    const { folderId } = this.props.match.params;
    const { notes } = this.state;
    const notesForFolder = getNotesForFolder(notes, folderId);
    return (
      <section className='NoteListMain'>
        <ul>
          {notesForFolder.map((note) => (
            <li key={note.id}>
              <Note
                id={note.id}
                name={note.name}
                modified={note.modified}
                onDeleteNote={this.onDeleteNote}
              />
            </li>
          ))}
        </ul>
        <div className='NoteListMain__button-container'>
          <CircleButton
            tag={Link}
            to='/add-note'
            type='button'
            className='NoteListMain__add-note-button'
          >
            <FontAwesomeIcon icon='plus' />
            <br />
            Note
          </CircleButton>
        </div>
      </section>
    );
  }
}

NoteListMain.propTypes = {
  match: PropTypes.shape({params:PropTypes.shape({folderId:PropTypes.string.isRequired})})
}
