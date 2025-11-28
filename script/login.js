// =========================
//  BANCO DE USUÁRIOS
// =========================

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

// Criar conta admin se não existir
if (!usuarios.some(u => u.email === "admin")) {
    usuarios.push({
        nome: "Administrador",
        email: "admin",
        senha: "admin"
    });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// =========================
//  LOGIN
// =========================

function login() {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!email || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    const user = usuarios.find(u => u.email === email && u.senha === senha);

    if (!user) {
        alert("Usuário ou senha incorretos!");
        return;
    }

    alert("Login realizado com sucesso!");
    window.location.href = "calendar.html";
}

// =========================
//  CADASTRO
// =========================

function cadastrar() {
    const nome = document.getElementById("novoNome").value.trim();
    const email = document.getElementById("novoEmail").value.trim();
    const senha = document.getElementById("novaSenha").value.trim();

    if (!nome || !email || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    if (usuarios.some(u => u.email === email)) {
        alert("Esse e-mail já está cadastrado!");
        return;
    }

    usuarios.push({ nome, email, senha });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Cadastro realizado com sucesso!");
    mostrarLogin();
}

// =========================
//  TROCAR TELA
// =========================

function mostrarCadastro() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("cadastroForm").style.display = "block";
}

function mostrarLogin() {
    document.getElementById("cadastroForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
}

// =========================
//  RECUPERAR SENHA
// =========================

function recuperarSenha() {
    const email = prompt("Digite seu e-mail:");

    const user = usuarios.find(u => u.email === email);

    if (!user) {
        alert("E-mail não encontrado.");
        return;
    }

    const novaSenha = prompt("Digite a nova senha:");
    if (!novaSenha) return alert("Senha inválida.");

    user.senha = novaSenha;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Senha alterada com sucesso!");
}
