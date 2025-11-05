const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

// Função para formatar data no padrão brasileiro
function formatarDataBR(dataISO) {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Carregar tarefas ao abrir
function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tarefas")) || {};
  taskList.innerHTML = "";

  Object.keys(tasks).forEach(date => {
    tasks[date].forEach((t, i) => {
      const li = document.createElement("li");
      // 🔥 MUDANÇA AQUI: formatar a data para o padrão brasileiro
      li.innerHTML = `
        <strong>${formatarDataBR(date)}</strong> ${t.time ? "às " + t.time : ""} - 
        <b>${t.title}</b> (${t.priority}) <br>
        ${t.desc || ""}
        <br>
        <button onclick="deleteTask('${date}', ${i})">Excluir</button>
      `;
      taskList.appendChild(li);
    });
  });
}

// Salvar nova tarefa
if (taskForm) {
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const date = document.getElementById("dateInput").value;
    const time = document.getElementById("timeInput").value;
    const title = document.getElementById("titleInput").value;
    const desc = document.getElementById("descInput").value;
    const priority = document.getElementById("priorityInput").value;

    const task = { title, desc, time, priority };

    let tasks = JSON.parse(localStorage.getItem("tarefas")) || {};
    if (!tasks[date]) tasks[date] = [];
    tasks[date].push(task);

    localStorage.setItem("tarefas", JSON.stringify(tasks));

    alert("Tarefa salva com sucesso!");

    // 🔥 Notificar o calendário que houve atualização
    window.dispatchEvent(new Event("storage"));

    taskForm.reset();
    loadTasks();
  });
}

// Excluir tarefa
function deleteTask(date, index) {
  let tasks = JSON.parse(localStorage.getItem("tarefas")) || {};
  tasks[date].splice(index, 1);
  if (tasks[date].length === 0) {
    delete tasks[date];
  }
  localStorage.setItem("tarefas", JSON.stringify(tasks));

  // 🔥 Notificar o calendário que houve atualização
  window.dispatchEvent(new Event("storage"));

  loadTasks();
}

// Inicializar
loadTasks();
