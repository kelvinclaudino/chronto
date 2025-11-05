// Nosso "banco de dados" → carrega do localStorage ou JSON inicial
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

// LOGIN
function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const user = usuarios.find(u => u.email === email && u.senha === senha);

  if (user) {
    alert("Login realizado com sucesso!");
    window.location.href = "calendar.html"; // ← redireciona para a tela de calendário
  } else {
    alert("Usuário ou senha incorretos!");
  }
}

// CADASTRO
function cadastrar() {
  const nome = document.getElementById("novoNome").value;
  const email = document.getElementById("novoEmail").value;
  const senha = document.getElementById("novaSenha").value;

  if (!email || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  const existe = usuarios.find(u => u.email === email);
  if (existe) {
    alert("Esse e-mail já está cadastrado!");
    return;
  }

  usuarios.push({ nome, email, senha });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert("Cadastro realizado com sucesso!");

  mostrarLogin();
}

// Alternar telas
function mostrarCadastro() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("cadastroForm").style.display = "block";
}

function mostrarLogin() {
  document.getElementById("cadastroForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
}


//trocar senha
function recuperarSenha() {
  const email = prompt("Digite seu e-mail cadastrado:");
  const user = usuarios.find(u => u.email === email);

  if (!user) {
    alert("E-mail não encontrado!");
    return;
  }

  const novaSenha = prompt("Digite sua nova senha:");
  if (!novaSenha) {
    alert("Senha inválida!");
    return;
  }

  user.senha = novaSenha; // altera a senha no objeto
  localStorage.setItem("usuarios", JSON.stringify(usuarios)); // salva de novo
  alert("Senha redefinida com sucesso!");
}


//outra parte
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

function salvarTarefa(data, descricao) {
  tarefas.push({ data, descricao, concluida: false });
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function carregarTarefas() {
  const lista = document.getElementById("taskList");
  if (!lista) return;

  lista.innerHTML = "";
  tarefas.forEach((tarefa, index) => {
    const item = document.createElement("li");
    item.textContent = `${tarefa.data} - ${tarefa.descricao}`;
    item.style.textDecoration = tarefa.concluida ? "line-through" : "none";
    item.onclick = () => {
      tarefas[index].concluida = !tarefas[index].concluida;
      localStorage.setItem("tarefas", JSON.stringify(tarefas));
      carregarTarefas();
    };
    lista.appendChild(item);
  });
}

function gerarGrafico() {
  const ctx = document.getElementById("graficoTarefas");
  if (!ctx) return;

  const feitas = tarefas.filter(t => t.concluida).length;
  const pendentes = tarefas.length - feitas;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Feitas", "Pendentes"],
      datasets: [{
        label: "Tarefas",
        data: [feitas, pendentes],
        backgroundColor: ["#A7BE8A", "#FEBD57"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function gerarCalendario() {
  const container = document.getElementById("calendar");
  if (!container) return;

  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();
  const dias = new Date(ano, mes + 1, 0).getDate();

  container.innerHTML = "";
  for (let i = 1; i <= dias; i++) {
    const dia = document.createElement("div");
    dia.className = "dia";
    dia.textContent = i;
    dia.onclick = () => {
      const descricao = prompt(`Adicionar tarefa para ${i}/${mes + 1}/${ano}:`);
      if (descricao) {
        salvarTarefa(`${i}/${mes + 1}/${ano}`, descricao);
      }
    };
    container.appendChild(dia);
  }
}

window.onload = () => {
  carregarTarefas();
  gerarGrafico();
  gerarCalendario();
};
