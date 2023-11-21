var form = document.querySelector(".todo-list__form");
var taskInput = document.querySelector(".todo-list__input-box");
var tasksList = document.querySelector(".task-list"); //
var clearBtn = document.querySelector(".todo-list__clear-btn");
var tasks = [];
function addTask(event) {
    event.preventDefault();
    var taskText = taskInput.value;
    if (taskText.length === 0) {
        alert("Ты ничего не ввел !");
        return;
    }
    var newTask = new Task(taskText, false);
    tasks.push(newTask);
    renderTask(newTask);
    taskInput.value = "";
    clearBtn.classList.remove("none");
    saveToLocalStorage();
    checkIsTasksEmpty();
}
function deleteTask(event) {
    if (event.target == null ||
        !(event.target instanceof HTMLButtonElement) ||
        event.target.dataset.action !== "delete") {
        return;
    }
    var parentNode = event.target.closest(".task-list__item"); //
    if (!parentNode)
        return; //
    var parentId = Number(parentNode.id);
    tasks = tasks.filter(function (task) { return task.id !== parentId; });
    parentNode.remove();
    saveToLocalStorage();
    if (checkIsTasksEmpty()) {
        clearBtn.classList.add("none");
    }
}
function deleteAllDoneTask(event) {
    var _a;
    if (event.target == null ||
        !(event.target instanceof HTMLButtonElement) ||
        event.target.dataset.action !== "deleteAllDoneTask") {
        return;
    }
    var doneTasks = tasks.filter(function (task) { return task.done === true; });
    if (doneTasks.length === 0) {
        alert("У тебя еще нет выполненных задачек !");
        return;
    }
    tasks = tasks.filter(function (task) { return task.done !== true; });
    for (var i = 0; i < doneTasks.length; i++) {
        (_a = document.getElementById(doneTasks[i].id.toString())) === null || _a === void 0 ? void 0 : _a.remove(); //
    }
    if (checkIsTasksEmpty()) {
        clearBtn.classList.add("none");
    }
    saveToLocalStorage();
}
function doneTask(event) {
    if (event.target == null ||
        !(event.target instanceof HTMLButtonElement) ||
        event.target.dataset.action !== "done") {
        return;
    }
    var parentNode = event.target.closest(".task-list__item");
    if (!parentNode)
        return;
    var parentId = Number(parentNode.id);
    var task = tasks.find(function (task) { return task.id === parentId; }); //
    if (!task)
        return;
    task.done = !task.done;
    var taskTitle = parentNode.querySelector(".task__title");
    var btn = parentNode.querySelector(".btn-check");
    if (taskTitle && btn) {
        taskTitle.classList.toggle("task__title--done");
        btn.classList.toggle("btn-check--done");
    }
    saveToLocalStorage();
}
function checkIsTasksEmpty() {
    if (tasks.length === 0) {
        var emptyTaskListHTML = " <li class=\"task-list__item-empty\">\n  <p class=\"item-empty__title\">\u041F\u043E\u043A\u0430 \u0443 \u0442\u0435\u0431\u044F </br>\u043D\u0435\u0442 \u0437\u0430\u0434\u0430\u0447\u0435\u043A</p>\n  <img src=\"assets/img/emoji_sad.png\" alt=\"sad emoji\" class=\"item-empty__emoji\">\n</li> ";
        tasksList.insertAdjacentHTML("afterbegin", emptyTaskListHTML);
        return true;
    }
    else {
        var emptyTaskListElement = document.querySelector(".task-list__item-empty");
        emptyTaskListElement ? emptyTaskListElement.remove() : null; //
        return false;
    }
}
function saveToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function renderTask(task) {
    var cssTitleClass = task.done
        ? "task__title task__title--done"
        : "task__title";
    var cssBtnClass = task.done
        ? "btn-check btn-check--done"
        : "btn-check";
    var taskHTML = "<li id=\"".concat(task.id, "\" class=\"task-list__item\">\n<div class=\"task__left-side\">\n  <button class=\"").concat(cssBtnClass, "\" data-action = \"done\"></button>\n  <h5 class=\"").concat(cssTitleClass, "\">").concat(task.text, "</h5> \n</div>\n<button class=\"btn-delete\" data-action = \"delete\">\n    <img src=\"assets/img/delete.png\" alt=\"delete\">\n</button>\n</li>");
    tasksList.insertAdjacentHTML("afterbegin", taskHTML);
}
var Task = /** @class */ (function () {
    function Task(text, done) {
        this.id = Date.now();
        (this.text = text), (this.done = done);
    }
    return Task;
}());
if (form && taskInput && tasksList) {
    if (localStorage.getItem("tasks")) {
        // tasks = JSON.parse(localStorage.getItem("tasks"));
        var taskJSON = localStorage.getItem("tasks");
        tasks = taskJSON !== null ? JSON.parse(taskJSON) : null; //
        tasks.forEach(function (task) { return renderTask(task); });
    }
    if (checkIsTasksEmpty()) {
        clearBtn.classList.add("none"); //
    }
    form.addEventListener("submit", addTask);
    tasksList.addEventListener("click", deleteTask);
    tasksList.addEventListener("click", doneTask);
    tasksList.addEventListener("click", deleteAllDoneTask);
}
