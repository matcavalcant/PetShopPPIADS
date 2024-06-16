import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const host = '0.0.0.0';
const porta = 3000;

let listarInteressados = [];
let listarPets = [];
let listarAdocao = [];

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'Ch4v3S3cr3t4',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 15
    }
}));

app.use(cookieParser());

function usuarioEstaAutenticado(requisicao, resposta, next) {
    if (requisicao.session.usuarioAutenticado) {
        next();
    } else {
        resposta.redirect('/login.html');
    }
}

function cadastroClientes(requisicao, resposta) {
    const nome = requisicao.body.nome;
    const email = requisicao.body.email;
    const fone = requisicao.body.fone;

    if (nome && email && fone) {
        listarInteressados.push({
            nome: nome,
            email: email,
            fone: fone
        });
        resposta.redirect('/listarInteressados');
    } else {
        resposta.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de clientes interessados</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        </head>
        <body>
            <div class="container m-2">
                <legend>Cadastro de clientes interessados</legend>
                <form method="POST" action='/cadastroClientes'>
                    <div class="border form-row">
                        <div class="col-md-4 mb-3">
                            <label for="nome">Nome</label>
                            <input type="text" class="form-control" id="nome" name="nome" value="${nome || ''}" placeholder="Nome">
                            ${nome === '' ? '<div class="alert alert-danger" role="alert">Informe o Nome!</div>' : ''}
                        </div>
                        <div class="col-md-4 mb-3">
                            <label for="email">Email</label>
                            <input type="text" class="form-control" id="email" name="email" value="${email || ''}" placeholder="Email" required>
                            ${email === '' ? '<div class="alert alert-danger" role="alert">Informe o email!</div>' : ''}
                        </div>
                        <div class="col-md-4 mb-3">
                            <label for="fone">Telefone</label>
                            <input type="text" class="form-control" id="fone" name="fone" value="${fone || ''}" placeholder="Telefone" required>
                            ${fone === '' ? '<div class="alert alert-danger" role="alert">Informe o telefone!</div>' : ''}
                        </div>
                        <button class="btn btn-primary" type="submit">Finalizar Cadastro</button>
                        <a class="btn btn-secondary" href="/">Voltar</a>
                    </div>
                </form>
            </div>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </html>`);
    }
    resposta.end();
}

app.get('/listarInteressados', usuarioEstaAutenticado, (req, resp) => {
    resp.write(`
        <!DOCTYPE html>
        <html lang="pt">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Lista de Clientes Interessados</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        </head>
        <body>
            <div class="container">
                <h2 class="text-center">Lista de pessoas interessadas</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Nome</th>
                            <th scope="col">Email</th>
                            <th scope="col">Telefone</th>
                        </tr>
                    </thead>
                    <tbody>`);

    listarInteressados.forEach(cliente => {
        resp.write(`
            <tr>
                <td>${cliente.nome}</td>
                <td>${cliente.email}</td>
                <td>${cliente.fone}</td>
            </tr>
        `);
    });

    resp.write(`
                    </tbody>
                </table>
                <a href="/cadastroClientes.html" class="text-center" style="text-decoration: none;">Voltar para página de cadastro</a><br>
                <a href="/index.html" class="text-center" style="text-decoration: none;">Voltar para o menu</a>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </body>
        </html>`);

    resp.end();
});

function cadastroPets(req, resp) {
    const nomepet = req.body.nomepet;
    const raca = req.body.raca;
    const idade = req.body.idade;

    if (nomepet && raca && idade) {
        listarPets.push({
            nomepet: nomepet,
            raca: raca,
            idade: idade
        });
        resp.redirect('/listarPets');
    } else {
        resp.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Pets para adoção</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        </head>
        <body>
            <div class="container m-2">
                <legend>Cadastro de Pets para adoção</legend>
                <form method="POST" action='/cadastroPets'>
                    <div class="border form-row">
                        <div class="col-md-4 mb-3">
                            <label for="nomepet">Nome</label>
                            <input type="text" class="form-control" id="nomepet" name="nomepet" value="${nomepet || ''}" placeholder="Nome do Pet">
                            ${nomepet === '' ? '<div class="alert alert-danger" role="alert">Informe o Nome do Pet!</div>' : ''}
                        </div>
                        <div class="col-md-4 mb-3">
                            <label for="raca">Raça</label>
                            <input type="text" class="form-control" id="raca" name="raca" value="${raca || ''}" placeholder="Raça" required>
                            ${raca === '' ? '<div class="alert alert-danger" role="alert">Informe a raça do Pet!</div>' : ''}
                        </div>
                        <div class="col-md-4 mb-3">
                            <label for="idade">Idade</label>
                            <input type="text" class="form-control" id="idade" name="idade" value="${idade || ''}" placeholder="Idade" required>
                            ${idade === '' ? '<div class="alert alert-danger" role="alert">Informe a idade do Pet!</div>' : ''}
                        </div>
                        <button class="btn btn-primary" type="submit">Finalizar Cadastro</button>
                        <a class="btn btn-secondary" href="/">Voltar</a>
                    </div>
                </form>
            </div>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </html>`);
    }
    resp.end();
}

app.post('/cadastroPets', usuarioEstaAutenticado, cadastroPets);

app.get('/listarPets', usuarioEstaAutenticado, (req, resp) => {
    resp.write(`
        <!DOCTYPE html>
        <html lang="pt">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Lista de Pets para adoção</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        </head>
        <body>
            <div class="container">
                <h2 class="text-center">Lista de Pets para adoção</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Nome</th>
                            <th scope="col">Raça</th>
                            <th scope="col">Idade</th>
                        </tr>
                    </thead>
                    <tbody>`);

    listarPets.forEach(pet => {
        resp.write(`
            <tr>
                <td>${pet.nomepet}</td>
                <td>${pet.raca}</td>
                <td>${pet.idade}</td>
            </tr>
        `);
    });

    resp.write(`
                    </tbody>
                </table>
                <a href="/cadastroPets.html" class="text-center" style="text-decoration: none;">Voltar para página de cadastro</a><br>
                <a href="/index.html" class="text-center" style="text-decoration: none;">Voltar para o menu</a>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </body>
        </html>`);

    resp.end();
});

function adotarPets(req, resp) {
    const nomepet = req.body.nomepet;
    const nomecliente = req.body.nomecliente;
    const telefonecliente = req.body.telefonecliente;

    if (nomepet && nomecliente && telefonecliente) {
        listarAdocao.push({
            nomepet: nomepet,
            nomecliente: nomecliente,
            telefonecliente: telefonecliente
        });
        resp.redirect('/listarAdocao');
    } else {
        resp.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Adoção de Pets</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
            </head>
            <body>
                <div class="container m-2">
                    <legend>Adoção de Pets</legend>
                    <form method="POST" action='/adotarPets'>
                        <div class="border form-row">
                            <div class="col-md-4 mb-3">
                                <label for="nomepet">Nome do Pet</label>
                                <input type="text" class="form-control" id="nomepet" name="nomepet" value="${nomepet || ''}" placeholder="Nome do Pet">
                                ${nomepet === '' ? '<div class="alert alert-danger" role="alert">Informe o Nome do Pet!</div>' : ''}
                            </div>
                            <div class="col-md-4 mb-3">
                                <label for="nomecliente">Nome do Cliente</label>
                                <input type="text" class="form-control" id="nomecliente" name="nomecliente" value="${nomecliente || ''}" placeholder="Nome do Cliente" required>
                                ${nomecliente === '' ? '<div class="alert alert-danger" role="alert">Informe o Nome do Cliente!</div>' : ''}
                            </div>
                            <div class="col-md-4 mb-3">
                                <label for="telefonecliente">Telefone do Cliente</label>
                                <input type="text" class="form-control" id="telefonecliente" name="telefonecliente" value="${telefonecliente || ''}" placeholder="Telefone do Cliente" required>
                                ${telefonecliente === '' ? '<div class="alert alert-danger" role="alert">Informe o Telefone do Cliente!</div>' : ''}
                            </div>
                            <button class="btn btn-primary" type="submit">Finalizar Adoção</button>
                            <a class="btn btn-secondary" href="/">Voltar</a>
                        </div>
                    </form>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
            </body>
            </html>`);
        resp.end();
    }
}


app.post('/adotarPets', usuarioEstaAutenticado, adotarPets);

app.get('/listarAdocao', usuarioEstaAutenticado, (req, resp) => {
    resp.write(`
        <!DOCTYPE html>
        <html lang="pt">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Lista de Adoções</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        </head>
        <body>
            <div class="container">
                <h2 class="text-center">Lista de Adoções</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Nome do Pet</th>
                            <th scope="col">Nome do Cliente</th>
                            <th scope="col">Telefone do Cliente</th>
                        </tr>
                    </thead>
                    <tbody>`);

    listarAdocao.forEach(adocao => {
        resp.write(`
            <tr>
                <td>${adocao.nomepet}</td>
                <td>${adocao.nomecliente}</td>
                <td>${adocao.telefonecliente}</td>
            </tr>
        `);
    });

    resp.write(`
                    </tbody>
                </table>
                <a href="/adotarPets.html" class="text-center" style="text-decoration: none;">Voltar para página de adoção</a><br>
                <a href="/index.html" class="text-center" style="text-decoration: none;">Voltar para o menu</a>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </body>
        </html>`);

    resp.end();
});

app.get('/index.html', (req, resp) => {
    
    resp.write(`
        <!DOCTYPE html>
        <html lang="pt">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Menu - Cadastro</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
            </head>
            <body>
            <link rel="stylesheet" href="style.css">
            <ul class="nav justify-content-center">
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="\">Pagina inicial</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="cadastroClientes.html">Cadastro de Clientes</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/cadastroPets.html">Cadastro de pets para adoção</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/adotarPets.html">Adotar Pet</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link disabled" href="/logout">Sair</a>
                </li>
            </ul>
             `);
             resp.write(` 
                    <script src=<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"></script>
                </body>
                </html>
                `);
            });
            
function autenticarUsuario(requisicao, resposta){
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if (usuario == 'admin' && senha == '123'){
        requisicao.session.usuarioAutenticado = true;
        resposta.cookie('dataUltimoAcesso', new Date().toLocaleString(),{
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30
        });
        resposta.redirect('/');
    }
    else{
        resposta.write('<!DOCTYPE html>');
        resposta.write('<html>');
        resposta.write('<head>');
        resposta.write('<meta charset="UTF-8">');
        resposta.write('<title>Falha ao realizar login</title>');
        resposta.write('</head>');
        resposta.write('<body>');
        resposta.write('<p>Usuário ou senha inválidos!</p>');
        resposta.write('<a href="/login.html">Voltar</a>');
        if (requisicao.cookies.dataUltimoAcesso){
            resposta.write('<p>');
            resposta.write('Seu último acesso foi em ' + requisicao.cookies.dataUltimoAcesso);
            resposta.write('</p>');
        }
        resposta.write('</body>');
        resposta.write('</html>');
        resposta.end();
    }
}
app.post('/login', autenticarUsuario);

app.get('/login', (req,resp)=>{
    resp.redirect('/login.html');
});

app.get('/logout', (req,resp)=>{
    req.session.destroy();
    resp.redirect('/login.html');
});

app.use(express.static(path.join(process.cwd(), 'publico')));

app.use(usuarioEstaAutenticado, express.static(path.join(process.cwd(), 'protegido')));
app.post('/cadastroClientes', cadastroClientes);
app.post('/cadastroPets', cadastroPets);
app.post('/listarAdocao', adotarPets);

app.post('/cadastroClientes', usuarioEstaAutenticado, cadastroClientes);

app.get('/listarInteressados', usuarioEstaAutenticado, (req,resp)=>{
    resp.write('<html>');
    resp.write('<head>');
    resp.write('<title>Cadastro</title>');
    resp.write('<meta charset="utf-8">');
    resp.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">')
    resp.write('</head>');
    resp.write('<body>');
    resp.write('<h1>Lista de Clientes</h1>');
    resp.write('<table class="table table-striped">');
    resp.write('<tr>');
    resp.write('<th>Nome</th>');
    resp.write('<th>Email</th>');
    resp.write('<th>Telefone</th>');
    resp.write('</tr>');
    for (let i=0; i<listarInteressados.length; i++){
        resp.write('<tr>');
        resp.write(`<td>${listarInteressados[i].nome}`);
        resp.write(`<td>${listarInteressados[i].email}`);
        resp.write(`<td>${listarInteressados[i].fone}`);
        resp.write('</tr>');
    }
    resp.write('</table>');
    resp.write('<a href="/">Voltar</a>');
    resp.write('</body>');
    if (req.cookies.dataUltimoAcesso){
        resp.write('<p>');
        resp.write('Seu último acesso foi em ' + req.cookies.dataUltimoAcesso);
        resp.write('</p>');
    }
    resp.write('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>')
    resp.write('</html>');
    resp.end();
});

app.listen(porta,host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
})