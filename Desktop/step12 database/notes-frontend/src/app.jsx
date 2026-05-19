import { useEffect, useState } from "react";
import noteService from "./services/notes";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    noteService.getAll().then(data => setNotes(data));
  }, []);

  const addNote = (e) => {
    e.preventDefault();

    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    };

    noteService.create(noteObject).then(returnedNote => {
      setNotes(notes.concat(returnedNote));
      setNewNote("");
    });
  };

  const deleteNote = (id) => {
    noteService.remove(id).then(() => {
      setNotes(notes.filter(n => n.id !== id));
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Notes App</h1>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {notes.map(note => (
          <li key={note.id}>
            {note.content} ({note.important ? "important" : "not important"})
            <button onClick={() => deleteNote(note.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;