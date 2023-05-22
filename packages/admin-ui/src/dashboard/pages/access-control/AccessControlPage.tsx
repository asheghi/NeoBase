import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useRoles } from "./useRoles";
import { NewRoleModal } from "./NewRoleModal";
import { useState } from "react";
import { IRole } from "./interfaces/IRole";
import { RoleItem } from "./RoleItem";

export const AccessControlPage = () => {
  const container = useRoles();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleShowCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  if(container.isLoading){
    return <Box height={'100%'} width={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <CircularProgress />
        <Typography>Loading</Typography>
    </Box>
  }

  return (
    <Box>
      <Box mb={4} />
      {container.roles.map((role: IRole) => (
        <RoleItem
          key={role.name}
          role={role}
          container={container}
        />
      ))}
      <Button onClick={handleShowCreateModal}>New Role</Button>
      <NewRoleModal
        show={showCreateModal}
        container={container}
        onClose={handleCloseCreateModal}
      />
    </Box>
  );
};