document.addEventListener('DOMContentLoaded', function () {
    // Load tasks from local storage
    loadTasks();

    // Event listener for adding a new task
    document.getElementById('new-task').addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });
});

function addTask() {
    // Get the new task input values
    const newTaskInput = document.getElementById('new-task');
    const taskText = newTaskInput.value.trim();
    const dueDateInput = document.getElementById('new-task-due-date');
    const dueTimeInput = document.getElementById('new-task-due-time');
    const dueDate = dueDateInput.value;
    const dueTime = dueTimeInput.value;

    // Check if the task is not empty and due date is valid
    if (taskText !== '' && isValidDate(dueDate)) {
        // Create a new task object
        const task = {
            text: taskText,
            completed: false,
            dueDate: dueDate,
            dueTime: dueTime,
        };

        // Add the task to the task list
        addTaskToList(task);

        // Save tasks to local storage
        saveTasks();

        // Clear the input fields
        newTaskInput.value = '';
        dueDateInput.value = '';
        dueTimeInput.value = '';
    } else {
        alert('Invalid input or due date format. Please try again.');
    }
}

function addTaskToList(task) {
    // Create task element
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');

    // Create task text element
    const taskTextElement = document.createElement('div');
    taskTextElement.innerText = task.text;

    // Create task completion checkbox
    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox';
    taskCheckbox.checked = task.completed;
    taskCheckbox.addEventListener('change', function () {
        task.completed = taskCheckbox.checked;
        saveTasks();
    });

    // Create task due date and time element
    const taskDueDateTimeElement = document.createElement('div');
    taskDueDateTimeElement.innerText = `Due Date: ${task.dueDate} ${task.dueTime}`;

    // Create edit button
    const editButton = document.createElement('button');
    editButton.classList.add('edit-button'); // Add the 'edit-button' class
    editButton.innerText = 'Edit';
    editButton.addEventListener('click', function () {
        editTask(task, taskTextElement, taskDueDateTimeElement);
    });

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button'); // Add the 'delete-button' class
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', function () {
        taskElement.remove();
        saveTasks();
    });

    // Append elements to the task element
    taskElement.appendChild(taskCheckbox);
    taskElement.appendChild(taskTextElement);
    taskElement.appendChild(taskDueDateTimeElement);
    taskElement.appendChild(editButton);
    taskElement.appendChild(deleteButton);

    // Append the task element to the task list
    document.getElementById('task-list').appendChild(taskElement);
}

function editTask(task, taskTextElement, taskDueDateTimeElement) {
    const newText = prompt('Edit task:', task.text);
    const newDueDate = prompt('Edit due date (YYYY-MM-DD):', task.dueDate);
    const newDueTime = prompt('Edit due time (HH:mm):', task.dueTime);

    if (newText !== null && isValidDate(newDueDate)) {
        task.text = newText;
        task.dueDate = newDueDate;
        task.dueTime = newDueTime;
        taskTextElement.innerText = newText;
        taskDueDateTimeElement.innerText = `Due Date: ${newDueDate} ${newDueTime}`;
        saveTasks();
    } else {
        alert('Invalid input or due date format. Please try again.');
    }
}

function isValidDate(dateString) {
    // Validate date format (YYYY-MM-DD)
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
}

function saveTasks() {
    // Get all tasks from the task list
    const tasks = [];
    const taskElements = document.querySelectorAll('.task');
    taskElements.forEach(function (taskElement) {
        const taskText = taskElement.querySelector('div').innerText;
        const taskCompleted = taskElement.querySelector('input').checked;
        const taskDueDateTime = taskElement.querySelector('.task-due-date-time').innerText.replace('Due Date: ', '');

        tasks.push({
            text: taskText,
            completed: taskCompleted,
            dueDateTime: taskDueDateTime,
        });
    });

    // Save tasks to local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    // Load tasks from local storage
    const tasksJson = localStorage.getItem('tasks');
    if (tasksJson) {
        const tasks = JSON.parse(tasksJson);

        // Add each task to the task list
        tasks.forEach(function (task) {
            addTaskToList(task);
        });
    }
}
