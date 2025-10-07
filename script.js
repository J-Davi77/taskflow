const addInputs = document.querySelectorAll("#add-task-container input");
const modalInputs = document.querySelectorAll("#modal input");
const list = document.querySelector("#task-container");
const addBtn = document.querySelector("#add-task-btn");
const searchInput = document.querySelector("#search-input");
const overlay = document.querySelector("#modal-overlay");
const editBtn = document.querySelector("#edit-btn");
const closeModalBtn = document.querySelector("#close-modal-btn");

let taskArr = JSON.parse(localStorage.getItem("taskArr")) || [];
let isFirstTime = true;

function renderTasks(arr) {
    list.innerHTML = "";
    const searchValue = searchInput.value.trim().toLowerCase();
    let html = '';
    arr.forEach(({ id, name, isDone, description }, index) => {
        const status = isDone ? "done" : "";

        let displayName = name;
        if (searchValue) {
            const regex = new RegExp(`(${searchValue})`, "ig");
            displayName = name.replace(regex, `<b class="bold">$1</b>`);
        }

        const taskHTML = `
        <div class="task ${
            isFirstTime ? "animated" : ""
        }" style='animation-delay: ${index / 4}s;'>
                <div class="container">
                    <button data-info="Check" class="task-done-btn ${status}" data-id="${id}">
                        <img src='assets/checked.png' />
                    </button>
                    <h2 class="task-name ${status}">${displayName}</h2>
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
        html += taskHTML;
    });

    if (isFirstTime) {
        const animatedTasks = document.querySelectorAll(".task.animated");
        animatedTasks.forEach((task) => {
            setTimeout(
                () => task.classList.remove("animated"),
                (taskArr.length / 4) * 1000
            );
        });
    }
    list.innerHTML = html;
    isFirstTime = false;

    addDeleteEvents();
    finishTasks();
    addDescViewEvents();
    addEditEvents();
}

function addTask() {
    const nameInput = document.querySelector("#task-name-input");
    const name = nameInput.value.trim();
    const descInput = document.querySelector("#task-desc-input");
    const desc = descInput.value.trim();

    const task = {
        id: Date.now(),
        name: name,
        isDone: false,
        description: desc,
    };

    if (task.name.length === 0) {
        alert("Please enter a task name.");
    } else {
        taskArr.push(task);
        localStorage.setItem("taskArr", JSON.stringify(taskArr));
        renderTasks(taskArr);
    }

    nameInput.value = "";
    descInput.value = "";
}

function addDeleteEvents() {
    const deleteBtns = document.querySelectorAll(".delete-task-btn");
    deleteBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const taskId = parseInt(e.currentTarget.dataset.id);
            taskArr = taskArr.filter(({ id }) => id !== taskId);
            localStorage.setItem("taskArr", JSON.stringify(taskArr));

            if (searchInput.value.trim()) {
                searchTasks();
            } else {
                renderTasks(taskArr);
            }
        });
    });
}

function finishTasks() {
    const finishBtns = document.querySelectorAll(".task-done-btn");
    finishBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const taskId = parseInt(e.currentTarget.dataset.id);

            taskArr = taskArr.map((task) =>
                task.id === taskId ? { ...task, isDone: !task.isDone } : task
            );

            localStorage.setItem("taskArr", JSON.stringify(taskArr));
            btn.classList.toggle("done");
            btn.nextElementSibling.classList.toggle("done");
        });
    });
}

function addDescViewEvents() {
    const tasks = document.querySelectorAll(".task");

    tasks.forEach((task) => {
        task.addEventListener("click", (e) => {
            if (e.target.closest("button")) return;
            task.classList.toggle("show-desc");
        });
    });
}

function searchTasks() {
    const searchValue = searchInput.value.trim().toLowerCase();
    const searchArr = taskArr.filter(({ name }) => {
        return name.toLowerCase().includes(searchValue);
    });

    searchArr.length > 0
        ? renderTasks(searchArr)
        : (list.innerHTML = "No tasks found.");
}

const showModal = () => {
    overlay.classList.add("show-modal");
};

const closeModal = () => overlay.classList.remove("show-modal");

let editingTaskId = null;
function addEditEvents() {
    const editBtns = document.querySelectorAll(".edit-task-btn");
    editBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            editingTaskId = parseInt(e.currentTarget.dataset.id);
            const task = taskArr.find((task) => task.id === editingTaskId);
            const editNameInput = document.querySelector("#edit-task-name");
            const editDescInput = document.querySelector("#edit-task-desc");
            editNameInput.value = task.name;
            editDescInput.value = task.description;

            showModal();
        });
    });
}
function editTask() {
    const editNameInput = document.querySelector("#edit-task-name");
    const editDescInput = document.querySelector("#edit-task-desc");
    if (editNameInput.value.trim()) {
        const task = taskArr.find((task) => task.id === editingTaskId);
        task.name = editNameInput.value;
        task.description = editDescInput.value;
        localStorage.setItem("taskArr", JSON.stringify(taskArr));
        renderTasks(taskArr);
        closeModal();
    } else alert("Task name can't be empty.");
}

editBtn.addEventListener("click", editTask);

overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
});

closeModalBtn.addEventListener("click", closeModal);

modalInputs.forEach((inp) =>
    inp.addEventListener("keydown", (e) => e.key === "Enter" && editTask())
);

addBtn.addEventListener("click", addTask);
addInputs.forEach((input) => {
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") addTask();
    });
});
searchInput.addEventListener("input", searchTasks);

renderTasks(taskArr);
