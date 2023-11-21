const form: HTMLElement = document.querySelector(
  ".todo-list__form"
) as HTMLElement;

const taskInput: HTMLInputElement = document.querySelector(
  ".todo-list__input-box"
) as HTMLInputElement;

const tasksList: HTMLElement = document.querySelector(
  ".task-list"
) as HTMLElement; //

const clearBtn: HTMLButtonElement = document.querySelector(
  ".todo-list__clear-btn"
) as HTMLButtonElement;

let tasks: Task[] = [];

function addTask(event: Event): void {
  event.preventDefault();

  const taskText: string = taskInput.value;

  if (taskText.length === 0) {
    alert("Ты ничего не ввел !");
    return;
  }

  const newTask: Task = new Task(taskText, false);
  tasks.push(newTask);

  renderTask(newTask);

  taskInput.value = "";

  clearBtn.classList.remove("none");

  saveToLocalStorage();
  checkIsTasksEmpty();
}

function deleteTask(event: Event): void {
  if (
    event.target == null ||
    !(event.target instanceof HTMLButtonElement) ||
    event.target.dataset.action !== "delete"
  ) {
    return;
  }

  const parentNode: HTMLElement | null =
    event.target.closest(".task-list__item"); //
  if (!parentNode) return; //

  const parentId: number = Number(parentNode.id);

  tasks = tasks.filter((task) => task.id !== parentId);

  parentNode.remove();

  saveToLocalStorage();
  
  if (checkIsTasksEmpty()) {
    clearBtn.classList.add("none");
  }
}

function deleteAllDoneTask(event: Event): void {
  if (
    event.target == null ||
    !(event.target instanceof HTMLButtonElement) ||
    event.target.dataset.action !== "deleteAllDoneTask"
  ) {
    return;
  }

  let doneTasks: Task[] = tasks.filter((task) => task.done === true);

  if (doneTasks.length === 0) {
    alert("У тебя еще нет выполненных задачек !");
    return;
  }

  tasks = tasks.filter((task) => task.done !== true);

  for (let i = 0; i < doneTasks.length; i++) {
    document.getElementById(doneTasks[i].id.toString())?.remove(); //
  }

  if (checkIsTasksEmpty()) {
    clearBtn.classList.add("none");
  }
  saveToLocalStorage();
}

function doneTask(event: Event): void {
  if (
    event.target == null ||
    !(event.target instanceof HTMLButtonElement) ||
    event.target.dataset.action !== "done"
  ) {
    return;
  }

  const parentNode: HTMLElement | null =
    event.target.closest(".task-list__item");
  if (!parentNode) return;

  const parentId = Number(parentNode.id);

  const task: Task | undefined = tasks.find((task) => task.id === parentId); //
  if (!task) return;

  task.done = !task.done;

  const taskTitle: HTMLElement | null =
    parentNode.querySelector(".task__title");
  const btn: HTMLElement | null = parentNode.querySelector(".btn-check");

  if (taskTitle && btn) {
    taskTitle.classList.toggle("task__title--done");
    btn.classList.toggle("btn-check--done");
  }
  saveToLocalStorage();
}

function checkIsTasksEmpty(): boolean {
  if (tasks.length === 0) {
    const emptyTaskListHTML: string = ` <li class="task-list__item-empty">
  <p class="item-empty__title">Пока у тебя </br>нет задачек</p>
  <img src="assets/img/emoji_sad.png" alt="sad emoji" class="item-empty__emoji">
</li> `;

    tasksList.insertAdjacentHTML("afterbegin", emptyTaskListHTML);

    return true;
  } else {
    const emptyTaskListElement: HTMLElement | null = document.querySelector(
      ".task-list__item-empty"
    );
    emptyTaskListElement ? emptyTaskListElement.remove() : null; //

    return false;
  }
}

function saveToLocalStorage(): void {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task): void {
  const cssTitleClass: string = task.done
    ? "task__title task__title--done"
    : "task__title";
  const cssBtnClass: string = task.done
    ? "btn-check btn-check--done"
    : "btn-check";

  const taskHTML: string = `<li id="${task.id}" class="task-list__item">
<div class="task__left-side">
  <button class="${cssBtnClass}" data-action = "done"></button>
  <h5 class="${cssTitleClass}">${task.text}</h5> 
</div>
<button class="btn-delete" data-action = "delete">
    <img src="assets/img/delete.png" alt="delete">
</button>
</li>`;
  tasksList.insertAdjacentHTML("afterbegin", taskHTML);
}

class Task {
  id: number = Date.now();
  text: string;
  done: boolean;

  constructor(text: string, done: boolean) {
    (this.text = text), (this.done = done);
  }
}

if (form && taskInput && tasksList) {
  if (localStorage.getItem("tasks")) {
    // tasks = JSON.parse(localStorage.getItem("tasks"));

    const taskJSON: string | null = localStorage.getItem("tasks");
    tasks = taskJSON !== null ? JSON.parse(taskJSON) : null; //

    tasks.forEach((task) => renderTask(task));
  }

  if (checkIsTasksEmpty()) {
    clearBtn.classList.add("none");
  }

  form.addEventListener("submit", addTask);

  tasksList.addEventListener("click", deleteTask);

  tasksList.addEventListener("click", doneTask);

  tasksList.addEventListener("click", deleteAllDoneTask);
}

export {};
