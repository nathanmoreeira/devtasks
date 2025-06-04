import React, { useState } from 'react';

// Componente para criar uma nova tarefa
export default function TaskForm({ onTaskAdded }) {
  // Estado para o título da tarefa
  const [title, setTitle] = useState('');
  // Estado para indicar se está enviando
  const [loading, setLoading] = useState(false);

  // Função chamada ao enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // evita recarregar a página

    if (title.trim() === '') return; // não envia título vazio

    setLoading(true);

    try {
      // Envia POST para a API para criar a tarefa
      const res = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, completed: false }),
      });

      if (!res.ok) {
        throw new Error('Erro ao criar tarefa');
      }

      const newTask = await res.json();

      // Limpa o campo
      setTitle('');
      // Chama a função para atualizar a lista no componente pai
      onTaskAdded(newTask);
    } catch (error) {
      console.error(error);
      alert('Erro ao criar tarefa, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nova tarefa"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
      />
      <button type="submit" disabled={loading || title.trim() === ''}>
        {loading ? 'Salvando...' : 'Adicionar'}
      </button>
    </form>
  );
}
