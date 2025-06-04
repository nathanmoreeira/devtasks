import React from 'react';
import axios from 'axios';

// Componente que recebe a lista de tarefas e função de recarregamento
function TaskList({ tasks, fetchTasks }) {
  // Alterna o estado "concluído" de uma tarefa
  const toggleCompleted = async (task) => {
    try {
      await axios.patch(`http://localhost:3001/tasks/${task.id}`, {
        completed: !task.completed,
      });
      fetchTasks(); // Recarrega a lista após atualizar
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  // Deleta a tarefa
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${id}`);
      fetchTasks(); // Recarrega a lista após deletar
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  return (
    <ul>
      {tasks.map((task) => (
        <li
          key={task.id}
          style={{
            textDecoration: task.completed ? 'line-through' : 'none', // Risco se concluída
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span>{task.title}</span>

          {/* Botão para marcar como concluída */}
          <button onClick={() => toggleCompleted(task)}>
            {task.completed ? 'Desfazer' : 'Concluir'}
          </button>

          {/* Botão para deletar a tarefa */}
          <button onClick={() => deleteTask(task.id)} style={{ color: 'red' }}>
            Deletar
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;