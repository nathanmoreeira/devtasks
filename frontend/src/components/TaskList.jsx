import React, { useState } from 'react';
import axios from 'axios';

function TaskList({ tasks, fetchTasks }) {
  const [filter, setFilter] = useState('all'); // Estado para o filtro

  // Função para alternar status da tarefa
  const toggleCompleted = async (task) => {
    try {
      await axios.patch(`http://localhost:3001/tasks/${task.id}`, {
        completed: !task.completed,
      });
      fetchTasks(); // Recarrega as tarefas após a alteração
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  // Função para deletar uma tarefa
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${id}`);
      fetchTasks(); // Recarrega as tarefas após exclusão
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  };

  // Filtra as tarefas de acordo com o filtro selecionado
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true; // 'all'
  });

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        {/* Botões de filtro */}
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
            <span
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                marginLeft: '8px',
              }}
            >
              {task.title}
            </span>
            <button
              style={{ marginLeft: '10px', color: 'red' }}
              onClick={() => deleteTask(task.id)}
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
