const calendarEl = document.getElementById("calendar");
const monthYearEl = document.getElementById("monthYear");
const tasksEl = document.getElementById("tasks");

let currentDate = new Date();

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Nome do mês e ano
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  monthYearEl.textContent = `${monthNames[month]} ${year}`;

  // Primeiro e último dia do mês
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  calendarEl.innerHTML = "";

  // Preencher os espaços vazios antes do dia 1
  for (let i = 0; i < firstDay; i++) {
    calendarEl.innerHTML += `<div></div>`;
  }

  // Dias do mês
  let tasks = JSON.parse(localStorage.getItem("tarefas")) || {};
  const today = new Date();

  for (let day = 1; day <= lastDate; day++) {
    const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const hasTasks = tasks[dateStr] && tasks[dateStr].length > 0;

    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    calendarEl.innerHTML += `
      <div class="day ${hasTasks ? "has-task" : ""} ${isToday ? "today" : ""}" 
           onclick="showTasks('${dateStr}')">${day}</div>
    `;
  }
}

function showTasks(dateStr) {
  let tasks = JSON.parse(localStorage.getItem("tarefas")) || {};
  tasksEl.innerHTML = "";

  if (tasks[dateStr]) {
    tasks[dateStr].forEach((t, i) => {
      tasksEl.innerHTML += `
        <li>
          <strong>${t.title}</strong> (${t.priority}) - ${t.desc || ""} 
          ${t.time ? " às " + t.time : ""}
        </li>`;
    });
  } else {
    tasksEl.innerHTML = "<li>Sem tarefas para este dia.</li>";
  }
}

// Botões de navegação
document.getElementById("prevMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById("nextMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

// Botão para página de adicionar tarefa
document.getElementById("addTaskBtn").addEventListener("click", () => {
  window.location.href = "tarefas.html";
});

// Atualizar calendário sempre que voltar da página de tarefas
window.addEventListener("storage", () => {
  renderCalendar();
});

// Renderizar ao abrir
renderCalendar();
