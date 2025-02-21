const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Function to load tasks
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    taskList.innerHTML = ""; // Clear task list before adding
    tasks.forEach((task, index) => createTaskElement(task.text, task.timestamp, index));

    // 🔥 Call enableDragAndDrop after loading tasks
    enableDragAndDrop();
}

// Function to save tasks in LocalStorage
function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to create a task element
function createTaskElement(taskText, timestamp, index) {
    const li = document.createElement("li");
    li.innerHTML = `<span>${taskText}</span> <small>📅 ${timestamp}</small>`;
    li.setAttribute("draggable", "true"); // ✅ Make item draggable

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", () => {
        deleteTask(index);
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

// Function to add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const now = new Date();
    const formattedTime = now.toLocaleString("en-US",{
        year: "numeric",  
        month: "2-digit",  
        day: "2-digit",  
        hour: "2-digit",  
        minute: "2-digit",  
        hour12: true, 
    }); // 📅 Format: DD/MM/YYYY, HH:MM AM/PM
    
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text: taskText, timestamp: formattedTime });
    
    saveTasks(tasks);
    loadTasks();
    taskInput.value = "";
}

// Function to delete a task
function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(index, 1);
    saveTasks(tasks);
    loadTasks();
}

// Event listeners
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

// Drag-and-Drop Functionality
let draggedIndex = null;

function enableDragAndDrop() {
    const taskItems = document.querySelectorAll("#taskList li");

    taskItems.forEach((item, index) => {
        item.setAttribute("draggable", "true");

        item.addEventListener("dragstart", (event) => {
            draggedIndex = index;
            event.dataTransfer.setData("text/plain", index); // ✅ Store index
            event.target.style.opacity = "0.5";
        });

        item.addEventListener("dragend", (event) => {
            event.target.style.opacity = "1";
        });

        item.addEventListener("dragover", (event) => {
            event.preventDefault(); // ✅ Allow dropping
        });

        item.addEventListener("drop", (event) => {
            event.preventDefault();
            const droppedIndex = parseInt(event.dataTransfer.getData("text/plain"), 10); // ✅ Get dragged index

            if (droppedIndex !== index) {
                const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

                // Swap tasks in array
                [tasks[droppedIndex], tasks[index]] = [tasks[index], tasks[droppedIndex]];

                saveTasks(tasks);
                loadTasks(); // 🔥 Refresh and reattach events
            }
        });
    });
}

// Load tasks when the page loads
loadTasks();

const themeToggleBtn = document.createElement("button");
themeToggleBtn.textContent = "🌙 Dark Mode";
themeToggleBtn.classList.add("theme-toggle-btn");
document.body.appendChild(themeToggleBtn);

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    // To check current mode
    if (document.body.classList.contains("dark-mode")) {
        themeToggleBtn.textContent = "☀️ Light Mode";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggleBtn.textContent = "🌙 Dark Mode";
        localStorage.setItem("theme", "light");
    }
}

// Check saved theme in localStorage and apply it
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggleBtn.textContent = "☀️ Light Mode";
}

// Working of mode button
themeToggleBtn.addEventListener("click", toggleDarkMode);

// Change font
const changeFontBtn = document.getElementById("changeFontBtn");

// List of fonts
const fonts = [
    "Arial, sans-serif",
    "'Courier New', monospace",
    "'Times New Roman', serif",
    "Verdana, sans-serif",
    "Georgia, serif",
    "Tahoma, sans-serif",
    "'Comic Sans MS', cursive",
    "Impact, sans-serif",
    "'Lucida Console', monospace",
    "'Trebuchet MS', sans-serif"
];

let currentFontIndex = 0;
const savedFont = localStorage.getItem("selectedFont");
if (savedFont) {
    document.body.style.fontFamily = savedFont;
    currentFontIndex = fonts.indexOf(savedFont) !== -1 ? fonts.indexOf(savedFont) : 0;
}

// Function to change font 
function changeFont() {
    currentFontIndex = (currentFontIndex + 1) % fonts.length;
    const selectedFont = fonts[currentFontIndex];

    document.body.style.fontFamily = selectedFont;
    localStorage.setItem("selectedFont", selectedFont);
}

// Add event to change font 
changeFontBtn.addEventListener("click", changeFont);

const fontSizeBtn = document.createElement("button");
fontSizeBtn.textContent = "🔠 Change Font Size";
fontSizeBtn.classList.add("font-size-btn");
document.body.appendChild(fontSizeBtn);

const fontSizes = ["small", "medium", "large"];
let currentFontSizeIndex = 1;

const savedFontSize = localStorage.getItem("fontSize");
applyFontSize(savedFontSize);

function applyFontSize(size) {
    document.body.style.fontSize = size === "small" ? "14px" : size === "large" ? "22px" : "18px";
    localStorage.setItem("fontSize", size);
}

fontSizeBtn.addEventListener("click", () => {
    currentFontSizeIndex = (currentFontSizeIndex + 1) % fontSizes.length;
    applyFontSize(fontSizes[currentFontSizeIndex]);
});


// Function to update task color
