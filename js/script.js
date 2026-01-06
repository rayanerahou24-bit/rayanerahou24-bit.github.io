// Variables globales
let todos = [];
let currentFilter = 'all';

// Éléments DOM
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompleted');
const totalCount = document.getElementById('totalCount');
const activeCount = document.getElementById('activeCount');
const completedCount = document.getElementById('completedCount');

// Charger les todos depuis localStorage
function loadTodos() {
    const saved = localStorage.getItem('todos');
    if (saved) {
        todos = JSON.parse(saved);
        renderTodos();
        updateStats();
    }
}

// Sauvegarder dans localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Ajouter une tâche
function addTodo() {
    const text = todoInput.value.trim();
    if (text) {
        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        todos.push(todo);
        todoInput.value = '';
        saveTodos();
        renderTodos();
        updateStats();
    }
}

// Basculer l'état d'une tâche
function toggleTodo(id) {
    todos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
    updateStats();
}

// Supprimer une tâche
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
    updateStats();
}

// Supprimer les tâches terminées
function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
    updateStats();
}

// Filtrer les todos
function getFilteredTodos() {
    if (currentFilter === 'active') {
        return todos.filter(todo => !todo.completed);
    }
    if (currentFilter === 'completed') {
        return todos.filter(todo => todo.completed);
    }
    return todos;
}

// Afficher les todos
function renderTodos() {
    const filtered = getFilteredTodos();
    
    if (filtered.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <p>Aucune tâche à afficher</p>
                <p>Commencez par ajouter une nouvelle tâche !</p>
            </div>
        `;
        return;
    }
    
    todoList.innerHTML = filtered.map(todo => `
        <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
            <div class="todo-checkbox" onclick="toggleTodo(${todo.id})"></div>
            <span class="todo-text">${todo.text}</span>
            <button class="btn-delete" onclick="deleteTodo(${todo.id})">Supprimer</button>
        </li>
    `).join('');
}

// Mettre à jour les statistiques
function updateStats() {
    const total = todos.length;
    const active = todos.filter(t => !t.completed).length;
    const completed = todos.filter(t => t.completed).length;
    
    totalCount.textContent = total;
    activeCount.textContent = active;
    completedCount.textContent = completed;
    
    if (completed > 0) {
        clearCompletedBtn.classList.add('visible');
    } else {
        clearCompletedBtn.classList.remove('visible');
    }
}

// Événements
addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

clearCompletedBtn.addEventListener('click', clearCompleted);

// Initialisation
loadTodos();
