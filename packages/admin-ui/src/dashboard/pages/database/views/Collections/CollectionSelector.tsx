import React, { useEffect, useState } from "react";
import {
  Box,
  OutlinedInput,
  ListItemText,
  Link,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useApi } from "@neobase/client/react";

function DeleteCollectionModal(props: {
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  collection: string;
}) {
  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <DialogTitle>Delete Collection</DialogTitle>
      <DialogContent>
        Are you sure you want to delete <b>{props.collection}</b> collection?
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button color={"error"} onClick={props.onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function NewCollectionModal(props: {
  open: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
}) {
  const [name, setName] = useState<string>();
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>New Collection</DialogTitle>
      <DialogContent>
        <OutlinedInput
          placeholder="Name eg. Todos"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button color={"success"} onClick={() => props.onConfirm(name ?? "")}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export const CollectionSelector = () => {
  const [search, setSearch] = useState();
  const client = useApi();
  const [collections, setCollections] = useState<{ name: string }[]>([]);
  const [currentDeletingCollection, setCurrentDeletingCollection] = useState(
    ""
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  function fetchCollections() {
    client.Admin.Collection.getListOfCollections().then(({ data }) => {
      setCollections(data);
    });
  }

  useEffect(function () {
    fetchCollections();
    return () => {
      //
    };
  }, []);
  const handleSearchInput = (e: any) => {
    setSearch(e.target.value);
  };

  const handleDeleteClicked = (collection: string) => () => {
    setCurrentDeletingCollection(collection);
  };

  const handleDeleteCollection = async () => {
    setCurrentDeletingCollection("");
    await client.Admin.Collection.deleteCollection(currentDeletingCollection);
    fetchCollections();
  };

  const onClose = () => {
    setCurrentDeletingCollection("");
  };

  const handleNewCollectionClicked = () => {
    setShowCreateModal(true);
  };

  const handleNewCollectionCancelModal = () => {
    setShowCreateModal(false);
  };

  const createNewCollection = async (name: string) => {
    setShowCreateModal(false);
    await client.Admin.Collection.createCollection(name);
    fetchCollections();
  };

  return (
    <Box sx={{ pr: 2 }}>
      <Box display="flex" gap={2}>
        <OutlinedInput
          placeholder={"search"}
          size={"small"}
          value={search}
          onChange={handleSearchInput}
          sx={{
            width: "100%",
          }}
        />
        <Button
          onClick={handleNewCollectionClicked}
          variant="contained"
          size={"small"}
          sx={{ whiteSpace: "nowrap", px: 3 }}
        >
          New Collection
        </Button>
      </Box>
      <Box py={2}>
        {collections.map((it) => (
          <Box key={it.name} display="flex" mb={1}>
            <Button
              variant={"text"}
              sx={{ py: 1 }}
              href={`/dashboard/database/${it.name}/documents`}
            >
              <ListItemText sx={{ color: "primary.main" }}>
                {it.name}
              </ListItemText>
            </Button>
            <Box sx={{ ml: "auto" }} />
            <Button
              onClick={handleDeleteClicked(it.name)}
              variant={"outlined"}
              color={"warning"}
            >
              Delete
            </Button>
          </Box>
        ))}
      </Box>
      <DeleteCollectionModal
        onClose={onClose}
        onConfirm={handleDeleteCollection}
        open={!!currentDeletingCollection}
        collection={currentDeletingCollection}
      ></DeleteCollectionModal>
      <NewCollectionModal
        onClose={handleNewCollectionCancelModal}
        open={showCreateModal}
        onConfirm={createNewCollection}
      />
    </Box>
  );
};
