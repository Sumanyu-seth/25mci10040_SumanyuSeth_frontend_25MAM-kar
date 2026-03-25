## Smart To-Do app
### Build a modern To-Do Web App where users can manage tasks efficiently with priority, deadline, filtering, and sorting.

##   

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/386f021b-9d7a-4162-a38e-0daf3ac68dad" />

##    

<img width="1917" height="801" alt="image" src="https://github.com/user-attachments/assets/2c085d2c-36ed-46f1-824d-214837b3a634" />

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Saare Kaam yaad rakho</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

  <div class="container py-4">
    <h1 class="text-center mb-4">Ekdum Naya To-Do Manager</h1>

    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-2">
          <div class="col-md-4">
            <input type="text" id="taskName" class="form-control" placeholder="Task name">
          </div>
          <div class="col-md-3">
            <select id="taskPriority" class="form-select">
              <option value="Low">Dekhi jayegi</option>
              <option value="Medium">Aaj karna hai</option>
              <option value="High">Abhi kar</option>
            </select>
          </div>
          <div class="col-md-3">
            <input type="date" id="taskDeadline" class="form-control">
          </div>
          <div class="col-md-2">
            <button id="addTaskBtn" class="btn btn-primary">Kaam aagya</button>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-3 g-2 align-items-center">
      <div class="col-md-4 d-flex gap-2">
        <button class="btn btn-sm filter-btn active" data-filter="all">All</button>
        <button class="btn btn-sm filter-btn" data-filter="completed">Completed</button>
        <button class="btn btn-outline-secondary btn-sm filter-btn" data-filter="pending">Pending</button>
      </div>
      <div class="col-md-4">
        <select id="sortSelect" class="form-select form-select-sm">
          <option value="none">Sort: None</option>
          <option value="priority">Pehle konsa? (High → Low)</option>
          <option value="deadline">Gaya bhai ye (Nearest first)</option>
        </select>
      </div>
      <div class="col-md-4">
        <input type="text" id="searchInput" class="form-control form-control-sm" placeholder="Search tasks">
      </div>
    </div>

    <div class="row mb-3">
      <div class="col-md-4">
        <div class="card text-center">
          <div class="card-body">
            <h6 class="card-title mb-1">Saara kaam</h6>
            <p class="mb-0 fw-bold" id="totalCount">0</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card text-center">
          <div class="card-body">
            <h6 class="card-title mb-1">Completed</h6>
            <p class="mb-0 fw-bold text-success" id="completedCount">0</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card text-center">
          <div class="card-body">
            <h6 class="card-title mb-1">Pending</h6>
            <p class="mb-0 fw-bold text-warning" id="pendingCount">0</p>
          </div>
        </div>
      </div>
    </div>

    <div id="taskListContainer" class="row gy-3">
        
    </div>
  </div>

  <script>
    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    let currentFilter = 'all';
    let currentSearch = '';
    let currentSort = 'none';

    const taskNameInput = document.getElementById('taskName');
    const taskPrioritySelect = document.getElementById('taskPriority');
    const taskDeadlineInput = document.getElementById('taskDeadline');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskListContainer = document.getElementById('taskListContainer');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sortSelect');
    const searchInput = document.getElementById('searchInput');
    const totalCountEl = document.getElementById('totalCount');
    const completedCountEl = document.getElementById('completedCount');
    const pendingCountEl = document.getElementById('pendingCount');

    function debounce(fn, delay) {
      let timer;
      return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
      };
    }

    function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    addTaskBtn.addEventListener('click', () => {
      const title = taskNameInput.value.trim();
      const priority = taskPrioritySelect.value;
      const deadline = taskDeadlineInput.value;

      if (!title) {
        alert('Please enter a task name');
        return;
      }

      const newTask = {
        id: Date.now(),
        title,
        priority,
        deadline,
        completed: false
      };

      tasks.push(newTask);
      saveTasks();
      clearInputs();
      renderTasks();
    });

    function clearInputs() {
      taskNameInput.value = '';
      taskDeadlineInput.value = '';
      taskPrioritySelect.value = 'Low';
    }

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        debouncedRender();
      });
    });

    sortSelect.addEventListener('change', () => {
      currentSort = sortSelect.value;
      renderTasks();
    });

    const handleSearch = debounce(function (e) {
      currentSearch = e.target.value.toLowerCase();
      renderTasks();
    }, 300);

    searchInput.addEventListener('input', handleSearch);

    function renderTasks() {
      taskListContainer.innerHTML = '';

      let filtered = tasks.slice();

      if (currentFilter === 'completed') {
        filtered = filtered.filter(t => t.completed);
      } else if (currentFilter === 'pending') {
        filtered = filtered.filter(t => !t.completed);
      }

      if (currentSearch) {
        filtered = filtered.filter(t =>
          t.title.toLowerCase().includes(currentSearch)
        );
      }

      if (currentSort === 'priority') {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      } else if (currentSort === 'deadline') {
        filtered.sort((a, b) => {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline) - new Date(b.deadline);
        });
      }

      filtered.forEach(task => {
        const col = document.createElement('div');
        col.className = 'col-12';

        const card = document.createElement('div');
        card.className = 'card';

        if (isOverdue(task)) {
          card.classList.add('border', 'border-danger');
        }

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body d-flex justify-content-between align-items-center';

        const left = document.createElement('div');

        const titleEl = document.createElement('h5');
        titleEl.className = 'card-title mb-1';
        titleEl.textContent = task.title;

        if (task.completed) {
          titleEl.classList.add('text-decoration-line-through', 'text-muted');
        }

        const meta = document.createElement('div');
        meta.className = 'd-flex align-items-center gap-2';

        const priorityBadge = document.createElement('span');
        priorityBadge.className = 'badge';
        if (task.priority === 'Low') {
          priorityBadge.classList.add('bg-success');
        } else if (task.priority === 'Medium') {
          priorityBadge.classList.add('bg-warning', 'text-dark');
        } else {
          priorityBadge.classList.add('bg-danger');
        }
        priorityBadge.textContent = task.priority;

        const deadlineText = document.createElement('small');
        deadlineText.className = 'text-muted';
        deadlineText.textContent = task.deadline ? `Deadline: ${task.deadline}` : 'No deadline';

        meta.appendChild(priorityBadge);
        meta.appendChild(deadlineText);

        left.appendChild(titleEl);
        left.appendChild(meta);

        const right = document.createElement('div');
        right.className = 'd-flex gap-2';

        const completeBtn = document.createElement('button');
        completeBtn.className = 'btn btn-sm ' + (task.completed ? 'btn-secondary' : 'btn-success');
        completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
        completeBtn.addEventListener('click', () => toggleComplete(task.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-danger';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        right.appendChild(completeBtn);
        right.appendChild(deleteBtn);

        cardBody.appendChild(left);
        cardBody.appendChild(right);
        card.appendChild(cardBody);
        col.appendChild(card);
        taskListContainer.appendChild(col);
      });

      updateCounters();
    }

    const debouncedRender = debounce(renderTasks, 300);

    function updateCounters() {
      const total = tasks.length;
      const completed = tasks.filter(t => t.completed).length;
      const pending = total - completed;

      totalCountEl.textContent = total;
      completedCountEl.textContent = completed;
      pendingCountEl.textContent = pending;
    }

    function isOverdue(task) {
      if (!task.deadline || task.completed) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const deadlineDate = new Date(task.deadline);
      return deadlineDate < today;
    }

    function toggleComplete(id) {
      tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      saveTasks();
      renderTasks();
    }

    function deleteTask(id) {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      renderTasks();
    }

    renderTasks();
  </script>
</body>
</html>
```
