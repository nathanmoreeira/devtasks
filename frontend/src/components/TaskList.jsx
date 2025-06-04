import React, { useState } from 'react';
import axios from 'axios';

function TaskList({ tasks, fetchTasks }) {
  const [filter, setFilter] = useState('all'); // filtro atual
  const [editTaskId, setEditTaskId] = useState(null); // id da tarefa que está sendo editada
  const [editTitle, setEditTitle] = useState(''); // título temporário da edição

  // Alterna o status concluído da tarefa
  const toggleCompleted = async (task) => {
    try {
      await axios.patch(`http://localhost:3001/tasks/${task.id}`, {
        completed: !task.completed,
      });
      fetchTasks();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  // Deleta tarefa
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  };

  // Começa a editar tarefa, define id e título atual
  const startEditing = (task) => {
    setEditTaskId(task.id);
    setEditTitle(task.title);
  };

  // Cancela edição
  const cancelEditing = () => {
    setEditTaskId(null);
    setEditTitle('');
  };

  // Salva edição da tarefa no backend
  const saveEditing = async () => {
    try {
      await axios.patch(`http://localhost:3001/tasks/${editTaskId}`, {
        title: editTitle,
      });
      setEditTaskId(null);
      setEditTitle('');
      fetchTasks();
    } catch (error) {
      console.error('Erro ao salvar edição:', error);
    }
  };

  // Filtra as tarefas de acordo com o filtro selecionado
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true; // all
  });

  return (
    <div>
      {/* Botões de filtro */}
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setFilter('all')}>Todas</button>
        <button onClick={() => setFilter('completed')}>Concluídas</button>
        <button onClick={() => setFilter('pending')}>Pendentes</button>
      </div>

      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id} style={{ marginBottom: '8px' }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompleted(task)}
            />

            {/* Se estiver editando esta tarefa, mostra input */}
            {editTaskId === task.id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{ marginLeft: '8px' }}
                />
                <button onClick={saveEditing} style={{ marginLeft: '8px' }}>
                  Salvar
                </button>
                <button onClick={cancelEditing} style={{ marginLeft: '4px' }}>
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    marginLeft: '8px',
                  }}
                >
                  {task.title}
                </span>
                <button
                  onClick={() => startEditing(task)}
                  style={{ marginLeft: '10px' }}
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{ marginLeft: '10px', color: 'red' }}
                >
                  Excluir
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
