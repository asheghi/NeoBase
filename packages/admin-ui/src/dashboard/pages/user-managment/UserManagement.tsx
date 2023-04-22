import React from "react";
import { Box, Button, Modal, OutlinedInput, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useUsers } from "./useUsers";
import { UserRowItem } from "./UserRowItem";
import { useClient } from "../../../lib/client";
import { NewUserModal } from "./NewUserModal";

export const AuthenticationPage = () => {
  const { users, deleteUser, createUser, updateUser } = useUsers();
  const client = useClient();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  const handleUpdateUser = async (uid: string, payload: any) => {
    updateUser(uid, payload);
  }

  return (
    <Box>

      <Box height="2rem" display="flex">
        <OutlinedInput placeholder="search" />
        <Box mr='auto' />
        <Button
          variant="contained"
          color="primary"
          onClick={handleModalOpen}>
          Create User
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Username
              </TableCell>
              <TableCell>
                Role
              </TableCell>
              <TableCell>
                Created At
              </TableCell>
              <TableCell>
                ID
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users && users.map((user: any, index: number) => {
              const handleUserDelete = async () => {
                await client.Admin.Users.deleteUser(user._id);
                deleteUser(index);
              }

              const handleRoleUpdate = (newRole: string) => {
                client.Admin.Users.updateUser(user.id, { role: newRole });
              }

              return (
                <UserRowItem
                  onUpdate={handleUpdateUser}
                  key={user._id}
                  item={user}
                  onRoleUpdate={handleRoleUpdate}
                  onDelete={handleUserDelete} />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <NewUserModal
        onClose={handleModalClose}
        createUser={createUser}
        isModalOpen={isModalOpen}
        key={users?.length}
      />

    </Box>
  );
};
