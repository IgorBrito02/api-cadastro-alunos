const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let alunos = [];

// Função para calcular a média e determinar a situação do aluno
function calcularMedia(aluno) {
    aluno.media = (aluno.primeiraNota + aluno.segundaNota) / 2;

    if (aluno.media >= 7) {
        aluno.situacao = 'aprovado';
    } else if (aluno.media >= 4) {
        aluno.situacao = 'recuperação';
    } else {
        aluno.situacao = 'reprovado';
    }
}

// Validação das notas
function validarNotas(nota) {
    return nota >= 0 && nota <= 10;
}

// Rota para cadastrar um aluno
app.post('/alunos', (req, res) => {
    const { nome, primeiraNota, segundaNota } = req.body;

    if (!validarNotas(primeiraNota) || !validarNotas(segundaNota)) {
        return res.status(400).send('Informe uma nota válida');
    }

    const novoAluno = {
        id: alunos.length + 1,
        nome,
        primeiraNota,
        segundaNota,
        media: 0,
        situacao: ''
    };

    calcularMedia(novoAluno);
    alunos.push(novoAluno);

    res.status(201).send(novoAluno);
});

// Rota para listar todos os alunos
app.get('/alunos', (req, res) => {
    res.send(alunos);
});

// Rota para alterar os dados de um aluno
app.put('/alunos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, primeiraNota, segundaNota } = req.body;

    const aluno = alunos.find(aluno => aluno.id == id);

    if (!aluno) {
        return res.status(404).send('Aluno não encontrado');
    }

    if (nome) aluno.nome = nome;
    if (validarNotas(primeiraNota)) aluno.primeiraNota = primeiraNota;
    if (validarNotas(segundaNota)) aluno.segundaNota = segundaNota;

    calcularMedia(aluno);

    res.send(aluno);
});

// Rota para deletar um aluno
app.delete('/alunos/:id', (req, res) => {
    const { id } = req.params;

    alunos = alunos.filter(aluno => aluno.id != id);

    res.send(`Aluno com id ${id} deletado`);
});

// Rota para retornar o nome e a média de um aluno pelo id
app.get('/alunos/:id', (req, res) => {
    const { id } = req.params;

    const aluno = alunos.find(aluno => aluno.id == id);

    if (!aluno) {
        return res.status(404).send('Aluno não encontrado');
    }

    res.send({ nome: aluno.nome, media: aluno.media });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});