import React, { useState } from 'react';
import axios from 'axios';

function TaskList({ tasks, fetchTasks }) {
  const [filter, setFilter] = useState('all'); // filtro atual
  const [editTaskId, setEditTaskId] = useState(null); // id da tarefa que está sendo editada
  const [editTitle, setEditTitle] = useState(''); // título temporário da edição

  // Função auxiliar para formatar a data em formato legível (pt-BR)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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

  // Começa a editar tarefa
  const startEditing = (task) => {
    setEditTaskId(task.id);
    setEditTitle(task.title);
  };

  // Cancela a edição
  const cancelEditing = () => {
    setEditTaskId(null);
    setEditTitle('');
  };

  // Salva a edição
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
    return true; // todas
  });

  return (
    <div>
      {/* Botões para filtro de tarefas */}
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setFilter('all')}>Todas</button>
        <button onClick={() => setFilter('completed')}>Concluídas</button>
        <button onClick={() => setFilter('pending')}>Pendentes</button>
      </div>

      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id} style={{ marginBottom: '12px' }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompleted(task)}
            />

            {/* Se estiver editando, mostra input e botões de ação */}
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
              // Caso contrário, exibe título e data formatada
              <div style={{ display: 'inline-block', marginLeft: '8px' }}>
                <div
                  style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    fontWeight: 'bold',
                  }}
                >
                  {task.title}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  Criada em: {formatDate(task.createdAt)}
                </div>
              </div>
            )}

            {/* Botões editar e excluir */}
            {editTaskId !== task.id && (
              <>
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
