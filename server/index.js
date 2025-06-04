// Importa as bibliotecas necessárias
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rota raiz para teste
app.get('/', (req, res) => {
  res.send('API funcionando!');
});

// Listar todas as tarefas (GET /tasks)
// Agora retorna também as datas createdAt e dueDate
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    console.log(tasks);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
});


app.post('/tasks', async (req, res) => {
  const { title } = req.body;

  try {
    const newTask = await prisma.task.create({
      data: { title }, // createdAt será gerado automaticamente
    });
    res.json(newTask);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
});



// Atualizar tarefa pelo ID (PATCH /tasks/:id)
// Permite alterar title, completed e dueDate
app.patch('/tasks/:id', async (req, res) => {
  const taskId = Number(req.params.id);
  const { title, completed, dueDate } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title !== undefined && { title }),
        ...(completed !== undefined && { completed }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(404).json({ error: 'Tarefa não encontrada ou erro ao atualizar' });
  }
});

// Deletar tarefa (DELETE /tasks/:id)
app.delete('/tasks/:id', async (req, res) => {
  const taskId = Number(req.params.id);
  try {
    await prisma.task.delete({ where: { id: taskId } });
    res.json({ message: 'Tarefa deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
});

// Define a porta do servidor
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
