const bugForm = document.getElementById("bugForm");
const projectInput = document.getElementById("projectInput");
const titleInput = document.getElementById("titleInput");
const priorityInput = document.getElementById("priorityInput");
const statusInput = document.getElementById("statusInput");
const dateInput = document.getElementById("dateInput");
const notesInput = document.getElementById("notesInput");

const issuesList = document.getElementById("issuesList");
const emptyState = document.getElementById("emptyState");
const listMessage = document.getElementById("listMessage");

const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");
const filterPriority = document.getElementById("filterPriority");
const clearAllButton = document.getElementById("clearAllButton");
const themeSelect = document.getElementById("themeSelect");

const totalCount = document.getElementById("totalCount");
const openCount = document.getElementById("openCount");
const progressCount = document.getElementById("progressCount");
const fixedCount = document.getElementById("fixedCount");

let issues = JSON.parse(localStorage.getItem("bugFlowIssues")) || [];

const themeClasses = [
  "theme-clean",
  "theme-terminal",
  "theme-focus",
  "theme-cyber",
  "theme-warm"
];

themeSelect.addEventListener("change", function () {
  applyTheme(themeSelect.value);
});

bugForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const project = projectInput.value.trim();
  const title = titleInput.value.trim();
  const priority = priorityInput.value;
  const status = statusInput.value;
  const date = dateInput.value;
  const notes = notesInput.value.trim();

  if (project === "" || title === "") {
    return;
  }

  const issue = {
    id: Date.now(),
    project: project,
    title: title,
    priority: priority,
    status: status,
    date: date,
    notes: notes
  };

  issues.unshift(issue);
  saveIssues();
  renderIssues();

  bugForm.reset();
  priorityInput.value = "Medium";
  statusInput.value = "Open";
  setTodayDate();
});

searchInput.addEventListener("input", function () {
  renderIssues();
});

filterStatus.addEventListener("change", function () {
  renderIssues();
});

filterPriority.addEventListener("change", function () {
  renderIssues();
});

clearAllButton.addEventListener("click", function () {
  if (issues.length === 0) {
    return;
  }

  const confirmClear = confirm("Clear all saved bugs and issues?");

  if (confirmClear) {
    issues = [];
    saveIssues();
    renderIssues();
  }
});

issuesList.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-button")) {
    const id = Number(event.target.dataset.id);

    issues = issues.filter(function (issue) {
      return issue.id !== id;
    });

    saveIssues();
    renderIssues();
  }
});

issuesList.addEventListener("change", function (event) {
  const id = Number(event.target.dataset.id);

  if (event.target.classList.contains("status-select")) {
    const newStatus = event.target.value;

    issues = issues.map(function (issue) {
      if (issue.id === id) {
        return {
          ...issue,
          status: newStatus
        };
      }

      return issue;
    });

    saveIssues();
    renderIssues();
  }

  if (event.target.classList.contains("priority-select")) {
    const newPriority = event.target.value;

    issues = issues.map(function (issue) {
      if (issue.id === id) {
        return {
          ...issue,
          priority: newPriority
        };
      }

      return issue;
    });

    saveIssues();
    renderIssues();
  }
});

function applyTheme(theme) {
  document.body.classList.remove(...themeClasses);
  document.body.classList.add(`theme-${theme}`);
  localStorage.setItem("selectedBugFlowTheme", theme);
}

function saveIssues() {
  localStorage.setItem("bugFlowIssues", JSON.stringify(issues));
}

function renderIssues() {
  issuesList.innerHTML = "";

  const searchText = searchInput.value.toLowerCase().trim();
  const selectedStatus = filterStatus.value;
  const selectedPriority = filterPriority.value;

  const filteredIssues = issues.filter(function (issue) {
    const matchesSearch =
      issue.project.toLowerCase().includes(searchText) ||
      issue.title.toLowerCase().includes(searchText);

    const matchesStatus =
      selectedStatus === "All" || issue.status === selectedStatus;

    const matchesPriority =
      selectedPriority === "All" || issue.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  updateStats();

  listMessage.textContent = `${filteredIssues.length} showing`;

  if (filteredIssues.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  filteredIssues.forEach(function (issue) {
    const card = createIssueCard(issue);
    issuesList.appendChild(card);
  });
}

function createIssueCard(issue) {
  const card = document.createElement("article");
  card.className = "issue-card";

  const top = document.createElement("div");
  top.className = "issue-top";

  const titleBlock = document.createElement("div");

  const title = document.createElement("h3");
  title.textContent = issue.title;

  const project = document.createElement("p");
  project.className = "project-name";
  project.textContent = issue.project;

  titleBlock.appendChild(title);
  titleBlock.appendChild(project);

  const badges = document.createElement("div");
  badges.className = "badges";

  const statusBadge = document.createElement("span");
  statusBadge.className = "badge";
  statusBadge.textContent = issue.status;

  const priorityBadge = document.createElement("span");
  priorityBadge.className = `badge ${getPriorityClass(issue.priority)}`;
  priorityBadge.textContent = issue.priority;

  badges.appendChild(statusBadge);
  badges.appendChild(priorityBadge);

  top.appendChild(titleBlock);
  top.appendChild(badges);

  const meta = document.createElement("div");
  meta.className = "issue-meta";

  const date = document.createElement("p");
  date.innerHTML = `<strong>Date Found:</strong> ${formatDate(issue.date)}`;

  const notes = document.createElement("p");
  notes.innerHTML = `<strong>Notes:</strong> ${issue.notes || "No notes added"}`;

  meta.appendChild(date);
  meta.appendChild(notes);

  const actions = document.createElement("div");
  actions.className = "issue-actions";

  const statusSelect = document.createElement("select");
  statusSelect.className = "status-select";
  statusSelect.dataset.id = issue.id;

  ["Backlog", "Open", "In Progress", "Testing", "Fixed", "Closed"].forEach(function (status) {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status;

    if (issue.status === status) {
      option.selected = true;
    }

    statusSelect.appendChild(option);
  });

  const prioritySelect = document.createElement("select");
  prioritySelect.className = "priority-select";
  prioritySelect.dataset.id = issue.id;

  ["Low", "Medium", "High", "Critical"].forEach(function (priority) {
    const option = document.createElement("option");
    option.value = priority;
    option.textContent = priority;

    if (issue.priority === priority) {
      option.selected = true;
    }

    prioritySelect.appendChild(option);
  });

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.dataset.id = issue.id;
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";

  actions.appendChild(statusSelect);
  actions.appendChild(prioritySelect);
  actions.appendChild(deleteButton);

  card.appendChild(top);
  card.appendChild(meta);
  card.appendChild(actions);

  return card;
}

function updateStats() {
  totalCount.textContent = issues.length;

  openCount.textContent = issues.filter(function (issue) {
    return issue.status === "Open";
  }).length;

  progressCount.textContent = issues.filter(function (issue) {
    return issue.status === "In Progress";
  }).length;

  fixedCount.textContent = issues.filter(function (issue) {
    return issue.status === "Fixed" || issue.status === "Closed";
  }).length;
}

function getPriorityClass(priority) {
  if (priority === "Critical") {
    return "priority-critical";
  }

  if (priority === "High") {
    return "priority-high";
  }

  if (priority === "Medium") {
    return "priority-medium";
  }

  return "priority-low";
}

function formatDate(dateString) {
  if (!dateString) {
    return "Not added";
  }

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function setTodayDate() {
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;
}

const savedTheme = localStorage.getItem("selectedBugFlowTheme") || "clean";
themeSelect.value = savedTheme;
applyTheme(savedTheme);

setTodayDate();
renderIssues();
