
import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTodos(data);
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, completed: false })
    });
    if (res.ok) {
      setTitle('');
      setDescription('');
      fetchTodos();
    }
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description);
  };

  const handleUpdateTodo = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/${editingTodo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, completed: editingTodo.completed })
    });
    if (res.ok) {
      setEditingTodo(null);
      setTitle('');
      setDescription('');
      fetchTodos();
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const text = await res.text();
        alert('Delete failed: ' + res.status + ' ' + text);
        console.error('Delete failed:', res.status, text);
      } else {
        fetchTodos();
      }
    } catch (err) {
      alert('Delete failed: ' + err);
      console.error('Delete failed:', err);
    }
  };

  const handleToggleComplete = async (todo) => {
    await fetch(`${API_URL}/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: todo.title,
        description: todo.description,
        completed: !todo.completed
      })
    });
    fetchTodos();
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1><span className="logo-icon"> </span> Todo App</h1>
        <p className="subtitle">Boost your productivity with a beautiful task manager</p>
      </header>
      <main className="app-main center-content">
        <div className="card todo-form-card">
          <h2>{editingTodo ? 'Edit Task' : 'Add New Task'}</h2>
          <form className="todo-form" onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <button type="submit" className="btn-primary btn-rounded">{editingTodo ? 'Update' : 'Add'}</button>
            {editingTodo && (
              <button type="button" className="btn-secondary btn-rounded" onClick={() => { setEditingTodo(null); setTitle(''); setDescription(''); }}>Cancel</button>
            )}
          </form>
        </div>
        <div className="card todo-list-section">
          <h2>Your Tasks</h2>
          <ul className="todo-list">
            {todos.length === 0 && <div className="empty-list">No tasks yet. Add your first task!</div>}
            {todos.map(todo => (
              <li key={todo.id} className={`todo-item${todo.completed ? ' completed' : ''}`}> 
                <div className="todo-card">
                  <div className="todo-main">
                    <span onClick={() => handleToggleComplete(todo)} className="todo-title">
                      {todo.completed ? <span className="completed-icon">✅</span> : <span className="pending-icon">🕒</span>}
                      {todo.title}
                    </span>
                    <span className="todo-desc">{todo.description}</span>
                  </div>
                  <div className="todo-actions">
                    <button onClick={() => handleEditTodo(todo)} className="btn-edit btn-rounded">✏️ Edit</button>
                    <button onClick={() => handleDeleteTodo(todo.id)} className="btn-delete btn-rounded">🗑️ Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <footer className="app-footer">
        <p>Made with <span className="footer-heart">❤️</span> by Shubham Chavan &copy; 2026</p>
      </footer>
    </div>
  );
}

export default App;
