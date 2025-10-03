const addInputs = document.querySelectorAll("#add-task-container input");
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

    arr.forEach(({ name, isDone, description }, index) => {
        const status = isDone ? "done" : "";

        let displayName = name;
        if (searchValue) {
            const regex = new RegExp(`(${searchValue})`, "ig");
            displayName = name.replace(regex, "<b>$1</b>");
        }

        const taskHTML = `
        <div class="task ${
            isFirstTime ? "animated" : ""
        }" style='animation-delay: ${index / 4}s;'>
        <div class="task-items-container">
                <div class="container">
                <button data-info="Check" class="task-done-btn ${status}">
                <img src='assets/checked.png' />
                    </button>
                    <h2 class="task-name ${status}">${displayName}</h2>
                </div>
                <div class="btn-container">
                <button class="edit-task-btn" data-info="Edit">
                        <img src="assets/pencil.png" />
                        </button>
                        <button class="delete-task-btn" data-info="Delete" data-task="${name}">
                        <img src='assets/cross.png' />
                        </button>
                        </div>
                        </div>
                        <p class="description">${
                            description || "No description"
                        }</p>
                        </div>`;
        list.innerHTML += taskHTML;
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
        name: name,
        isDone: false,
        description: desc,
    };

    if (task.name.length === 0) {
        alert("Please enter a task name.");
    } else if (taskArr.findIndex(({ name }) => name === task.name) !== -1) {
        alert("This task already exists.");
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
            const task = e.currentTarget.dataset.task;
            taskArr = taskArr.filter(({ name }) => name !== task);
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
            const button = e.currentTarget;
            const taskName =
                button.parentElement.querySelector(".task-name").textContent;

            button.classList.toggle("done");
            button.parentElement
                .querySelector(".task-name")
                .classList.toggle("done");

            taskArr = taskArr.map((task) =>
                task.name === taskName
                    ? { ...task, isDone: !task.isDone }
                    : task
            );

            localStorage.setItem("taskArr", JSON.stringify(taskArr));
        });
    });
}

function addDescViewEvents() {
    const tasks = document.querySelectorAll(".task");

    tasks.forEach((task) => {
        task.addEventListener("dblclick", (e) => {
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

    renderTasks(searchArr);
}

const showModal = () => overlay.classList.add("show-modal");
const closeModal = () => overlay.classList.remove("show-modal");

function addEditEvents() {
    const editBtns = document.querySelectorAll(".edit-task-btn");
    console.log(editBtns);
    editBtns.forEach((btn) => {
        btn.addEventListener("click", showModal);
    });
}

overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
});
closeModalBtn.addEventListener("click", closeModal);

addBtn.addEventListener("click", addTask);
addInputs.forEach((input) => {
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") addTask();
    });
});
searchInput.addEventListener("input", searchTasks);

renderTasks(taskArr);
