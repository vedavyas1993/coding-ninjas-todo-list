let taskListArray = [];
let listToBeRendered = taskListArray;
let currentList = "all";
let counter = 0;

const inputText = document.getElementById("todo-input-text");
const addBtn = document.getElementById("add-btn");
const tasksList = document.getElementById("tasks-list");

const completedTasksCount = document.getElementsByClassName("completed-tasks");
const pendingTasksCount = document.getElementsByClassName("pending-tasks");
const allTasksCount = document.getElementsByClassName("all-tasks");

//EVENT LISTENERS
inputText.addEventListener("keypress", handleInput);
addBtn.addEventListener("click", handleInput);
document.addEventListener("click", clickHandler);

// get input on keypress enter, or pressing add button, if input is empty show alert.

function handleInput(event) {
  let text = "";
  if (event?.keyCode == 13) {
    event.preventDefault();
    text = event?.target?.value;
    addTask(text);
  } else if (event?.type == "click") {
    text = inputText.value;
    addTask(text);
  }
}

// add task function
function addTask(text) {
  if (!text) {
    alert("Input text cannot be empty.");
  } else {
    const task = {
      text,
      id: "myTask" + (counter = counter + 1),
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      completed: false,
    };
    taskListArray.push(task);
  }
  inputText.value = "";
  renderList();
}

// delete taskFunction

function deleteTask(taskId) {
  const taskIndex = taskListArray.findIndex((elem) => elem.id === taskId);
  const deleted = taskListArray.splice(taskIndex, 1);
  renderList();
  setTimeout(() => {
    window.alert(`TASK: "${deleted[0].text}" is deleted. `);
  }, 0);
}

// toggleCompleted function
function toggleStatus(taskId) {
  const taskIndex = taskListArray.findIndex((elem) => elem.id === taskId);
  taskListArray[taskIndex].completed = !taskListArray[taskIndex].completed;
  renderList();
  setTimeout(() => {
    window.alert(
      `TASK: "${taskListArray[taskIndex].text}" is marked ${
        taskListArray[taskIndex].completed ? "COMPLETED" : "PENDING"
      }.`
    );
  }, 0);
}
// ADD TASK TO DOM
function addTaskToDom(task) {
  const li = document.createElement("li");

  li.innerHTML = `       
      <input type="checkbox" data-id="${task.id}" ${
    task.completed ? "checked" : ""
  } class="toggle-status">
   <span data-id="${task.id}" class="${
    task.completed ? "completed-task" : ""
  }">${task.text}</span>
   <button data-id="${task.id}" class="delete-button">&#128465;</button>
      `;
  tasksList.append(li);
}

// rendering list based on selected list
function renderList() {
  tasksList.innerHTML = "";
  let completedTasksList = taskListArray.filter((task) => task.completed);
  let pendingTasksList = taskListArray.filter((task) => !task.completed);

  allTasksCount[0].innerHTML = taskListArray.length;
  pendingTasksCount[0].innerHTML = pendingTasksList.length;
  completedTasksCount[0].innerHTML = completedTasksList.length;
  if (currentList == "all") {
    listToBeRendered = taskListArray;
    if (taskListArray.length == 0) {
      tasksList.innerHTML = `
          <li><h3>CREATE A TASK</h3></li>
          `;
      return;
    }
  }
  if (currentList == "completed") {
    listToBeRendered = completedTasksList;
    if (completedTasksList.length == 0) {
      tasksList.innerHTML = `
          <li><h3>NO COMPLETED TASKS</h3></li>
          `;
      return;
    }
  }
  if (currentList == "pending") {
    listToBeRendered = pendingTasksList;
    if (pendingTasksList.length == 0) {
      tasksList.innerHTML = `
          <li><h3>NO PENDING TASKS</h3></li>
          `;
      return;
    }
  }

  for (let i = 0; i < listToBeRendered.length; i++) {
    addTaskToDom(listToBeRendered[i]);
  }
}

// highlight selected list button
function setSelectedButton(selected) {
  let all = document.getElementsByClassName("all-btn");
  let completed = document.getElementsByClassName("completed-btn");
  let pending = document.getElementsByClassName("pending-btn");

  all[0].classList.remove("selected");
  completed[0].classList.remove("selected");
  pending[0].classList.remove("selected");

  if (selected == "all") {
    all[0].classList.add("selected");
    completed[0].classList.remove("selected");
    pending[0].classList.remove("selected");
  }
  if (selected == "completed") {
    all[0].classList.remove("selected");
    completed[0].classList.add("selected");
    pending[0].classList.remove("selected");
  }
  if (selected == "pending") {
    all[0].classList.remove("selected");
    completed[0].classList.remove("selected");
    pending[0].classList.add("selected");
  }
}

// event delegation
function clickHandler(event) {
  let className = event.target.className;
  let taskId = event.target.dataset.id;
  // delete task and toggle status of task
  if (className == "delete-button") {
    deleteTask(taskId);
  }
  if (className == "toggle-status") {
    toggleStatus(taskId);
  }
  // render list based on category
  if (className == "all-btn") {
    currentList = "all";
    setSelectedButton(currentList);
    listToBeRendered = [...taskListArray];
    renderList();
  }
  if (className == "completed-btn") {
    currentList = "completed";
    setSelectedButton(currentList);
    renderList();
  }
  if (className == "pending-btn") {
    currentList = "pending";
    setSelectedButton(currentList);
    renderList();
  }
}

// initial render on page load
renderList();
