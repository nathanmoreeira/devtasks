// Importa as bibliotecas necessárias
const express = require('express'); // Framework para criar APIs no Node.js
const cors = require('cors');       // Middleware para liberar requisições entre domínios (CORS)
const { PrismaClient } = require('@prisma/client'); // Cliente para conectar e manipular o banco com Prisma

// Inicializa o app Express e o cliente Prisma
const app = express();
const prisma = new PrismaClient();

// Configura middlewares
app.use(cors());           // Permite requisições de outras origens (ex: frontend em outra porta)
app.use(express.json());   // Permite que o Express entenda requisições com corpo JSON

// Rota raiz para teste rápido se o servidor está rodando
app.get('/', (req, res) => {
  res.send('API funcionando!');
});

// Rota para listar todas as tarefas (GET /tasks)
app.get('/tasks', async (req, res) => {
  // Busca todas as tarefas na tabela Task do banco
  const tasks = await prisma.task.findMany();
  // Envia o resultado em JSON para o frontend
  res.json(tasks);
});

// Rota para criar uma nova tarefa (POST /tasks)
app.post('/tasks', async (req, res) => {
  // Recebe o título da tarefa enviado no corpo da requisição
  const { title } = req.body;
  // Cria a tarefa no banco, "completed" é false por padrão
  const newTask = await prisma.task.create({
    data: { title },
  });
  // Retorna a tarefa criada em JSON
  res.json(newTask);
});

// Rota PATCH para atualizar título e status da tarefa pelo ID
app.patch('/tasks/:id', async (req, res) => {
  const taskId = Number(req.params.id); // pega o id da URL
  const { title, completed } = req.body; // pega dados para atualizar

  try {
    // Atualiza a tarefa no banco de dados
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        // Só atualiza os campos que vieram
        ...(title !== undefined && { title }),
        ...(completed !== undefined && { completed }),
      },
    });
    res.json(updatedTask); // envia a tarefa atualizada
  } catch (error) {
    // Se não encontrou a tarefa ou outro erro
    res.status(404).json({ error: 'Tarefa não encontrada ou erro ao atualizar' });
  }
});




// Rota para deletar uma tarefa pelo id
app.delete('/tasks/:id', async (req, res) => {
  const taskId = parseInt(req.params.id);

  try {
    await prisma.task.delete({
      where: { id: taskId },
    });
    res.json({ message: 'Tarefa deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
});

// Define a porta que o servidor vai escutar
const PORT = 3001;

// Inicia o servidor na porta definida
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
