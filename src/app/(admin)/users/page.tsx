"use client";
import { useFetch } from "@/hooks/useApi";
import { UserListResponse } from "@/types/User";
import UserTable from "./components/UserTable";
import { TableSkeleton } from "@/components/tabel-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Customers = () => {
  const {
    data: usersData,
    error: userError,
    isLoading: isLoadingUsers,
    mutate,
  } = useFetch<UserListResponse>("/api/v1/users");

  if (isLoadingUsers)
    return (
      <TableSkeleton
        columns={6}
        rows={5}
        showActions={true}
        showFilter={true}
        showPagination={true}
      />
    );
  if (userError) return <div>Error loading data</div>;
  return (
    <>
      {/* <Tabs defaultValue="customers">
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="mechanics">Mechanics</TabsTrigger>
          <TabsTrigger value="admins">Adminstrations</TabsTrigger>
        </TabsList>
        <TabsContent value="customers">
          <UserTable
            data={customerData?.users || []}
            mutate={mutateCustomers}
          />
          ;
        </TabsContent>
        <TabsContent value="mechanics">
          <UserTable
            data={mechanicsData?.users || []}
            mutate={mutateMechanics}
          />
          ;
        </TabsContent>
        <TabsContent value="admins">
          <UserTable data={adminData?.users || []} mutate={mutateAdmins} />;
        </TabsContent>
      </Tabs> */}
      <UserTable data={usersData?.users || []} mutate={mutate} />
    </>
  );
};

export default Customers;
