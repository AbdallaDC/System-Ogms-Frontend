"use client";
import { useFetch } from "@/hooks/useApi";
import { UserListResponse } from "@/types/User";
import UserTable from "./components/UserTable";
import { TableSkeleton } from "@/components/tabel-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Customers = () => {
  const {
    data: mechanicsData,
    error: mechanicsError,
    isLoading: isLoadingMechanics,
    mutate: mutateMechanics,
  } = useFetch<UserListResponse>("/api/v1/users/role/mechanic");
  console.log("mechanicsData", mechanicsData?.users);

  const {
    data: adminData,
    error: adminError,
    isLoading: isLoadingAdmins,
    mutate: mutateAdmins,
  } = useFetch<UserListResponse>("/api/v1/users/role/admin");
  const {
    data: customerData,
    error: customerError,
    isLoading: isLoadingCustomers,
    mutate: mutateCustomers,
  } = useFetch<UserListResponse>("/api/v1/users/role/customer");

  if (isLoadingMechanics || isLoadingAdmins || isLoadingCustomers)
    return (
      <TableSkeleton
        columns={6}
        rows={5}
        showActions={true}
        showFilter={true}
        showPagination={true}
      />
    );
  if (mechanicsError || adminError || customerError)
    return <div>Error loading data</div>;
  return (
    <>
      <Tabs defaultValue="customers">
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
      </Tabs>
    </>
  );
};

export default Customers;
