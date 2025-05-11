const projectName = document.getElementById("textVal");
const addBtn = document.getElementById("addBtn");
const taskBoxes = document.getElementsByClassName("tasksSection");

let projects = {};

function addProject() {
  if (projectName.value.trim() === "") {
    alert("Please enter a project name.");
    return;
  }

  let projectInfo = {
    projectName: projectName.value,
    id: `id_${Date.now()}`,
    location: "progress",
  };
  // add projectInfo to the main projects object
  projects[`${projectInfo.id}`] = projectInfo;

  // select render location based on projectInfo location
  const progressList = document.querySelector(
    `[data-type="${projectInfo.location}"]`
  );

  // render to the page
  renderProjects(projectInfo, progressList);
  // add to local storage
  setToLocalStorage();
  // clear input field
  projectName.value = "";
}

// create element and render it at target location
function renderProjects(project, projectlocation) {
  const li = document.createElement("li");
  li.setAttribute("id", project.id);
  li.setAttribute("draggable", "true");
  li.textContent = project.projectName;
  projectlocation.appendChild(li);

  li.addEventListener("dragstart", dragstartFun);
}

// Add new project to html page
addBtn.addEventListener("click", function (e) {
  e.preventDefault();
  addProject();
});

// adding drag and drop functionality

for (let i = 0; i < taskBoxes.length; i++) {
  taskBoxes[i].addEventListener("drop", dropFunc);
  taskBoxes[i].addEventListener("dragover", dragoverFunc);
}

function dragstartFun(e) {
  console.log("item drag start", e.target.id);
  e.dataTransfer.setData("text", e.target.id);
}

function dropFunc(e) {
  console.log("drop");
  e.dataTransfer.getData("text");

  let dragedItem = document.getElementById(e.dataTransfer.getData("text"));

  this.appendChild(dragedItem);

  // change project location after droped in new location
  projects[`${e.dataTransfer.getData("text")}`].location =
    dragedItem.parentElement.dataset.type;
  // set updated location to the local storage
  setToLocalStorage();
}

function dragoverFunc(e) {
  e.preventDefault();
}

// set to local Storage
function setToLocalStorage() {
  localStorage.setItem("project", JSON.stringify(projects));
}

// get projects from local storage and render it
if (localStorage.getItem("project") != null) {
  projects = JSON.parse(localStorage.getItem("project"));

  const objKeys = Object.keys(projects);

  objKeys.map((projectId) => {
    const progressList = document.querySelector(
      `[data-type="${projects[`${projectId}`].location}"]`
    );

    renderProjects(projects[projectId], progressList);
  });
}
