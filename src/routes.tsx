
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { HomeIcon, LogIn, Settings, User, Menu, X, ChevronRight, ArrowRightCircle, ChevronLeft } from "lucide-react";
import { createContext, useContext } from "react";

// Contexto de autenticação simples
const AuthContext = createContext<{
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
  user: { username: string } | null;
}>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  user: null
});

// Provider de autenticação
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);

  // Verificar se já existe um usuário salvo
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string) => {
    // Simulação de login - Em produção, use autenticação real
    if (username && password.length >= 4) {
      const userData = { username };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      toast.success(`Bem-vindo, ${username}!`);
      return true;
    } else {
      toast.error("Credenciais inválidas");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.info("Você saiu do sistema");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Layout principal com barra lateral
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-full hover:bg-accent"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-xl font-semibold">Sistema App</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm hidden md:inline-block">Olá, {user?.username}</span>
                <button 
                  onClick={logout}
                  className="bg-secondary text-secondary-foreground p-2 rounded-full hover:bg-secondary/80"
                >
                  <LogIn size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>
      
      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={`bg-card border-r fixed md:sticky top-[57px] h-[calc(100vh-57px)] transition-all duration-300 z-20 ${
            sidebarOpen ? "w-64 left-0" : "w-64 -left-64 md:left-0"
          }`}
        >
          <nav className="p-4 space-y-2">
            <NavLink to="/" icon={<HomeIcon size={18} />} label="Início" onClick={() => setSidebarOpen(false)} />
            <NavLink to="/perfil" icon={<User size={18} />} label="Perfil" onClick={() => setSidebarOpen(false)} />
            <NavLink to="/configuracoes" icon={<Settings size={18} />} label="Configurações" onClick={() => setSidebarOpen(false)} />
          </nav>
        </aside>
        
        {/* Overlay para fechar o sidebar em dispositivos móveis */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        
        {/* Conteúdo principal */}
        <main className={`flex-1 p-4 transition-all duration-300 ${sidebarOpen ? "md:ml-0" : "md:ml-0"}`}>
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Componente de link de navegação
const NavLink = ({ to, icon, label, onClick }: { 
  to: string; 
  icon: React.ReactNode; 
  label: string;
  onClick?: () => void;
}) => {
  const navigate = useNavigate();
  
  return (
    <button 
      className="w-full flex items-center space-x-2 px-3 py-2 rounded hover:bg-accent text-left"
      onClick={() => {
        navigate(to);
        if (onClick) onClick();
      }}
    >
      <span className="text-muted-foreground">{icon}</span>
      <span>{label}</span>
      <ChevronRight size={16} className="ml-auto text-muted-foreground" />
    </button>
  );
};

// Componente simples de página inicial para começar
const HomePage = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Bem-vindo ao Sistema</h2>
        <p className="text-muted-foreground">
          Aplicação simplificada com navegação e recursos básicos
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card 
          title="Navegação" 
          description="Sistema de navegação com rotas e sidebar"
          icon={<ArrowRightCircle className="text-blue-500" />} 
        />
        <Card 
          title="Autenticação" 
          description="Sistema simples de login e gerenciamento de usuário"
          icon={<User className="text-green-500" />} 
        />
        <Card 
          title="Gerenciamento de Estado" 
          description="Contexto para compartilhar dados entre componentes"
          icon={<Settings className="text-purple-500" />} 
        />
      </div>
      
      <div className="p-4 bg-card rounded-lg border shadow-sm">
        <h3 className="font-medium mb-2">Estado atual:</h3>
        <p className="text-sm text-muted-foreground">
          {isAuthenticated 
            ? "Você está autenticado. Experimente as diferentes páginas." 
            : "Você não está autenticado. Faça login para testar mais recursos."}
        </p>
        
        {!isAuthenticated && (
          <button 
            onClick={() => toast.info("Use o botão de login no topo para acessar o sistema")}
            className="mt-2 bg-secondary/80 text-secondary-foreground hover:bg-secondary py-1.5 px-3 text-sm rounded"
          >
            Mostrar dica
          </button>
        )}
      </div>
    </div>
  );
};

// Componente de card para a página inicial
const Card = ({ 
  title, 
  description, 
  icon 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
}) => {
  return (
    <div className="bg-card hover:bg-card/80 border rounded-lg p-5 transition hover-scale">
      <div className="flex items-start space-x-4">
        <div className="bg-background rounded-full p-2 border">{icon}</div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

// Componente para página de perfil
const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para acessar esta página");
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) return null;
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Perfil do Usuário</h2>
        <p className="text-muted-foreground">
          Gerenciamento das suas informações pessoais
        </p>
      </div>
      
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center">
              <User size={40} className="text-accent-foreground/70" />
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-lg font-medium">{user?.username}</h3>
              <p className="text-sm text-muted-foreground">Usuário do sistema</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Nome de usuário</label>
                <input 
                  type="text" 
                  value={user?.username} 
                  readOnly
                  className="w-full border bg-background rounded-md px-3 py-1.5 text-sm"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">E-mail</label>
                <input 
                  type="email" 
                  value="usuario@exemplo.com" 
                  readOnly
                  className="w-full border bg-background rounded-md px-3 py-1.5 text-sm"
                />
              </div>
            </div>
            
            <div className="pt-2">
              <button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 py-1.5 px-4 rounded-md text-sm"
                onClick={() => toast.info("Funcionalidade de atualização ainda não implementada")}
              >
                Atualizar Perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para página de configurações
const SettingsPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para acessar esta página");
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) return null;
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie as configurações do seu sistema
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Preferências de Interface</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Tema Escuro</label>
              <button 
                className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 rounded-md text-sm"
                onClick={() => toast.info("Funcionalidade de tema ainda não implementada")}
              >
                Ativar
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Notificações</label>
              <button 
                className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 rounded-md text-sm"
                onClick={() => toast.info("Funcionalidade de notificações ainda não implementada")}
              >
                Gerenciar
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Conta</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Alterar Senha</label>
              <button 
                className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 rounded-md text-sm"
                onClick={() => toast.info("Funcionalidade de alteração de senha ainda não implementada")}
              >
                Alterar
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Privacidade</label>
              <button 
                className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 rounded-md text-sm"
                onClick={() => toast.info("Funcionalidade de privacidade ainda não implementada")}
              >
                Configurar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Página de login
const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      navigate('/');
    }
  };
  
  if (isAuthenticated) return null;
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fadeIn">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Acesso ao Sistema</h1>
          <p className="text-sm text-muted-foreground">
            Entre com suas credenciais para acessar
          </p>
        </div>
        
        <div className="space-y-4 bg-card rounded-lg border p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Nome de Usuário
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border rounded-md px-3 py-2 bg-background"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-md px-3 py-2 bg-background"
                required
              />
              <p className="text-xs text-muted-foreground">
                Use qualquer senha com pelo menos 4 caracteres
              </p>
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded"
            >
              Entrar
            </button>
          </form>
          
          <div className="text-center pt-2">
            <button 
              className="text-sm text-primary hover:underline"
              onClick={() => toast.info("Funcionalidade de recuperação de senha ainda não implementada")}
            >
              Esqueceu sua senha?
            </button>
          </div>
        </div>
        
        <div className="text-center">
          <a 
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
          >
            <ChevronLeft size={16} />
            <span>Voltar para a página inicial</span>
          </a>
        </div>
      </div>
    </div>
  );
};

// Componente de página não encontrada
const NotFound = () => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-fadeIn">
    <h1 className="text-5xl font-bold mb-4">404</h1>
    <h2 className="text-2xl font-semibold mb-2">Página não encontrada</h2>
    <p className="text-muted-foreground mb-6">
      A página que você está procurando não existe ou foi movida
    </p>
    <a 
      href="/" 
      className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
    >
      Voltar para a página inicial
    </a>
  </div>
);

// Componente para rota protegida
const PrivateRoute = ({ 
  element 
}: { 
  element: React.ReactNode 
}) => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? (
    <MainLayout>{element}</MainLayout>
  ) : (
    <Navigate to="/login" replace />
  );
};

// Componente principal de rotas
const AppRoutes = () => {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Simular um tempo de inicialização para verificar o loading
    const timer = setTimeout(() => {
      console.log("AppRoutes: Aplicação está pronta");
      setIsReady(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Exibir um indicador de carregamento simples
  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <AuthProvider>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rotas protegidas */}
        <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
        <Route path="/perfil" element={<PrivateRoute element={<ProfilePage />} />} />
        <Route path="/configuracoes" element={<PrivateRoute element={<SettingsPage />} />} />
        
        {/* Rota 404 */}
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;
