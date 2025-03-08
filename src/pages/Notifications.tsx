
import React, { useState } from 'react';
import { Bell, CheckCheck, Trash2, MessageSquare, UserPlus, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { 
      id: 1, 
      type: 'message', 
      title: 'Nova mensagem', 
      description: 'Maria Santos enviou uma mensagem para você.', 
      time: '5 min', 
      read: false, 
      icon: <MessageSquare className="text-blue-500" /> 
    },
    { 
      id: 2, 
      type: 'alert', 
      title: 'Lembrete de tarefa', 
      description: 'A tarefa "Preparar apresentação" vence hoje.', 
      time: '1 hora', 
      read: false, 
      icon: <AlertCircle className="text-red-500" /> 
    },
    { 
      id: 3, 
      type: 'user', 
      title: 'Novo usuário', 
      description: 'João Silva foi adicionado ao sistema.', 
      time: '3 horas', 
      read: true, 
      icon: <UserPlus className="text-green-500" /> 
    },
    { 
      id: 4, 
      type: 'document', 
      title: 'Documento atualizado', 
      description: 'O relatório mensal foi atualizado.', 
      time: '1 dia', 
      read: true, 
      icon: <FileText className="text-amber-500" /> 
    },
    { 
      id: 5, 
      type: 'message', 
      title: 'Nova mensagem', 
      description: 'Carlos Oliveira respondeu ao seu comentário.', 
      time: '2 dias', 
      read: true, 
      icon: <MessageSquare className="text-blue-500" /> 
    },
  ]);
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    toast.success('Todas as notificações marcadas como lidas');
  };
  
  const clearAll = () => {
    setNotifications([]);
    toast.success('Todas as notificações foram removidas');
  };
  
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };
  
  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
    toast.success('Notificação removida');
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Notificações</h2>
          <p className="text-muted-foreground">
            Gerencie todas as suas notificações
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{unreadCount} não lidas</span>
          <div className="h-6 w-[1px] bg-border"></div>
          <button 
            onClick={markAllAsRead}
            className="text-sm text-primary hover:underline flex items-center gap-1"
            disabled={unreadCount === 0}
          >
            <CheckCheck size={14} />
            <span>Marcar todas como lidas</span>
          </button>
          <button 
            onClick={clearAll}
            className="text-sm text-primary hover:underline flex items-center gap-1"
            disabled={notifications.length === 0}
          >
            <Trash2 size={14} />
            <span>Limpar tudo</span>
          </button>
        </div>
      </div>
      
      {/* Lista de notificações */}
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-4 border-b flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium">Centro de Notificações</h3>
        </div>
        
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="font-medium mb-1">Nenhuma notificação</p>
            <p className="text-sm">Você não tem notificações no momento</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onMarkAsRead={markAsRead}
                onRemove={removeNotification}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Preferências de notificação */}
      <div className="bg-card rounded-lg border shadow-sm p-4">
        <h3 className="font-medium mb-4">Preferências de Notificação</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificações por Email</p>
              <p className="text-sm text-muted-foreground">Receba notificações por email</p>
            </div>
            <button 
              className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 rounded-md text-sm"
              onClick={() => toast.info("Configuração de notificações por email ainda não implementada")}
            >
              Configurar
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificações no Navegador</p>
              <p className="text-sm text-muted-foreground">Ative notificações no navegador</p>
            </div>
            <button 
              className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 rounded-md text-sm"
              onClick={() => toast.info("Configuração de notificações no navegador ainda não implementada")}
            >
              Ativar
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Resumo Semanal</p>
              <p className="text-sm text-muted-foreground">Receba um resumo semanal por email</p>
            </div>
            <button 
              className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 rounded-md text-sm"
              onClick={() => toast.info("Configuração de resumo semanal ainda não implementada")}
            >
              Inscrever
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tipo para notificação
type Notification = {
  id: number;
  type: 'message' | 'alert' | 'user' | 'document';
  title: string;
  description: string;
  time: string;
  read: boolean;
  icon: React.ReactNode;
};

// Componente de item de notificação
const NotificationItem = ({ 
  notification, 
  onMarkAsRead,
  onRemove
}: { 
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onRemove: (id: number) => void;
}) => {
  return (
    <div 
      className={`p-4 hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}
      onClick={() => !notification.read && onMarkAsRead(notification.id)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 p-2 bg-background rounded-full border">
          {notification.icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-medium">{notification.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
            </div>
            
            <div className="flex-shrink-0 flex flex-col items-end gap-2">
              <span className="text-xs text-muted-foreground">{notification.time}</span>
              {!notification.read && (
                <span className="h-2 w-2 rounded-full bg-primary"></span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-3">
            <button 
              className="text-xs text-primary hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                toast.info("Ação ainda não implementada");
              }}
            >
              Ver detalhes
            </button>
            <span className="text-xs text-muted-foreground">•</span>
            <button 
              className="text-xs text-destructive hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(notification.id);
              }}
            >
              Remover
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
