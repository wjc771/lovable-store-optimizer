
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
    chat: "Chat",
    reset: "Reset Defaults",
    actions: "Actions"
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
    title: "Settings",
    settings: "Settings",
    general: "General",
    business: "Business",
    notifications: "Notifications",
    staff: "Staff & Permissions",
    smartActions: "Smart Actions",
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
    notificationSettings: "Notification Settings",
    notImplemented: "This feature is not implemented yet.",

    // Smart Actions translations
    revenueAlerts: "Revenue Alerts",
    revenueAlertsDescription: "Configure thresholds for daily revenue alerts",
    revenueThreshold: "Revenue Threshold",
    revenueThresholdTooltip: "Minimum expected daily revenue value",
    percentageChange: "Percentage Change",
    percentageChangeTooltip: "Percentage variation that will trigger an alert",
    
    inventoryAlerts: "Inventory Alerts",
    inventoryAlertsDescription: "Configure alert levels for low stock items",
    lowThreshold: "Low Level",
    lowThresholdTooltip: "Quantity that defines a low stock item",
    criticalThreshold: "Critical Level",
    criticalThresholdTooltip: "Quantity that defines a critical stock item",
    
    paymentReminders: "Payment Reminders",
    paymentRemindersDescription: "Configure reminders for pending payments",
    reminderDays: "Reminder Days",
    reminderDaysTooltip: "Number of days after which a reminder will be sent",
    
    errorLoadingThresholds: "Error loading settings",
    errorSavingThresholds: "Error saving settings",
    thresholdsSaved: "Settings saved successfully",

    tabs: {
      general: "General",
      business: "Business",
      staff: "Staff",
      integrations: "Integrations",
      notifications: "Notifications",
      smartActions: "Smart Actions",
      products: "Products",
      reconciliation: "Reconciliation",
      admin: "Admin"
    },

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
    welcome: "Welcome",
    loginSuccess: "Successfully logged in",
    loginError: "Failed to login",
    invalidCredentials: "Email or password is incorrect",
    emailNotConfirmed: "Email not confirmed. Please check your inbox",
    userExists: "User already exists. Please sign in",
    passwordLength: "Password must be at least 6 characters",
    required: "This field is required",
    signUpSuccess: "Account created successfully",
    loginToAccount: "Login to your account",
    createAccount: "Create an account",
    enterCredentials: "Enter your credentials to access your account",
    enterDetails: "Enter your details to create an account",
    noAccount: "Don't have an account? Please sign up first",
    hasAccount: "Already have an account? Please sign in",
    checking: "Checking...",
    processingSignUp: "Creating account...",
    processingSignIn: "Signing in..."
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
  },
  products: {
    productSettings: "Product Settings",
    manageProducts: "Manage products and inventory",
    products: "Products",
    productName: "Product Name",
    stock: "Stock",
    selectCategory: "Select Category",
    filterByCategory: "Filter by Category",
    allCategories: "All Categories",
    searchProducts: "Search products",
    category: "Category",
    fillAllFields: "Please fill all required fields",
    productAdded: "Product added successfully",
    errorAddingProduct: "Error adding product",
    productUpdated: "Product updated successfully",
    errorUpdatingProduct: "Error updating product",
    errorLoadingData: "Error loading data",
    categories: "Categories",
    categoriesDescription: "Manage product categories",
    categoryName: "Category Name",
    description: "Description",
    categoryAdded: "Category added successfully",
    errorAddingCategory: "Error adding category",
    categoryDeleted: "Category deleted successfully",
    errorDeletingCategory: "Error deleting category",
    thresholdsUpdated: "Thresholds updated successfully",
    errorUpdatingThresholds: "Error updating thresholds",
    thresholdsReset: "Thresholds reset successfully",
    errorResettingThresholds: "Error resetting thresholds",
    noCategory: "No Category",
    productThresholds: "Product Thresholds",
    productThresholdsDescription: "Set custom stock thresholds for specific products",
    low: "Low",
    critical: "Critical",
    resetToCategory: "Reset to category values"
  }
};
