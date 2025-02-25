
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Shield, Crown, Trash, MoreVertical } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Position {
  id: string;
  name: string;
  is_managerial: boolean;
  permissions: {
    sales: boolean;
    inventory: boolean;
    financial: boolean;
    customers: boolean;
    staff: boolean;
    settings: boolean;
  };
}

interface PositionsTableProps {
  positions: Position[];
  onEdit: (position: Position) => void;
  onDelete: (id: string) => void;
  isMobile: boolean;
}

export const PositionsTable: React.FC<PositionsTableProps> = ({
  positions,
  onEdit,
  onDelete,
  isMobile,
}) => {
  const renderMobileCard = (position: Position) => (
    <Card key={position.id} className="mb-4">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {position.is_managerial ? (
              <Crown className="h-4 w-4 text-yellow-500" />
            ) : (
              <Shield className="h-4 w-4 text-gray-500" />
            )}
            <div>
              <h4 className="font-medium">{position.name}</h4>
              <p className="text-sm text-muted-foreground">
                {position.is_managerial ? "Managerial" : "Standard"}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(position)}>
                Edit
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-red-600">
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Position</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this position? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(position.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-4">
          <div className="flex gap-2 flex-wrap">
            {Object.entries(position.permissions).map(([key, value]) => (
              value && (
                <span key={key} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {key}
                </span>
              )
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isMobile) {
    return (
      <div className="space-y-4">
        {positions.map(renderMobileCard)}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.map((position) => (
            <TableRow key={position.id}>
              <TableCell className="flex items-center gap-2">
                {position.is_managerial ? (
                  <Crown className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Shield className="h-4 w-4 text-gray-500" />
                )}
                {position.name}
              </TableCell>
              <TableCell>
                {position.is_managerial ? "Managerial" : "Standard"}
              </TableCell>
              <TableCell>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(position.permissions).map(([key, value]) => (
                    value && (
                      <span key={key} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {key}
                      </span>
                    )
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(position)}
                  >
                    {position.is_managerial ? (
                      <Crown className="h-4 w-4" />
                    ) : (
                      <Shield className="h-4 w-4" />
                    )}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Position</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this position? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(position.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
