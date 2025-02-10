
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, CheckCircle2, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

const TeamTab = () => {
  const { t } = useTranslation();

  const { data: staffOverview } = useQuery({
    queryKey: ['staff-overview'],
    queryFn: async () => {
      const { data: staff } = await supabase
        .from('staff')
        .select(`
          id,
          name,
          status,
          staff_positions (
            positions (
              name,
              is_managerial
            )
          )
        `);
      
      return staff || [];
    }
  });

  const { data: taskOverview } = useQuery({
    queryKey: ['task-overview'],
    queryFn: async () => {
      const { data: tasks } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          status,
          priority,
          staff (
            name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      return tasks || [];
    }
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('business.team.totalStaff')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffOverview?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('business.team.activeTasks')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {taskOverview?.filter(task => task.status === 'pending').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('business.team.completedTasks')}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {taskOverview?.filter(task => task.status === 'completed').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('business.team.staffOverview')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('business.team.name')}</TableHead>
                <TableHead>{t('business.team.position')}</TableHead>
                <TableHead>{t('business.team.status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffOverview?.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>{staff.name}</TableCell>
                  <TableCell>
                    {staff.staff_positions?.[0]?.positions?.name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {staff.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('business.team.recentTasks')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('business.team.task')}</TableHead>
                <TableHead>{t('business.team.assignedTo')}</TableHead>
                <TableHead>{t('business.team.priority')}</TableHead>
                <TableHead>{t('business.team.status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taskOverview?.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.staff?.name || 'Unassigned'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}