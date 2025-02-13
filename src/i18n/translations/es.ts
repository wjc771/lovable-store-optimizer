
export const spanishTranslations = {
  common: {
    dashboard: "Panel",
    upload: "Subir",
    settings: "Configuración",
    logout: "Salir",
    success: "Éxito",
    error: "Error",
    loading: "Cargando...",
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    add: "Agregar",
    confirm: "Confirmar",
    back: "Volver",
    business: "Negocios",
    chat: "Chat",
    reset: "Restaurar Valores"
  },
  dashboard: {
    totalSales: "Ventas Totales",
    products: "Productos",
    customers: "Clientes",
    smartActions: "Acciones Inteligentes",
    noActions: "No hay acciones para mostrar",
    caughtUp: "¡Todo al día! Te notificaremos cuando haya algo nuevo.",
    stores: {
      title: "Tus Tiendas",
      subtitle: "Gestiona los documentos y configuraciones de tu tienda",
      noStores: "No se encontraron tiendas. Crea tu primera tienda para comenzar."
    },
    upload: {
      title: "Subir Documentos",
      subtitle: "Sube y gestiona los documentos de tu tienda",
      chatTitle: "Chat con tus documentos"
    },
    permissions: {
      noAccess: "No tienes permiso para acceder a esta página. Esta página es accesible solo para gerentes."
    }
  },
  settings: {
    settings: "Configuración",
    general: "General",
    business: "Negocio",
    notifications: "Notificaciones",
    staff: "Personal & Permisos",
    integrations: "Integraciones",
    theme: "Tema",
    language: "Idioma",
    dark: "Oscuro",
    light: "Claro",
    system: "Sistema",
    businessName: "Nombre de la Empresa",
    enterBusinessName: "Ingrese el nombre de su empresa",
    timezone: "Zona Horaria",
    selectTimezone: "Seleccione la zona horaria",
    salesThreshold: "Umbral de Alerta de Ventas",
    inventoryAlert: "Nivel de Alerta de Stock Bajo",
    webhookUrls: "URLs de Webhook",
    manageStaff: "Gestionar Personal",
    positions: "Cargos",
    generalDescription: "Configure los ajustes básicos de la aplicación",
    businessDescription: "Gestione la configuración de su negocio",
    notificationsDescription: "Configure sus preferencias de notificación",
    staffDescription: "Gestione los miembros del personal y sus permisos",
    integrationsDescription: "Configure integraciones con servicios externos",
    emailNotifications: "Notificaciones por Email",
    pushNotifications: "Notificaiones Push",
    selectEmailFrequency: "Seleccione la frecuencia de emails",
    selectNotificationType: "Seleccione el tipo de notificación",
    instant: "Instantáneo",
    dailyDigest: "Resumen Diario",
    weeklySummary: "Resumen Semanal",
    allNotifications: "Todas las Notificaciones",
    importantOnly: "Solo Importantes",
    disabled: "Desactivado",
    webhookConfiguration: "Configuración de Webhook",
    uploadWebhookUrl: "URL del Webhook de Upload",
    chatWebhookUrl: "URL del Webhook de Chat",
    enterUploadWebhookUrl: "Ingrese la URL del webhook de upload",
    enterChatWebhookUrl: "Ingrese la URL del webhook de chat",

    // Nuevas traducciones para Smart Actions
    smartActions: "Acciones Inteligentes",
    revenueAlerts: "Alertas de Ingresos",
    revenueAlertsDescription: "Configure los límites para alertas de ingresos diarios",
    revenueThreshold: "Límite de Ingresos",
    revenueThresholdTooltip: "Valor mínimo de ingresos diarios esperados",
    percentageChange: "Variación Porcentual",
    percentageChangeTooltip: "Porcentaje de variación que activará una alerta",
    
    inventoryAlerts: "Alertas de Inventario",
    inventoryAlertsDescription: "Configure los niveles de alerta para artículos con bajo stock",
    lowThreshold: "Nivel Bajo",
    lowThresholdTooltip: "Cantidad que define un artículo con stock bajo",
    criticalThreshold: "Nivel Crítico",
    criticalThresholdTooltip: "Cantidad que define un artículo con stock crítico",
    
    paymentReminders: "Recordatorios de Pago",
    paymentRemindersDescription: "Configure los recordatorios para pagos pendientes",
    reminderDays: "Días para Recordatorio",
    reminderDaysTooltip: "Número de días después del cual se enviará un recordatorio",
    
    errorLoadingThresholds: "Error al cargar la configuración",
    errorSavingThresholds: "Error al guardar la configuración",
    thresholdsSaved: "Configuración guardada con éxito",

    reconciliation: {
      title: "Reconciliación",
      description: "Configurar ajustes y preferencias de reconciliación",
      threshold: "Umbral",
      thresholdDescription: "Establecer la diferencia porcentual que activa una alerta de reconciliación",
      autoResolve: "Resolución Automática",
      autoResolveDescription: "Resolver automáticamente discrepancias dentro del umbral",
      defaultResolution: "Resolución Predeterminada",
      selectResolution: "Seleccione el método de resolución",
      systemValue: "Usar Valor del Sistema",
      uploadedValue: "Usar Valor Cargado",
      manualReview: "Revisión Manual"
    }
  },
  upload: {
    title: "Subir Archivos",
    dragDrop: "Arrastra y suelta archivos aquí",
    browse: "Buscar archivos",
    uploading: "Subiendo...",
    success: "Archivo subido con éxito",
    error: "Error al subir archivo"
  },
  auth: {
    signIn: "Iniciar Sesión",
    signUp: "Registrarse",
    email: "Correo",
    password: "Contraseña",
    fullName: "Nombre Completo",
    loginSuccess: "Sesión iniciada con éxito",
    loginError: "Error al iniciar sesión",
    logoutSuccess: "Sesión cerrada con éxito",
    logoutError: "Error al cerrar sesión"
  },
  business: {
    title: "Control de Negocios",
    tabs: {
      salesInventory: "Ventas & Inventario",
      customersOrders: "Clientes & Pedidos",
      financial: "Financiero",
      team: "Equipo",
      reconciliation: "Reconciliación"
    },
    financial: {
      revenue: "Ingresos (7 días)",
      pendingPayments: "Pagos Pendientes",
      averageOrder: "Valor Promedio de Pedido",
      weeklyRevenue: "Ingresos Semanales"
    },
    sales: {
      totalSales: "Ventas Totales",
      lowStockItems: "Productos con Bajo Stock",
      alerts: "Alertas",
      salesTrend: "Tendencia de Ventas",
      lowStockAlerts: "Alertas de Bajo Stock",
      actionNeeded: "Acción Necesaria",
      allGood: "Todo Bien",
      itemsLeft: "restantes"
    },
    customers: {
      totalCustomers: "Total de Clientes",
      activeCustomers: "Clientes Activos",
      inactiveCustomers: "Clientes Inactivos",
      recentOrders: "Pedidos Recientes",
      customer: "Cliente",
      amount: "Monto",
      status: "Estado",
      date: "Fecha"
    },
    team: {
      totalStaff: "Total de Personal",
      activeTasks: "Tareas Activas",
      completedTasks: "Tarefas Completadas",
      staffOverview: "Resumen del Personal",
      recentTasks: "Tarefas Recientes",
      name: "Nombre",
      position: "Cargo",
      status: "Estado",
      task: "Tarea",
      assignedTo: "Asignado a",
      priority: "Prioridad"
    }
  },
  chat: {
    title: "Chat",
    description: "Chat con tus documentos y obtén respuestas instantáneas."
  }
};
