import React, { useState } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

export default function App() {
  // Estado para a tarefa criada recentemente
  const [newTask, setNewTask] = useState(null);

  // Função que será passada para o formulário,
  // para atualizar a lista ao criar tarefa
  const handleTaskAdded = (task) => {
    setNewTask(task);
  };

  return (
    <div>
      <h1>Minhas Tarefas</h1>
      <TaskForm onTaskAdded={handleTaskAdded} />
      <TaskList newTask={newTask} />
    </div>
  );
}
