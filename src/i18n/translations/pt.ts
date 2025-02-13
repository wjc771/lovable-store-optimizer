export const portugueseTranslations = {
  common: {
    dashboard: "Painel",
    upload: "Upload",
    settings: "Configurações",
    logout: "Sair",
    success: "Sucesso",
    error: "Erro",
    loading: "Carregando...",
    save: "Salvar",
    cancel: "Cancelar",
    delete: "Excluir",
    edit: "Editar",
    add: "Adicionar",
    confirm: "Confirmar",
    back: "Voltar",
    business: "Negócios",
    chat: "Chat",
    reset: "Restaurar Padrões",
    actions: "Ações"
  },
  dashboard: {
    totalSales: "Vendas Totais",
    products: "Produtos",
    customers: "Clientes",
    smartActions: "Ações Inteligentes",
    noActions: "Nenhuma ação para exibir",
    caughtUp: "Tudo em dia! Notificaremos você quando houver algo novo.",
    stores: {
      title: "Suas Lojas",
      subtitle: "Gerencie os documentos e configurações da sua loja",
      noStores: "Nenhuma loja encontrada. Crie sua primeira loja para começar."
    },
    upload: {
      title: "Upload de Documentos",
      subtitle: "Faça upload e gerencie os documentos da sua loja",
      chatTitle: "Chat com seus documentos"
    },
    permissions: {
      noAccess: "Você não tem permissão para acessar esta página. Esta página é acessível apenas para gerentes."
    }
  },
  settings: {
    settings: "Configurações",
    general: "Geral",
    business: "Negócio",
    notifications: "Notificações",
    staff: "Equipe & Permissões",
    integrations: "Integrações",
    theme: "Tema",
    language: "Idioma",
    dark: "Escuro",
    light: "Claro",
    system: "Sistema",
    businessName: "Nome da Empresa",
    enterBusinessName: "Digite o nome da sua empresa",
    timezone: "Fuso Horário",
    selectTimezone: "Selecione o fuso horário",
    salesThreshold: "Limite de Alerta de Vendas",
    inventoryAlert: "Nível de Alerta de Estoque Baixo",
    webhookUrls: "URLs de Webhook",
    manageStaff: "Gerenciar Equipe",
    positions: "Cargos",
    generalDescription: "Configure as configurações básicas do aplicativo",
    businessDescription: "Gerencie as configurações do seu negócio",
    notificationsDescription: "Configure suas preferências de notificação",
    staffDescription: "Gerencie membros da equipe e suas permissões",
    integrationsDescription: "Configure integrações com serviços externos",
    emailNotifications: "Notificações por Email",
    pushNotifications: "Notificações Push",
    selectEmailFrequency: "Selecione a frequência de emails",
    selectNotificationType: "Selecione o tipo de notificação",
    instant: "Instantâneo",
    dailyDigest: "Resumo Diário",
    weeklySummary: "Resumo Semanal",
    allNotifications: "Todas as Notificações",
    importantOnly: "Apenas Importantes",
    disabled: "Desativado",
    webhookConfiguration: "Configuração de Webhook",
    uploadWebhookUrl: "URL do Webhook de Upload",
    chatWebhookUrl: "URL do Webhook de Chat",
    enterUploadWebhookUrl: "Digite a URL do webhook de upload",
    enterChatWebhookUrl: "Digite a URL do webhook de chat",

    // Novas traduções para Smart Actions
    smartActions: "Ações Inteligentes",
    revenueAlerts: "Alertas de Receita",
    revenueAlertsDescription: "Configure os limites para alertas de receita diária",
    revenueThreshold: "Limite de Receita",
    revenueThresholdTooltip: "Valor mínimo de receita diária esperada",
    percentageChange: "Variação Percentual",
    percentageChangeTooltip: "Porcentagem de variação que acionará um alerta",
    
    inventoryAlerts: "Alertas de Estoque",
    inventoryAlertsDescription: "Configure os níveis de alerta para itens com baixo estoque",
    lowThreshold: "Nível Baixo",
    lowThresholdTooltip: "Quantidade que define um item com estoque baixo",
    criticalThreshold: "Nível Crítico",
    criticalThresholdTooltip: "Quantidade que define um item com estoque crítico",
    
    paymentReminders: "Lembretes de Pagamento",
    paymentRemindersDescription: "Configure os lembretes para pagamentos pendentes",
    reminderDays: "Dias para Lembrete",
    reminderDaysTooltip: "Número de dias após o qual um lembrete será enviado",
    
    errorLoadingThresholds: "Erro ao carregar as configurações",
    errorSavingThresholds: "Erro ao salvar as configurações",
    thresholdsSaved: "Configurações salvas com sucesso",
    
    reconciliation: {
      title: "Reconciliação",
      description: "Configure as configurações e preferências de reconciliação",
      threshold: "Limiar",
      thresholdDescription: "Defina a diferença percentual que aciona um alerta de reconciliação",
      autoResolve: "Resolução Automática",
      autoResolveDescription: "Resolver automaticamente discrepâncias dentro do limiar",
      defaultResolution: "Resolução Padrão",
      selectResolution: "Selecione o método de resolução",
      systemValue: "Usar Valor do Sistema",
      uploadedValue: "Usar Valor Carregado",
      manualReview: "Revisão Manual"
    }
  },
  upload: {
    title: "Upload de Arquivos",
    dragDrop: "Arraste e solte arquivos aqui",
    browse: "Procurar arquivos",
    uploading: "Enviando...",
    success: "Arquivo enviado com sucesso",
    error: "Erro ao enviar arquivo"
  },
  auth: {
    signIn: "Entrar",
    signUp: "Cadastrar",
    email: "Email",
    password: "Senha",
    fullName: "Nome Completo",
    loginSuccess: "Login realizado com sucesso",
    loginError: "Falha ao fazer login",
    logoutSuccess: "Logout realizado com sucesso",
    logoutError: "Falha ao fazer logout"
  },
  business: {
    title: "Controle de Negócios",
    tabs: {
      salesInventory: "Vendas & Estoque",
      customersOrders: "Clientes & Pedidos",
      financial: "Financeiro",
      team: "Equipe",
      reconciliation: "Reconciliação"
    },
    financial: {
      revenue: "Receita (7 dias)",
      pendingPayments: "Pagamentos Pendentes",
      averageOrder: "Valor Médio do Pedido",
      weeklyRevenue: "Receita Semanal"
    },
    sales: {
      totalSales: "Vendas Totais",
      lowStockItems: "Itens com Baixo Estoque",
      alerts: "Alertas",
      salesTrend: "Tendência de Vendas",
      lowStockAlerts: "Alertas de Baixo Estoque",
      actionNeeded: "Ação Necessária",
      allGood: "Tudo Bem",
      itemsLeft: "restantes"
    },
    customers: {
      totalCustomers: "Total de Clientes",
      activeCustomers: "Clientes Ativos",
      inactiveCustomers: "Clientes Inativos",
      recentOrders: "Pedidos Recentes",
      customer: "Cliente",
      amount: "Valor",
      status: "Status",
      date: "Data"
    },
    team: {
      totalStaff: "Total de Funcionários",
      activeTasks: "Tarefas Ativas",
      completedTasks: "Tarefas Concluídas",
      staffOverview: "Visão Geral da Equipe",
      recentTasks: "Tarefas Recentes",
      name: "Nome",
      position: "Cargo",
      status: "Status",
      task: "Tarefa",
      assignedTo: "Atribuído a",
      priority: "Prioridade"
    }
  },
  chat: {
    title: "Chat",
    description: "Chat com seus documentos e obtenha respostas instantâneas."
  },
  reconciliation: {
    tabs: {
      overview: "Visão Geral",
      upload: "Upload"
    },
    dashboard: {
      title: "Painel de Reconciliação",
      filter: "Filtrar",
      filterByStatus: "Filtrar por Status",
      noJobs: "Nenhum trabalho de reconciliação encontrado"
    },
    status: {
      all: "Todos",
      pending: "Pendente",
      inProgress: "Em Andamento",
      completed: "Concluído",
      failed: "Falhou"
    },
    fields: {
      type: "Tipo",
      createdAt: "Criado em",
      status: "Status",
      actions: "Ações"
    },
    errors: {
      loadFailed: "Falha ao carregar trabalhos de reconciliação"
    }
  },
  products: {
    productThresholds: "Limites de Produtos",
    productThresholdsDescription: "Defina limites de estoque personalizados para produtos específicos",
    products: "Produtos",
    manageProducts: "Gerenciar produtos e estoque",
    productName: "Nome do produto",
    stock: "Estoque",
    selectCategory: "Selecionar categoria",
    filterByCategory: "Filtrar por categoria",
    allCategories: "Todas as categorias",
    searchProducts: "Buscar produtos",
    category: "Categoria",
    fillAllFields: "Preencha todos os campos obrigatórios",
    productAdded: "Produto adicionado com sucesso",
    errorAddingProduct: "Erro ao adicionar produto",
    productUpdated: "Produto atualizado com sucesso",
    errorUpdatingProduct: "Erro ao atualizar produto",
    errorLoadingData: "Erro ao carregar dados",
    categories: "Categorias",
    categoriesDescription: "Gerenciar categorias de produtos",
    categoryName: "Nome da categoria",
    description: "Descrição",
    categoryAdded: "Categoria adicionada com sucesso",
    errorAddingCategory: "Erro ao adicionar categoria",
    categoryDeleted: "Categoria removida com sucesso",
    errorDeletingCategory: "Erro ao remover categoria",
    thresholdsUpdated: "Limites atualizados com sucesso",
    errorUpdatingThresholds: "Erro ao atualizar limites",
    thresholdsReset: "Limites resetados com sucesso",
    errorResettingThresholds: "Erro ao resetar limites",
    noCategory: "Sem categoria",
    productSettings: "Configurações de Produtos"
  }
};
