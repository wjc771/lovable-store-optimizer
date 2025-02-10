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
            back: "Back"
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
            timezone: "Timezone",
            salesThreshold: "Sales Alert Threshold",
            inventoryAlert: "Low Stock Alert Level",
            webhookUrls: "Webhook URLs",
            manageStaff: "Manage Staff",
            positions: "Positions"
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
            back: "Voltar"
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
            timezone: "Fuso Horário",
            salesThreshold: "Limite de Alerta de Vendas",
            inventoryAlert: "Nível de Alerta de Estoque Baixo",
            webhookUrls: "URLs de Webhook",
            manageStaff: "Gerenciar Equipe",
            positions: "Cargos"
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
            back: "Volver"
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
            timezone: "Zona Horaria",
            salesThreshold: "Umbral de Alerta de Ventas",
            inventoryAlert: "Nivel de Alerta de Stock Bajo",
            webhookUrls: "URLs de Webhook",
            manageStaff: "Gestionar Personal",
            positions: "Cargos"
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
