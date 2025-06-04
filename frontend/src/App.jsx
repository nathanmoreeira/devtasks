import React, { useEffect, useState } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import axios from 'axios';

export default function App() {
  const [tasks, setTasks] = useState([]); // Lista de tarefas

  // Função para buscar tarefas no backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/tasks');
      setTasks(response.data); // Atualiza o estado com as tarefas
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  // Roda a função ao carregar o app
  useEffect(() => {
    fetchTasks();
  }, []);

  // Quando uma nova tarefa é adicionada, recarrega a lista
  const handleTaskAdded = () => {
    fetchTasks();
  };

  return (
    <div>
      <h1>Minhas Tarefas</h1>
      <TaskForm onTaskAdded={handleTaskAdded} />
      <TaskList tasks={tasks} fetchTasks={fetchTasks} />
    </div>
  );
}
