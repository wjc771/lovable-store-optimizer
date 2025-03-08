
import React from 'react';
import { useAuth } from '../routes';
import { BarChart, LineChart, CheckCircle, ListTodo, TrendingUp, Users } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  
  const simulateAction = (actionName: string) => {
    toast.success(`Ação "${actionName}" executada com sucesso!`);
  };
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visualize os principais indicadores do seu sistema
        </p>
      </div>
      
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Usuários" 
          value="24" 
          trend="+12%" 
          trendUp={true}
          icon={<Users className="text-blue-500" />} 
        />
        <StatCard 
          title="Tarefas" 
          value="47" 
          trend="+8%" 
          trendUp={true}
          icon={<ListTodo className="text-amber-500" />} 
        />
        <StatCard 
          title="Completos" 
          value="18" 
          trend="+32%" 
          trendUp={true}
          icon={<CheckCircle className="text-green-500" />} 
        />
        <StatCard 
          title="Pendentes" 
          value="29" 
          trend="-5%" 
          trendUp={false}
          icon={<TrendingUp className="text-red-500" />} 
        />
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard 
          title="Atividades por Mês" 
          type="bar"
          onClick={() => simulateAction("Visualizar detalhes de atividades")}
        />
        <ChartCard 
          title="Desempenho da Equipe" 
          type="line"
          onClick={() => simulateAction("Visualizar detalhes de desempenho")}
        />
      </div>
      
      {/* Lista de atividades recentes */}
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h3 className="font-medium">Atividades Recentes</h3>
        </div>
        <div className="divide-y">
          {[
            { user: "Carlos Silva", action: "atualizou o perfil", time: "há 5 minutos" },
            { user: "Maria Santos", action: "completou 3 tarefas", time: "há 2 horas" },
            { user: "João Oliveira", action: "adicionou nova tarefa", time: "há 4 horas" },
            { user: "Ana Souza", action: "fez login no sistema", time: "há 1 dia" }
          ].map((activity, index) => (
            <div key={index} className="p-4 hover:bg-muted/50">
              <div className="flex justify-between">
                <span className="font-medium">{activity.user}</span>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
              <p className="text-sm text-muted-foreground">{activity.action}</p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <button 
            onClick={() => simulateAction("Ver todas as atividades")}
            className="w-full text-center text-sm text-primary hover:underline"
          >
            Ver todas as atividades
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente para card de estatística
const StatCard = ({ 
  title, 
  value, 
  trend, 
  trendUp,
  icon 
}: { 
  title: string; 
  value: string; 
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
}) => {
  return (
    <div className="bg-card hover:bg-card/80 border rounded-lg p-5 transition hover-scale">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <p className={`text-xs mt-1 ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
            {trend}
          </p>
        </div>
        <div className="bg-background rounded-full p-2 border">{icon}</div>
      </div>
    </div>
  );
};

// Componente para card de gráfico
const ChartCard = ({ 
  title, 
  type,
  onClick
}: { 
  title: string; 
  type: 'bar' | 'line';
  onClick: () => void;
}) => {
  return (
    <div className="bg-card border rounded-lg shadow-sm">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium">{title}</h3>
        <button 
          onClick={onClick}
          className="text-sm text-primary hover:underline"
        >
          Ver detalhes
        </button>
      </div>
      <div className="p-4 h-64 flex items-center justify-center">
        <div className="text-5xl text-muted-foreground/30">
          {type === 'bar' 
            ? <BarChart strokeWidth={1.5} /> 
            : <LineChart strokeWidth={1.5} />
          }
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
