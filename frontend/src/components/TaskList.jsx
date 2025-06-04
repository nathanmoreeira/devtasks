import React, { useEffect, useState } from 'react';

export default function TaskList({ newTask }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca tarefas do backend
  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:3001/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Quando receber uma nova tarefa pelo prop, adiciona na lista
  useEffect(() => {
    if (newTask) {
      setTasks((prev) => [...prev, newTask]);
    }
  }, [newTask]);

  if (loading) return <p>Carregando tarefas...</p>;

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          {task.title} {task.completed ? '(Concluída)' : ''}
        </li>
      ))}
    </ul>
  );
}
