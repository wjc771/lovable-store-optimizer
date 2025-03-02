
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Store, RefreshCw } from "lucide-react";

interface StoreData {
  id: string;
  business_name: string;
  status: string;
  created_at: string;
  owner_id: string | null;
}

interface StoreTableProps {
  stores: StoreData[];
  onRefresh: () => void;
}

const StoreTable = ({ stores, onRefresh }: StoreTableProps) => {
  const navigate = useNavigate();

  if (!stores || stores.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No stores found</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Create your first store to get started
        </p>
        <Button onClick={onRefresh} variant="outline" size="sm" className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh List
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Store Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.map((store) => (
            <TableRow key={store.id}>
              <TableCell className="font-medium">{store.business_name}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    store.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}
                >
                  {store.status}
                </span>
              </TableCell>
              <TableCell>
                {new Date(store.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/stores/${store.id}`)}
                >
                  <Store className="mr-2 h-4 w-4" />
                  Manage
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StoreTable;
