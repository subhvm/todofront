import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './todo.css';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editMode, setEditMode] = useState({ id: null, title: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [username, setUsername] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');

        if (!token) {
          navigate('/login');
          return;
        }

        if (storedUsername) {
          setUsername(storedUsername);
        }

        const response = await axios.get('https://todo-back-8c7n.onrender.com/api/todo', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTodos(response.data);
      } catch (err) {
        setError('You do not have any todos.');
      } finally {
        setFetching(false);
      }
    };

    fetchTodos();
  }, [navigate]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setError('Please enter a title.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://todo-back-8c7n.onrender.com/api/todo',
        { title: newTitle, description: newDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTodos([...todos, response.data]);
      setNewTitle('');
      setNewDescription('');
      setError('');
    } catch (err) {
      setError('Failed to add todo.');
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateTodo = async (e) => {
    e.preventDefault();
    const { id, title, description } = editMode;
  
    if (!title.trim()) {
      setError('Please enter a title.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `https://todo-back-8c7n.onrender.com/api/todo/${id}`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      setEditMode({ id: null, title: '', description: '' });
      setError('');
    } catch (err) {
      setError('Failed to update todo.');
    }
  };
  
  const handleToggleComplete = async (id, completed) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `https://todo-back-8c7n.onrender.com/api/todo/${id}`,
        { completed: !completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
    } catch (err) {
      setError('Failed to update todo.');
    }
  };
  
  const handleEditTodo = (id, title, description) => {
    setEditMode({ id, title, description });
  };
  
  const handleDeleteTodo = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://todo-back-8c7n.onrender.com/api/todo/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      setError('Failed to delete todo.');
    }
  };
  
  // Other handlers remain unchanged...

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
    window.location.reload();
  };

  if (fetching) {
    return <p style={{ textAlign: 'center' }}>Loading todos...</p>;
  }

  return (
    <div>
      <div className="user-info">
          {username}
        </div>
    
    <div className="todo-container">
     

      <h2 className="title">tick-r</h2>
      {error && <p className="error-message">{error}</p>}

      {/* Add or Edit Form */}
      <form onSubmit={editMode.id ? handleUpdateTodo : handleAddTodo} className="todo-form">
        <input
          type="text"
          value={editMode.id ? editMode.title : newTitle}
          onChange={(e) =>
            editMode.id ? setEditMode({ ...editMode, title: e.target.value }) : setNewTitle(e.target.value)
          }
          placeholder="Enter title"
          className="input-field"
        />
        <input
          value={editMode.id ? editMode.description : newDescription}
          onChange={(e) =>
            editMode.id ? setEditMode({ ...editMode, description: e.target.value }) : setNewDescription(e.target.value)
          }
          placeholder="Enter description"
          className="input-field"
        />
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? (editMode.id ? 'Updating...' : 'Adding...') : editMode.id ? 'Update Todo' : 'Add Todo'}
        </button>
      </form>

      {/* Display Todos */}
      <ul className="todo-list">
        {todos.length === 0 ? (
          <p className="no-todos-message">No todos available. Add a new task!</p>
        ) : (
          todos.map((todo) => (
            <li key={todo._id} className="todo-item">
              <div>
                <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                  <strong>{todo.title}</strong>
                </span>
                <p className="todo-description">{todo.description}</p>
              </div>
              <div className="button-group">
                <button
                  className={`toggle-button ${todo.completed ? 'completed' : ''}`}
                  onClick={() => handleToggleComplete(todo._id, todo.completed)}
                >
                  {todo.completed ? 'Mark Incomplete ❌' : 'Mark Complete ✅'}
                </button>
                <button className="edit-button" onClick={() => handleEditTodo(todo._id, todo.title, todo.description)}>
                  ✏️ Edit
                </button>
                <button className="delete-button" onClick={() => handleDeleteTodo(todo._id)}>
                  Delete 🗑️
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
       
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
    </div>
    
    
    </div>
    
  );
}

export default TodoApp;
