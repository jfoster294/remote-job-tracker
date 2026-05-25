const STORAGE_KEY = "bugflowOsTickets";

const teamMembers = [
  { name: "Joel Smith", role: "Super Admin", initials: "JS" },
  { name: "Maya Patel", role: "IT Technician", initials: "MP" },
  { name: "Alex Rivera", role: "Support Engineer", initials: "AR" },
  { name: "Sophia Clark", role: "Help Desk Analyst", initials: "SC" },
  { name: "Daniel Walker", role: "IT Technician", initials: "DW" }
];

const starterTickets = [
  {
    id: "TKT-1024",
    title: "Password reset required",
    requester: "Priya Patel",
    department: "HR",
    category: "Account Access",
    priority: "High",
    status: "Open",
    assignedTo: "Unassigned",
    description: "User cannot access their account and needs a password reset.",
    createdAt: "May 19, 2026 09:15 AM",
    updatedAt: "May 19, 2026 09:45 AM"
  },
  {
    id: "TKT-1023",
    title: "Office printer is offline",
    requester: "Michael Chen",
    department: "Operations",
    category: "Printer",
    priority: "Medium",
    status: "Open",
    assignedTo: "Alex Rivera",
    description: "Main office printer is showing offline for multiple users.",
    createdAt: "May 19, 2026 08:50 AM",
    updatedAt: "May 19, 2026 09:10 AM"
  },
  {
    id: "TKT-1022",
    title: "VPN not connecting from home",
    requester: "Sarah Johnson",
    department: "Engineering",
    category: "Network",
    priority: "High",
    status: "In Progress",
    assignedTo: "Maya Patel",
    description: "VPN disconnects immediately after login attempt.",
    createdAt: "May 19, 2026 08:20 AM",
    updatedAt: "May 19, 2026 09:02 AM"
  },
  {
    id: "TKT-1021",
    title: "New laptop setup for employee",
    requester: "David Lee",
    department: "IT",
    category: "Hardware",
    priority: "Low",
    status: "In Progress",
    assignedTo: "Joel Smith",
    description: "Prepare laptop with required apps for new hire.",
    createdAt: "May 19, 2026 07:45 AM",
    updatedAt: "May 19, 2026 08:40 AM"
  },
  {
    id: "TKT-1020",
    title: "Install Microsoft Office",
    requester: "Emily Davis",
    department: "Marketing",
    category: "Software",
    priority: "Medium",
    status: "Open",
    assignedTo: "Unassigned",
    description: "User needs Microsoft Office installed on work laptop.",
    createdAt: "May 19, 2026 07:30 AM",
    updatedAt: "May 19, 2026 07:30 AM"
  },
  {
    id: "TKT-1019",
    title: "Email not syncing in Outlook",
    requester: "James Wilson",
    department: "Finance",
    category: "Email",
    priority: "High",
    status: "In Progress",
    assignedTo: "Alex Rivera",
    description: "Outlook inbox stopped syncing this morning.",
    createdAt: "May 19, 2026 06:50 AM",
    updatedAt: "May 19, 2026 08:15 AM"
  },
  {
    id: "TKT-1018",
    title: "Monitor flickering issue",
    requester: "Lisa Brown",
    department: "Design",
    category: "Hardware",
    priority: "Low",
    status: "Open",
    assignedTo: "Maya Patel",
    description: "External monitor flickers when connected through dock.",
    createdAt: "May 18, 2026 05:20 PM",
    updatedAt: "May 18, 2026 05:45 PM"
  },
  {
    id: "TKT-1017",
    title: "Account locked out after multiple attempts",
    requester: "Robert Taylor",
    department: "Sales",
    category: "Account Access",
    priority: "High",
    status: "Open",
    assignedTo: "Unassigned",
    description: "Account locked after failed login attempts.",
    createdAt: "May 18, 2026 04:10 PM",
    updatedAt: "May 18, 2026 04:10 PM"
  }
];

let tickets = loadTickets();
let currentView = "dashboard";
let activities = [
  "TKT-1022 status changed to In Progress",
  "TKT-1024 created by Priya Patel",
  "TKT-1019 assigned to Alex Rivera",
  "TKT-1021 status changed to In Progress"
];

const navLinks = document.querySelectorAll(".nav-link");
const searchInput = document.getElementById("searchInput");
const priorityFilter = document.getElementById("priorityFilter");
const statusFilter = document.getElementById("statusFilter");
const ticketTableBody = document.getElementById("ticketTableBody");
const ticketCountText = document.getElementById("ticketCountText");
const ticketsTitle = document.getElementById("ticketsTitle");

const totalTickets = document.getElementById("totalTickets");
const openTickets = document.getElementById("openTickets");
const criticalTickets = document.getElementById("criticalTickets");
const progressTickets = document.getElementById("progressTickets");
const resolvedTickets = document.getElementById("resolvedTickets");

const teamList = document.getElementById("teamList");
const unassignedList = document.getElementById("unassignedList");
const unassignedCount = document.getElementById("unassignedCount");
const activityList = document.getElementById("activityList");

const submitSection = document.getElementById("submitSection");
const ticketForm = document.getElementById("ticketForm");
const newTicketButton = document.getElementById("newTicketButton");
const clearFormButton = document.getElementById("clearFormButton");
const resetButton = document.getElementById("resetButton");
const quickButtons = document.querySelectorAll(".quick-button");
const toast = document.getElementById("toast");

renderApp();

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    currentView = link.dataset.view;

    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");

    if (currentView === "submit") {
      submitSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    renderApp();
  });
});

searchInput.addEventListener("input", renderTickets);
priorityFilter.addEventListener("change", renderTickets);
statusFilter.addEventListener("change", renderTickets);

newTicketButton.addEventListener("click", () => {
  submitSection.scrollIntoView({ behavior: "smooth", block: "start" });
  document.getElementById("titleInput").focus();
});

clearFormButton.addEventListener("click", () => {
  ticketForm.reset();
  showToast("Ticket form cleared.");
});

resetButton.addEventListener("click", () => {
  const confirmed = confirm("Reset the demo tickets back to the original sample data?");

  if (!confirmed) {
    return;
  }

  tickets = [...starterTickets];
  saveTickets();
  activities.unshift("Demo data was reset");
  renderApp();
  showToast("Demo tickets reset.");
});

ticketForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newTicket = {
    id: createTicketId(),
    title: document.getElementById("titleInput").value.trim(),
    requester: document.getElementById("requesterInput").value.trim(),
    department: document.getElementById("departmentInput").value,
    category: document.getElementById("categoryInput").value,
    priority: document.getElementById("priorityInput").value,
    status: "Open",
    assignedTo: "Unassigned",
    description: document.getElementById("descriptionInput").value.trim(),
    createdAt: formatDateTime(new Date()),
    updatedAt: formatDateTime(new Date())
  };

  tickets.unshift(newTicket);
  activities.unshift(`${newTicket.id} created by ${newTicket.requester}`);

  saveTickets();
  ticketForm.reset();

  currentView = "all";
  setActiveNav("all");

  renderApp();
  showToast(`${newTicket.id} submitted. The full IT team can now see it in All Tickets.`);
});

ticketTableBody.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  const ticketId = button.dataset.id;
  const action = button.dataset.action;

  if (action === "assign") {
    assignTicket(ticketId);
  }

  if (action === "progress") {
    updateTicketStatus(ticketId, "In Progress");
  }

  if (action === "resolve") {
    updateTicketStatus(ticketId, "Resolved");
  }

  if (action === "delete") {
    deleteTicket(ticketId);
  }
});

quickButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.quick;

    const quickData = {
      outage: {
        title: "System outage reported",
        category: "Network",
        priority: "High"
      },
      access: {
        title: "Access request needed",
        category: "Account Access",
        priority: "Medium"
      },
      hardware: {
        title: "Hardware request",
        category: "Hardware",
        priority: "Medium"
      },
      software: {
        title: "Software installation request",
        category: "Software",
        priority: "Low"
      }
    };

    const selected = quickData[type];

    document.getElementById("titleInput").value = selected.title;
    document.getElementById("categoryInput").value = selected.category;
    document.getElementById("priorityInput").value = selected.priority;

    submitSection.scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById("requesterInput").focus();

    showToast("Quick action loaded into the ticket form.");
  });
});

function renderApp() {
  renderStats();
  renderTickets();
  renderTeam();
  renderUnassigned();
  renderActivities();
}

function renderStats() {
  totalTickets.textContent = tickets.length;
  openTickets.textContent = tickets.filter((ticket) => ticket.status === "Open").length;
  criticalTickets.textContent = tickets.filter((ticket) => ticket.priority === "High").length;
  progressTickets.textContent = tickets.filter((ticket) => ticket.status === "In Progress").length;
  resolvedTickets.textContent = tickets.filter((ticket) => ticket.status === "Resolved").length;
}

function renderTickets() {
  const filteredTickets = getFilteredTickets();

  ticketTableBody.innerHTML = "";

  ticketsTitle.textContent = getViewTitle();

  if (filteredTickets.length === 0) {
    ticketTableBody.innerHTML = `
      <tr>
        <td colspan="9">
          <div class="empty-row">
            No tickets match your current view or filters.
          </div>
        </td>
      </tr>
    `;

    ticketCountText.textContent = "Showing 0 tickets";
    return;
  }

  filteredTickets.forEach((ticket) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <span class="ticket-id">${escapeHTML(ticket.id)}</span>
      </td>

      <td class="ticket-title">
        <strong>${escapeHTML(ticket.title)}</strong>
        <small>${escapeHTML(ticket.description)}</small>
      </td>

      <td>${escapeHTML(ticket.requester)}</td>

      <td>
        <span class="badge ${getPriorityClass(ticket.priority)}">
          ${escapeHTML(ticket.priority)}
        </span>
      </td>

      <td>
        <span class="badge ${getStatusClass(ticket.status)}">
          ${escapeHTML(ticket.status)}
        </span>
      </td>

      <td>${escapeHTML(ticket.assignedTo)}</td>

      <td>${escapeHTML(ticket.department)}</td>

      <td>${escapeHTML(ticket.updatedAt)}</td>

      <td>
        <div class="action-row">
          <button class="icon-button" data-action="assign" data-id="${ticket.id}" title="Assign">
            👤
          </button>

          <button class="icon-button" data-action="progress" data-id="${ticket.id}" title="Move to In Progress">
            ↻
          </button>

          <button class="icon-button" data-action="resolve" data-id="${ticket.id}" title="Resolve">
            ✓
          </button>

          <button class="icon-button" data-action="delete" data-id="${ticket.id}" title="Delete">
            🗑
          </button>
        </div>
      </td>
    `;

    ticketTableBody.appendChild(row);
  });

  ticketCountText.textContent = `Showing ${filteredTickets.length} of ${tickets.length} total shared tickets`;
}

function getFilteredTickets() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedPriority = priorityFilter.value;
  const selectedStatus = statusFilter.value;

  return tickets.filter((ticket) => {
    const matchesSearch = `
      ${ticket.id}
      ${ticket.title}
      ${ticket.requester}
      ${ticket.department}
      ${ticket.category}
      ${ticket.priority}
      ${ticket.status}
      ${ticket.assignedTo}
      ${ticket.description}
    `.toLowerCase().includes(searchTerm);

    const matchesPriority = selectedPriority === "all" || ticket.priority === selectedPriority;
    const matchesStatus = selectedStatus === "all" || ticket.status === selectedStatus;
    const matchesView = getViewMatch(ticket);

    return matchesSearch && matchesPriority && matchesStatus && matchesView;
  });
}

function getViewMatch(ticket) {
  if (currentView === "dashboard" || currentView === "all" || currentView === "submit") {
    return true;
  }

  if (currentView === "mine" || currentView === "assigned") {
    return ticket.assignedTo === "Joel Smith";
  }

  if (currentView === "queue") {
    return ticket.assignedTo === "Unassigned";
  }

  if (currentView === "progress") {
    return ticket.status === "In Progress";
  }

  if (currentView === "resolved") {
    return ticket.status === "Resolved";
  }

  if (currentView === "knowledge") {
    return ticket.category === "Software" || ticket.category === "Account Access";
  }

  return true;
}

function getViewTitle() {
  const titles = {
    dashboard: "All IT Tickets",
    submit: "All IT Tickets",
    all: "All IT Tickets",
    mine: "My Tickets",
    queue: "Team Queue",
    assigned: "Assigned to Me",
    progress: "In Progress Tickets",
    resolved: "Resolved Tickets",
    knowledge: "Knowledge Base Related Tickets"
  };

  return titles[currentView] || "All IT Tickets";
}

function renderTeam() {
  teamList.innerHTML = "";

  teamMembers.forEach((member) => {
    const item = document.createElement("div");
    item.className = "team-member";

    item.innerHTML = `
      <div class="avatar">${member.initials}</div>
      <div>
        <strong>${member.name}</strong>
        <small>${member.role}</small>
      </div>
    `;

    teamList.appendChild(item);
  });
}

function renderUnassigned() {
  const unassignedTickets = tickets.filter((ticket) => ticket.assignedTo === "Unassigned");

  unassignedCount.textContent = unassignedTickets.length;
  unassignedList.innerHTML = "";

  unassignedTickets.slice(0, 4).forEach((ticket) => {
    const item = document.createElement("div");
    item.className = "mini-item";

    item.innerHTML = `
      <div class="avatar">!</div>
      <div>
        <strong>${escapeHTML(ticket.title)}</strong>
        <small>${escapeHTML(ticket.department)} • ${escapeHTML(ticket.priority)} Priority</small>
      </div>
    `;

    unassignedList.appendChild(item);
  });

  if (unassignedTickets.length === 0) {
    unassignedList.innerHTML = `
      <div class="mini-item">
        <div class="avatar">✓</div>
        <div>
          <strong>No unassigned tickets</strong>
          <small>The team queue is clear.</small>
        </div>
      </div>
    `;
  }
}

function renderActivities() {
  activityList.innerHTML = "";

  activities.slice(0, 5).forEach((activity, index) => {
    const item = document.createElement("div");
    item.className = "activity-item";

    item.innerHTML = `
      <div class="avatar">${index + 1}</div>
      <div>
        <strong>${escapeHTML(activity)}</strong>
        <small>${index + 2}m ago</small>
      </div>
    `;

    activityList.appendChild(item);
  });
}

function assignTicket(ticketId) {
  const ticket = tickets.find((item) => item.id === ticketId);

  if (!ticket) {
    return;
  }

  ticket.assignedTo = "Joel Smith";
  ticket.updatedAt = formatDateTime(new Date());

  activities.unshift(`${ticket.id} assigned to Joel Smith`);
  saveTickets();
  renderApp();
  showToast(`${ticket.id} assigned to Joel Smith.`);
}

function updateTicketStatus(ticketId, newStatus) {
  const ticket = tickets.find((item) => item.id === ticketId);

  if (!ticket) {
    return;
  }

  ticket.status = newStatus;
  ticket.updatedAt = formatDateTime(new Date());

  if (newStatus === "In Progress" && ticket.assignedTo === "Unassigned") {
    ticket.assignedTo = "Joel Smith";
  }

  activities.unshift(`${ticket.id} status changed to ${newStatus}`);
  saveTickets();
  renderApp();
  showToast(`${ticket.id} moved to ${newStatus}.`);
}

function deleteTicket(ticketId) {
  const confirmed = confirm(`Delete ${ticketId}?`);

  if (!confirmed) {
    return;
  }

  tickets = tickets.filter((ticket) => ticket.id !== ticketId);

  activities.unshift(`${ticketId} deleted from the queue`);
  saveTickets();
  renderApp();
  showToast(`${ticketId} deleted.`);
}

function createTicketId() {
  const highestNumber = tickets.reduce((highest, ticket) => {
    const number = Number(ticket.id.replace("TKT-", ""));
    return number > highest ? number : highest;
  }, 1000);

  return `TKT-${highestNumber + 1}`;
}

function formatDateTime(date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getPriorityClass(priority) {
  if (priority === "High") {
    return "badge-high";
  }

  if (priority === "Medium") {
    return "badge-medium";
  }

  return "badge-low";
}

function getStatusClass(status) {
  if (status === "Open") {
    return "badge-open";
  }

  if (status === "In Progress") {
    return "badge-progress";
  }

  return "badge-resolved";
}

function setActiveNav(view) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.view === view);
  });
}

function loadTickets() {
  const savedTickets = localStorage.getItem(STORAGE_KEY);

  if (!savedTickets) {
    return [...starterTickets];
  }

  try {
    return JSON.parse(savedTickets);
  } catch (error) {
    console.error("Could not load saved tickets:", error);
    return [...starterTickets];
  }
}

function saveTickets() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
