import { useEffect, useState } from "react"
import noteService from "./services/notes"
import "./App.css"

function App() {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")

  // LOAD NOTES
  useEffect(() => {
    noteService.getAll().then(data => setNotes(data))
  }, [])

  // ADD NOTE
  const addNote = (e) => {
    e.preventDefault()

    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }

    noteService.create(noteObject)
      .then(returnedNote => {
        // IMPORTANT FIX 👇 use functional state update
        setNotes(prevNotes => prevNotes.concat(returnedNote))
        setNewNote("")
      })
      .catch(error => {
        console.error("Error adding note:", error)
      })
  }

  // DELETE NOTE
  const deleteNote = (id) => {
    noteService.remove(id).then(() => {
      setNotes(prevNotes => prevNotes.filter(n => n.id !== id))
    })
    .catch(error => {
      console.error("Error deleting note:", error)
    })
  }

  return (
    <div className="notes-page">
      <div className="notes-card">
        <h1>Notes</h1>

        {/* FORM */}
        <form className="notes-form" onSubmit={addNote}>
          <input
            className="notes-input"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a new note..."
          />

          <button className="btn btn-add" type="submit">
            Add
          </button>
        </form>

        {/* LIST */}
        <ul className="notes-list">
          {notes.map(note => (
            <li className="note-item" key={note.id}>
              <span className="note-content">{note.content}</span>

              <span className={
                note.important
                  ? "note-badge note-badge-important"
                  : "note-badge note-badge-normal"
              }>
                {note.important ? "important" : "not important"}
              </span>

              <button
                className="btn btn-delete"
                onClick={() => deleteNote(note.id)}
              >
                delete
              </button>
            </li>
          ))}
        </ul>

      </div>
    </div>
  )
}

export default App