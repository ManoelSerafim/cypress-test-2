const form = document.querySelector('#task-form');
const titleInput = document.querySelector('#task-title');
const responsibleInput = document.querySelector('#task-responsible');
const priorityInput = document.querySelector('#task-priority');
const descriptionInput = document.querySelector('#task-description');
const errorMessage = document.querySelector('#error-message');
const taskList = document.querySelector('#task-list');
const taskCount = document.querySelector('[data-cy="task-count"]');
const clearButton = document.querySelector('[data-cy="clear-button"]');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getSelectedStatus() {
  return document.querySelector('input[name="status"]:checked').value;
}

function renderTasks() {
  taskList.innerHTML = '';

  taskCount.textContent =
    `${tasks.length} ${tasks.length === 1 ? 'tarefa' : 'tarefas'}`;

  if (tasks.length === 0) {
    const emptyMessage = document.createElement('p');

    emptyMessage.textContent = 'Nenhuma tarefa cadastrada.';
    emptyMessage.className = 'empty-message';
    emptyMessage.setAttribute('data-cy', 'empty-message');

    taskList.appendChild(emptyMessage);
    return;
  }

  tasks.forEach((task) => {
    const card = document.createElement('article');

    card.className = 'task-card';
    card.setAttribute('data-cy', 'task-card');

    card.innerHTML = `
      <h3 data-cy="card-title">${task.title}</h3>
      <p><strong>Responsável:</strong> ${task.responsible}</p>
      <p><strong>Prioridade:</strong> ${task.priority}</p>
      <p><strong>Status:</strong> ${task.status}</p>
      <p><strong>Descrição:</strong> ${task.description}</p>
    `;

    taskList.appendChild(card);
  });
}

function clearForm() {
  form.reset();

  document.querySelector(
    'input[name="status"][value="Pendente"]'
  ).checked = true;

  errorMessage.textContent = '';
  titleInput.focus();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const responsible = responsibleInput.value.trim();
  const priority = priorityInput.value;
  const status = getSelectedStatus();
  const description = descriptionInput.value.trim();

  if (!title || !responsible || !priority || !description) {
    errorMessage.textContent =
      'Preencha todos os campos antes de adicionar a tarefa.';
    return;
  }

  const newTask = {
    title,
    responsible,
    priority,
    status,
    description
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  clearForm();
});

clearButton.addEventListener('click', clearForm);

renderTasks();
