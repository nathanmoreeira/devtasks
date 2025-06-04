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

// Rota para atualizar o status de conclusão da tarefa (PUT /tasks/:id)
app.put('/tasks/:id', async (req, res) => {
  // Pega o id da tarefa da URL (ex: /tasks/3)
  const { id } = req.params;
  // Pega o novo valor de "completed" do corpo da requisição
  const { completed } = req.body;
  // Atualiza o campo "completed" da tarefa no banco
  const updatedTask = await prisma.task.update({
    where: { id: Number(id) },
    data: { completed },
  });
  // Retorna a tarefa atualizada
  res.json(updatedTask);
});

// Rota para deletar uma tarefa (DELETE /tasks/:id)
app.delete('/tasks/:id', async (req, res) => {
  // Pega o id da tarefa da URL
  const { id } = req.params;
  // Deleta a tarefa no banco
  await prisma.task.delete({
    where: { id: Number(id) },
  });
  // Retorna uma mensagem simples confirmando a deleção
  res.json({ message: 'Tarefa deletada' });
});

// Define a porta que o servidor vai escutar
const PORT = 3001;

// Inicia o servidor na porta definida
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
