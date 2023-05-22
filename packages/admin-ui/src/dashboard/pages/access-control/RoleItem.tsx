import { Box, Button, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { IRoleItemProps } from "./interfaces/IRoleItemProps";
import { PermissionItem } from "./PermissionItem";
import IconAdd from '@mui/icons-material/Add'
import IconDelete from '@mui/icons-material/Delete';
import { IRole } from "./interfaces/IRole";
import { DeleteRoleModal } from "./DeleteRoleModal";


export function RoleItem(props: IRoleItemProps) {
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<IRole | undefined>(undefined);

  const handleDeleteRoleClick = () => {
    setDeleteTarget(props.role)
  };
  if (!props.role.permissions) {
    return null;
  }

  function handleNewPermission(): void {
    props.container.addPermission(props.role._id, {
      action: 'read', resource: "resource-" + Date.now()
    })
  }
  const handleModalClose = () => {
    setDeleteTarget(undefined);
  }


  const defaultPermissions = props.container.permissions;
  const extraPermissions = props.role.permissions.filter(a => {
    const isDefaultPermission = defaultPermissions.find(b => (a.action === b.action && a.resource === b.resource));
    return !isDefaultPermission
  });

  console.log('Permissions:',defaultPermissions);
  console.log('extra perm:', extraPermissions);
  
  
  const allPermissions = [...defaultPermissions, ...extraPermissions]
  console.log('all:',allPermissions);
  
  


  return (
    <Box mb={4}>
      <Box display="flex">
        <Typography variant="h6" ><Box display={'inline'} fontWeight={'bold'} color={'primary.main'}>{props.role.name}</Box> role</Typography>
        <Box ml="auto" />
        <IconButton sx={{
          '&:hover': {
            color: (theme) => theme.palette.error.main,
          },
        }} onClick={handleDeleteRoleClick}>
          <IconDelete />
        </IconButton>
      </Box>
      <Box>
        {allPermissions.map((permission) => (
          <PermissionItem
            key={JSON.stringify(permission)}
            permission={permission}
            parentRole={props.role}
            container={props.container} />
        ))}
        <Button onClick={handleNewPermission} variant="text" sx={{ color: 'text.primary', }}>
          <IconAdd sx={{ mr: 1 }} />
          Add More Permission
        </Button>
      </Box>
      {deleteTarget &&
        <DeleteRoleModal
          show={!!deleteTarget}
          role={deleteTarget}
          onClose={handleModalClose}
          container={props.container}
        />

      }
    </Box>
  );
}
