// script.js - Advanced To-Do List App

// DOM Elements
const taskNameInput = document.getElementById("task-name");
const taskCategorySelect = document.getElementById("task-category");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const categoryFilter = document.getElementById("category-filter");

// Initialize tasks array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Render tasks
function renderTasks() {
  const filter = categoryFilter.value;
  taskList.innerHTML = "";
  tasks
    .filter(task => filter === "All" || task.category === filter)
    .forEach((task, index) => {
      const li = document.createElement("li");
      li.draggable = true;
      li.className = "task-item";
      li.dataset.index = index;
      li.innerHTML = `
        <span>${task.name} (${task.category})</span>
        <button class="delete-task">Delete</button>
      `;
      taskList.appendChild(li);
    });
  attachDragEvents();
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add new task
addTaskButton.addEventListener("click", () => {
  const name = taskNameInput.value.trim();
  const category = taskCategorySelect.value;
  if (name) {
    tasks.push({ name, category });
    saveTasks();
    renderTasks();
    taskNameInput.value = "";
  }
});

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

taskList.addEventListener("click", event => {
  if (event.target.classList.contains("delete-task")) {
    const index = event.target.parentElement.dataset.index;
    deleteTask(index);
  }
});

// Filter tasks
categoryFilter.addEventListener("change", renderTasks);

// Drag and drop functionality
let draggedElement;

function attachDragEvents() {
  const items = document.querySelectorAll(".task-item");

  items.forEach(item => {
    item.addEventListener("dragstart", () => {
      draggedElement = item;
    });

    item.addEventListener("dragover", event => {
      event.preventDefault();
      const target = event.target.closest(".task-item");
      if (target && target !== draggedElement) {
        const rect = target.getBoundingClientRect();
        const next = (event.clientY - rect.top) / rect.height > 0.5;
        taskList.insertBefore(draggedElement, next ? target.nextSibling : target);
      }
    });

    item.addEventListener("dragend", () => {
      const reorderedTasks = Array.from(taskList.children).map(item => {
        const index = item.dataset.index;
        return tasks[index];
      });
      tasks = reorderedTasks;
      saveTasks();
      renderTasks();
    });
  });
}

// Initial render
renderTasks();
