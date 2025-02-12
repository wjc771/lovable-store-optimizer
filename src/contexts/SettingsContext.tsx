import React, { createContext, useContext, useEffect, useState } from 'react';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
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
          }
        }
      },
      pt: {
        translation: {
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
            chat: "Chat"
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
          }
        }
      },
      es: {
        translation: {
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
            chat: "Chat"
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
        }
      }
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
    }
  });

type Language = 'en' | 'pt' | 'es';
type Theme = 'light' | 'dark' | 'system';

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => 
    (localStorage.getItem('theme') as Theme) || 'system'
  );
  const [language, setLanguage] = useState<Language>(() => 
    (localStorage.getItem('language') as Language) || 'en'
  );

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
    i18next.changeLanguage(language);
  }, [language]);

  return (
    <SettingsContext.Provider value={{ theme, setTheme, language, setLanguage }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
