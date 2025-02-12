export const englishTranslations = {
  common: {
    dashboard: "Dashboard",
    upload: "Upload",
    settings: "Settings",
    logout: "Logout",
    success: "Success",
    error: "Error",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    confirm: "Confirm",
    back: "Back",
    business: "Business",
    chat: "Chat"
  },
  dashboard: {
    totalSales: "Total Sales",
    products: "Products",
    customers: "Customers",
    smartActions: "Smart Actions",
    noActions: "No actions to display",
    caughtUp: "All caught up! We'll notify you when there's something new.",
    stores: {
      title: "Your Stores",
      subtitle: "Manage your store documents and settings",
      noStores: "No stores found. Create your first store to get started."
    },
    upload: {
      title: "Upload Documents",
      subtitle: "Upload and manage your store documents",
      chatTitle: "Chat with your documents"
    },
    permissions: {
      noAccess: "You don't have permission to access this page. This page is only accessible to managers."
    }
  },
  settings: {
    settings: "Settings",
    general: "General",
    business: "Business",
    notifications: "Notifications",
    staff: "Staff & Permissions",
    integrations: "Integrations",
    theme: "Theme",
    language: "Language",
    dark: "Dark",
    light: "Light",
    system: "System",
    businessName: "Business Name",
    enterBusinessName: "Enter your business name",
    timezone: "Timezone",
    selectTimezone: "Select timezone",
    salesThreshold: "Sales Alert Threshold",
    inventoryAlert: "Low Stock Alert Level",
    webhookUrls: "Webhook URLs",
    manageStaff: "Manage Staff",
    positions: "Positions",
    generalDescription: "Configure your basic application settings",
    businessDescription: "Manage your business settings and preferences",
    notificationsDescription: "Configure your notification preferences",
    staffDescription: "Manage staff members and their permissions",
    integrationsDescription: "Configure external service integrations",
    emailNotifications: "Email Notifications",
    pushNotifications: "Push Notifications",
    selectEmailFrequency: "Select email frequency",
    selectNotificationType: "Select notification type",
    instant: "Instant",
    dailyDigest: "Daily Digest",
    weeklySummary: "Weekly Summary",
    allNotifications: "All Notifications",
    importantOnly: "Important Only",
    disabled: "Disabled",
    webhookConfiguration: "Webhook Configuration",
    uploadWebhookUrl: "Upload Webhook URL",
    chatWebhookUrl: "Chat Webhook URL",
    enterUploadWebhookUrl: "Enter upload webhook URL",
    enterChatWebhookUrl: "Enter chat webhook URL",
    reconciliation: {
      title: "Reconciliation",
      description: "Configure reconciliation settings and preferences",
      threshold: "Threshold",
      thresholdDescription: "Set the percentage difference that triggers a reconciliation alert",
      autoResolve: "Auto Resolve",
      autoResolveDescription: "Automatically resolve discrepancies within threshold",
      defaultResolution: "Default Resolution",
      selectResolution: "Select resolution method",
      systemValue: "Use System Value",
      uploadedValue: "Use Uploaded Value",
      manualReview: "Manual Review"
    }
  },
  upload: {
    title: "Upload Files",
    dragDrop: "Drag and drop files here",
    browse: "Browse files",
    uploading: "Uploading...",
    success: "File uploaded successfully",
    error: "Error uploading file"
  },
  auth: {
    signIn: "Sign In",
    signUp: "Sign Up",
    email: "Email",
    password: "Password",
    fullName: "Full Name",
    loginSuccess: "Successfully logged in",
    loginError: "Failed to login",
    logoutSuccess: "Successfully logged out",
    logoutError: "Failed to logout"
  },
  business: {
    title: "Business Control",
    tabs: {
      salesInventory: "Sales & Inventory",
      customersOrders: "Customers & Orders",
      financial: "Financial",
      team: "Team",
      reconciliation: "Reconciliation"
    },
    financial: {
      revenue: "Revenue (7 days)",
      pendingPayments: "Pending Payments",
      averageOrder: "Average Order Value",
      weeklyRevenue: "Weekly Revenue"
    },
    sales: {
      totalSales: "Total Sales",
      lowStockItems: "Low Stock Items",
      alerts: "Alerts",
      salesTrend: "Sales Trend",
      lowStockAlerts: "Low Stock Alerts",
      actionNeeded: "Action Needed",
      allGood: "All Good",
      itemsLeft: "left"
    },
    customers: {
      totalCustomers: "Total Customers",
      activeCustomers: "Active Customers",
      inactiveCustomers: "Inactive Customers",
      recentOrders: "Recent Orders",
      customer: "Customer",
      amount: "Amount",
      status: "Status",
      date: "Date"
    },
    team: {
      totalStaff: "Total Staff",
      activeTasks: "Active Tasks",
      completedTasks: "Completed Tasks",
      staffOverview: "Staff Overview",
      recentTasks: "Recent Tasks",
      name: "Name",
      position: "Position",
      status: "Status",
      task: "Task",
      assignedTo: "Assigned To",
      priority: "Priority"
    }
  },
  chat: {
    title: "Chat",
    description: "Chat with your documents and get instant answers."
  },
  reconciliation: {
    tabs: {
      overview: "Overview",
      upload: "Upload"
    },
    dashboard: {
      title: "Reconciliation Dashboard",
      filter: "Filter",
      filterByStatus: "Filter by Status",
      noJobs: "No reconciliation jobs found"
    },
    status: {
      all: "All",
      pending: "Pending",
      inProgress: "In Progress",
      completed: "Completed",
      failed: "Failed"
    },
    fields: {
      type: "Type",
      createdAt: "Created At",
      status: "Status",
      actions: "Actions"
    },
    errors: {
      loadFailed: "Failed to load reconciliation jobs"
    }
  }
};
