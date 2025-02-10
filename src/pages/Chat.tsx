
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ChatInterface from "@/components/chat/ChatInterface";
import { useTranslation } from "react-i18next";

const Chat = () => {
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <div className="flex-1 p-4 md:p-8 pt-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">{t('chat.title')}</h2>
          <p className="text-muted-foreground mt-2">
            {t('chat.description')}
          </p>
        </div>
        <ChatInterface />
      </div>
    </DashboardLayout>
  );
};

export default Chat;
