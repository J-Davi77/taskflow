const addInputs = document.querySelectorAll("#add-task-container input");
const modalInputs = document.querySelectorAll("#modal input");
const list = document.querySelector("#task-container");
const addBtn = document.querySelector("#add-task-btn");
const searchInput = document.querySelector("#search-input");
const overlay = document.querySelector("#modal-overlay");
const editBtn = document.querySelector("#edit-btn");
const closeModalBtn = document.querySelector("#close-modal-btn");
const clearInputBtns = document.querySelectorAll(".clear-input-btn");
const menuBtn = document.querySelector("#menu-btn");
const sidebarOverlay = document.querySelector("#sidebar-overlay");
const darkmodeBtn = document.querySelector(".darkmode-btn");
const closeSidebarBtn = document.querySelector(".close-sidebar-btn");
const isDarkmode = localStorage.getItem("darkmode");
if (isDarkmode) toggleDarkmode();

function toggleDarkmode() {
    document
        .querySelectorAll("*")
        .forEach((el) => el.classList.add("disable-transitions")),
        document.body.classList.toggle("darkmode");
    const isDark = document.body.classList.contains("darkmode");

    if (isDark) darkmodeBtn.setAttribute("data-info", "Lightmode");
    else darkmodeBtn.setAttribute("data-info", "Darkmode");

    setTimeout(() =>
        document
            .querySelectorAll("*")
            .forEach((el) => el.classList.remove("disable-transitions"), 300)
    );

    localStorage.setItem("darkmode", isDark);
}

function closeSidebar() {
    sidebarOverlay.classList.remove("show-sidebar");
}

function showSidebar() {
    sidebarOverlay.classList.add("show-sidebar");
}

let taskArr = JSON.parse(localStorage.getItem("taskArr")) || [];
let editingTaskId = null;

taskArr.forEach((task, i) => createTaskHTML(task, i));

function createTaskHTML({ id, name, isDone, description }, index = 0) {
    const status = isDone ? "done" : "";

    const taskHTML = `
    <div class="task" data-id="${id}" style="animation-delay: ${index / 8}s;">
    <div class="container">
    <button data-info="Check" class="task-done-btn ${status}" data-id="${id}">
    <img src='assets/checked.svg' />
    </button>
    <h2 class="task-name ${status}">${name}</h2>
    </div>
    <div class="btn-container">
    <button class="edit-task-btn" data-info="Edit" data-id="${id}">
          <img src="assets/pencil.png" />
          </button>
          <button class="delete-task-btn" data-info="Delete" data-id="${id}">
          <img src='assets/cross.png' />
          </button>
      </div>
      <p class="description">${description || "No description."}</p>
      </div>`;

    list.insertAdjacentHTML("beforeend", taskHTML);
}

function addTask() {
    const nameInput = document.querySelector("#task-name-input");
    const descInput = document.querySelector("#task-desc-input");
    const name = nameInput.value.trim();
    const desc = descInput.value.trim();

    if (!name) return alert("Please enter a task name.");

    const newTask = {
        id: Date.now(),
        name,
        isDone: false,
        description: desc,
    };

    taskArr.push(newTask);
    localStorage.setItem("taskArr", JSON.stringify(taskArr));
    createTaskHTML(newTask);

    nameInput.value = "";
    descInput.value = "";
}

list.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) {
        const task = e.target.closest(".task");
        if (task) task.classList.toggle("show-desc");
        return;
    }

    const id = parseInt(btn.dataset.id);
    const li = btn.closest(".task");

    if (btn.classList.contains("task-done-btn")) {
        const task = taskArr.find((t) => t.id === id);
        task.isDone = !task.isDone;
        btn.classList.toggle("done");
        li.querySelector(".task-name").classList.toggle("done");
        saveTasks();
    }

    if (btn.classList.contains("delete-task-btn")) {
        li.remove();
        taskArr = taskArr.filter((t) => t.id !== id);
        saveTasks();
    }

    if (btn.classList.contains("edit-task-btn")) {
        editingTaskId = id;
        const task = taskArr.find((t) => t.id === id);
        document.querySelector("#edit-task-name").value = task.name;
        document.querySelector("#edit-task-desc").value = task.description;
        showModal();
    }
});

function editTask() {
    const nameInput = document.querySelector("#edit-task-name");
    const descInput = document.querySelector("#edit-task-desc");
    const newName = nameInput.value.trim();

    if (!newName) return alert("Task name can't be empty.");

    const task = taskArr.find((t) => t.id === editingTaskId);
    task.name = newName;
    task.description = descInput.value;
    saveTasks();

    const li = list.querySelector(`[data-id="${editingTaskId}"]`);
    li.querySelector(".task-name").textContent = newName;
    li.querySelector(".description").textContent =
        descInput.value || "No description.";

    closeModal();
}

function searchTasks() {
    const searchValue = searchInput.value.trim().toLowerCase();
    const tasks = document.querySelectorAll(".task");

    tasks.forEach((task) => {
        const name = task.querySelector(".task-name").textContent.toLowerCase();
        task.style.display = name.includes(searchValue) ? "flex" : "none";
    });
}

function saveTasks() {
    localStorage.setItem("taskArr", JSON.stringify(taskArr));
}

function showModal() {
    overlay.classList.add("show-modal");
}

function closeModal() {
    overlay.classList.remove("show-modal");
}

addBtn.addEventListener("click", addTask);
addInputs.forEach((input) =>
    input.addEventListener("keydown", (e) => e.key === "Enter" && addTask())
);

editBtn.addEventListener("click", editTask);
modalInputs.forEach((inp) =>
    inp.addEventListener("keydown", (e) => e.key === "Enter" && editTask())
);

overlay.addEventListener("click", (e) => e.target === overlay && closeModal());
closeModalBtn.addEventListener("click", closeModal);

searchInput.addEventListener("input", searchTasks);

sidebarOverlay.addEventListener(
    "click",
    (e) => e.target === sidebarOverlay && closeSidebar()
);
menuBtn.addEventListener("click", showSidebar);
clearInputBtns.forEach((btn) =>
    btn.addEventListener("click", (e) => {
        const input = e.currentTarget.previousElementSibling;
        input.value = "";
        searchTasks();
    })
);
closeSidebarBtn.addEventListener("click", closeSidebar);
darkmodeBtn.addEventListener("click", toggleDarkmode);
