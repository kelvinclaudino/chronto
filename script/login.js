// Nosso "banco de dados" → carrega do localStorage ou JSON inicial
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

// Adiciona usuário padrão se não existir nenhum usuário
if (usuarios.length === 0) {
  usuarios.push({ 
    nome: "Usuário Demo", 
    email: "demo@email.com", 
    senha: "123456" 
  });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// LOGIN
function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  // Credenciais padrão para acesso rápido
  if ((email === "demo@email.com" && senha === "123456") || 
      (email === "admin" && senha === "admin") ||
      (email === "teste" && senha === "teste")) {
    alert("Login realizado com sucesso com credenciais padrão!");
    window.location.href = "calendar.html";
    return;
  }

  const user = usuarios.find(u => u.email === email && u.senha === senha);

  if (user) {
    alert("Login realizado com sucesso!");
    window.location.href = "calendar.html";
  } else {
    alert("Usuário ou senha incorretos!\n\nCredenciais padrão:\nE-mail: demo@email.com\nSenha: 123456\n\nOu:\nE-mail: admin\nSenha: admin\n\nOu:\nE-mail: teste\nSenha: teste");
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

// Preencher automaticamente com credenciais padrão ao carregar a página
function preencherCredenciaisPadrao() {
  // Aguarda um pouco para garantir que os elementos existam
  setTimeout(() => {
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");
    
    if (emailInput && senhaInput) {
      // Preenche com o primeiro conjunto de credenciais padrão
      emailInput.value = "demo@email.com";
      senhaInput.value = "123456";
      
      // Adiciona um botão de acesso rápido se quiser
      const loginForm = document.getElementById("loginForm");
      if (loginForm && !document.getElementById("acessoRapidoBtn")) {
        const acessoRapidoBtn = document.createElement("button");
        acessoRapidoBtn.id = "acessoRapidoBtn";
        acessoRapidoBtn.type = "button";
        acessoRapidoBtn.textContent = "Acesso Rápido (Preencher Demo)";
        acessoRapidoBtn.style.marginTop = "10px";
        acessoRapidoBtn.style.padding = "5px";
        acessoRapidoBtn.style.backgroundColor = "#4CAF50";
        acessoRapidoBtn.style.color = "white";
        acessoRapidoBtn.style.border = "none";
        acessoRapidoBtn.style.borderRadius = "4px";
        acessoRapidoBtn.style.cursor = "pointer";
        
        acessoRapidoBtn.onclick = function() {
          emailInput.value = "demo@email.com";
          senhaInput.value = "123456";
        };
        
        loginForm.appendChild(acessoRapidoBtn);
      }
    }
  }, 100);
}

//trocar senha
function recuperarSenha() {
  const email = prompt("Digite seu e-mail cadastrado:\n\nCredenciais padrão disponíveis:\n- demo@email.com\n- admin\n- teste");
  const user = usuarios.find(u => u.email === email);

  if (!user) {
    alert("E-mail não encontrado!\n\nUse uma das credenciais padrão:\nE-mail: demo@email.com\nSenha: 123456");
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

// Outra parte (calendário e tarefas)
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

// Adiciona algumas tarefas de exemplo se não existirem
if (tarefas.length === 0) {
  const hoje = new Date();
  const data1 = `${hoje.getDate()}/${hoje.getMonth() + 1}/${hoje.getFullYear()}`;
  const data2 = `${hoje.getDate() + 1}/${hoje.getMonth() + 1}/${hoje.getFullYear()}`;
  
  tarefas.push(
    { data: data1, descricao: "Tarefa de exemplo 1", concluida: false },
    { data: data1, descricao: "Tarefa de exemplo 2", concluida: true },
    { data: data2, descricao: "Tarefa futura exemplo", concluida: false }
  );
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

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
  preencherCredenciaisPadrao(); // Chama a função para preencher automaticamente
  carregarTarefas();
  gerarGrafico();
  gerarCalendario();
};


