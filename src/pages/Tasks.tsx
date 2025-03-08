
import React, { useState } from 'react';
import { useAuth } from '../routes';
import { CheckCircle, Circle, Plus, Search, MoreVertical, Calendar, Tag } from 'lucide-react';
import { toast } from 'sonner';

const Tasks = () => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Revisar proposta do cliente', completed: false, priority: 'Alta', dueDate: '2023-12-10', category: 'Trabalho' },
    { id: 2, title: 'Atualizar documentação do sistema', completed: false, priority: 'Média', dueDate: '2023-12-15', category: 'Documentação' },
    { id: 3, title: 'Preparar apresentação da reunião', completed: true, priority: 'Alta', dueDate: '2023-12-05', category: 'Reunião' },
    { id: 4, title: 'Enviar relatório mensal', completed: false, priority: 'Baixa', dueDate: '2023-12-30', category: 'Administrativo' },
    { id: 5, title: 'Responder e-mails pendentes', completed: true, priority: 'Média', dueDate: '2023-12-08', category: 'Comunicação' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const toggleTaskComplete = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    
    const task = tasks.find(t => t.id === id);
    if (task) {
      toast.success(`Tarefa "${task.title}" ${!task.completed ? 'completada' : 'marcada como pendente'}`);
    }
  };
  
  const addNewTask = () => {
    toast.info("Funcionalidade para adicionar nova tarefa ainda não implementada");
  };
  
  const handleTaskAction = (id: number, action: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      toast.info(`Ação "${action}" para a tarefa "${task.title}" ainda não implementada`);
    }
  };
  
  const filteredTasks = searchTerm
    ? tasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.priority.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : tasks;
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Tarefas</h2>
        <p className="text-muted-foreground">
          Gerencie suas tarefas e acompanhe o progresso
        </p>
      </div>
      
      {/* Barra de ações */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Pesquisar tarefas..."
            className="pl-10 pr-4 py-2 w-full border rounded-md bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={addNewTask}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={16} />
          <span>Nova Tarefa</span>
        </button>
      </div>
      
      {/* Lista de tarefas */}
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h3 className="font-medium">Minhas Tarefas</h3>
        </div>
        
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>Nenhuma tarefa encontrada</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredTasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onToggleComplete={toggleTaskComplete}
                onAction={handleTaskAction}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Total de Tarefas</h4>
          <p className="text-2xl font-bold">{tasks.length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Completadas</h4>
          <p className="text-2xl font-bold">{tasks.filter(t => t.completed).length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Pendentes</h4>
          <p className="text-2xl font-bold">{tasks.filter(t => !t.completed).length}</p>
        </div>
      </div>
    </div>
  );
};

// Tipo para tarefa
type Task = {
  id: number;
  title: string;
  completed: boolean;
  priority: 'Alta' | 'Média' | 'Baixa';
  dueDate: string;
  category: string;
};

// Componente de item de tarefa
const TaskItem = ({ 
  task, 
  onToggleComplete,
  onAction
}: { 
  task: Task; 
  onToggleComplete: (id: number) => void;
  onAction: (id: number, action: string) => void;
}) => {
  return (
    <div className={`p-4 hover:bg-muted/50 transition-colors ${task.completed ? 'bg-muted/30' : ''}`}>
      <div className="flex items-start gap-3">
        <button 
          onClick={() => onToggleComplete(task.id)}
          className="mt-1 flex-shrink-0"
        >
          {task.completed ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
        
        <div className="flex-1">
          <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
            {task.title}
          </h4>
          
          <div className="flex flex-wrap gap-2 mt-2">
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full
              ${task.priority === 'Alta' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                task.priority === 'Média' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
              <Tag size={12} />
              {task.priority}
            </span>
            
            <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
              <Calendar size={12} />
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
            
            <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
              {task.category}
            </span>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <button 
            onClick={() => onAction(task.id, 'menu')}
            className="p-1 rounded-full hover:bg-accent"
          >
            <MoreVertical size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
