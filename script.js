const TICKET_STORAGE_KEY = "bugflowOsTickets";
const PERSONNEL_STORAGE_KEY = "bugflowOsPersonnel";
const ACTIVITY_STORAGE_KEY = "bugflowOsActivities";

const roleConfig = {
  requester: {
    name: "Priya Patel",
    label: "User Portal",
    title: "Employee / Requester",
    topbarTitle: "Submit And Track IT Tickets",
    accessTitle: "Requester Access",
    accessLabel: "MY TICKETS ONLY",
    accessText: "Users can submit incidents and only view their own submitted tickets."
  },
  staff: {
    name: "Maya Patel",
    label: "IT Staff",
    title: "IT Technician",
    topbarTitle: "IT Staff Dashboard",
    accessTitle: "IT Staff Access",
    accessLabel: "TEAM QUEUE",
    accessText: "IT staff can view the ticket queue, claim work, update status, and add notes."
  },
  admin: {
    name: "Joel Foster",
    label: "Admin Command Center",
    title: "Super Admin",
    topbarTitle: "Admin Command Center",
    accessTitle: "Admin Access",
    accessLabel: "FULL CONTROL",
    accessText: "Admins can assign tickets, manage personnel, delete tickets, and monitor workload."
  }
};

const starterPersonnel = [
  { id: 1, name: "Joel Foster", role: "Admin", initials: "JF", status: "Online" },
  { id: 2, name: "Maya Patel", role: "IT Technician", initials: "MP", status: "Online" },
  { id: 3, name: "Alex Rivera", role: "Support Engineer", initials: "AR", status: "Online" },
  { id: 4, name: "Sophia Clark", role: "Help Desk Analyst", initials: "SC", status: "Busy" },
  { id: 5, name: "Daniel Walker", role: "IT Technician", initials: "DW", status: "Online" }
];

const starterTickets = [
  {
    id: "TKT-1024",
    title: "Password reset required",
    requester: "Priya Patel",
    submittedBy: "Priya Patel",
    department: "HR",
    category: "Account Access",
    priority: "High",
    status: "Open",
    assignedTo: "Unassigned",
    description: "User cannot access their account and needs a password reset.",
    createdAt: "May 19, 2026 09:15 AM",
    updatedAt: "May 19, 2026 09:45 AM",
    comments: [
      {
        author: "Priya Patel",
        role: "User",
        message: "I need access before payroll closes today.",
        time: "May 19, 2026 09:45 AM"
      }
    ],
    timeline: [
      "Ticket created by Priya Patel",
      "User added extra context"
    ]
  },
  {
    id: "TKT-1023",
    title: "Office printer is offline",
    requester: "Michael Chen",
    submittedBy: "Michael Chen",
    department: "Operations",
    category: "Printer",
    priority: "Medium",
    status: "Open",
    assignedTo: "Alex Rivera",
    description: "Main office printer is showing offline for multiple users.",
    createdAt: "May 19, 2026 08:50 AM",
    updatedAt: "May 19, 2026 09:10 AM",
    comments: [],
    timeline: [
      "Ticket created by Michael Chen",
      "Assigned to Alex Rivera"
    ]
  },
  {
    id: "TKT-1022",
    title: "VPN not connecting from home",
    requester: "Sarah Johnson",
    submittedBy: "Sarah Johnson",
    department: "Engineering",
    category: "Network",
    priority: "High",
    status: "In Progress",
    assignedTo: "Maya Patel",
    description: "VPN disconnects immediately after login attempt.",
    createdAt: "May 19, 2026 08:20 AM",
    updatedAt: "May 19, 2026 09:02 AM",
    comments: [
      {
        author: "Maya Patel",
        role: "IT Staff",
        message: "Checking VPN profile and recent account changes.",
        time: "May 19, 2026 09:02 AM"
      }
    ],
    timeline: [
      "Ticket created by Sarah Johnson",
      "Assigned to Maya Patel",
      "Status changed to In Progress"
    ]
  },
  {
    id: "TKT-1021",
    title: "New laptop setup for employee",
    requester: "David Lee",
    submittedBy: "David Lee",
    department: "IT",
    category: "Hardware",
    priority: "Low",
    status: "In Progress",
    assignedTo: "Joel Foster",
    description: "Prepare laptop with required apps for new hire.",
    createdAt: "May 19, 2026 07:45 AM",
    updatedAt: "May 19, 2026 08:40 AM",
    comments: [],
    timeline: [
      "Ticket created by David Lee",
      "Assigned to Joel Foster",
      "Status changed to In Progress"
    ]
  },
  {
    id: "TKT-1020",
    title: "Install Microsoft Office",
    requester: "Emily Davis",
    submittedBy: "Emily Davis",
    department: "Marketing",
    category: "Software",
    priority: "Medium",
    status: "Open",
    assignedTo: "Unassigned",
    description: "User needs Microsoft Office installed on work laptop.",
    createdAt: "May 19, 2026 07:30 AM",
    updatedAt: "May 19, 2026 07:30 AM",
    comments: [],
    timeline: [
      "Ticket created by Emily Davis"
    ]
  },
  {
    id: "TKT-1019",
    title: "Email not syncing in Outlook",
    requester: "James Wilson",
    submittedBy: "James Wilson",
    department: "Finance",
    category: "Email",
    priority: "High",
    status: "In Progress",
    assignedTo: "Alex Rivera",
    description: "Outlook inbox stopped syncing this morning.",
    createdAt: "May 19, 2026 06:50 AM",
    updatedAt: "May 19, 2026 08:15 AM",
    comments: [],
    timeline: [
      "Ticket created by James Wilson",
      "Assigned to Alex Rivera",
      "Status changed to In Progress"
