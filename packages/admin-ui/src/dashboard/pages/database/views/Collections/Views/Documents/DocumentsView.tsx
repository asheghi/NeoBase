import { Link, Box, Button, OutlinedInput, ButtonGroup, IconButton, List, ListItem } from "@mui/material";
import { Outlet, useParams } from "react-router-dom";
// todo fix this 
import { useClient } from "../../../../../../../lib/client";
import { useDocuments } from "./useDocuments";
import { useState } from "react";
import ListViewIcon from '@mui/icons-material/Menu';
import ObjectViewIcon from '@mui/icons-material/DataObject';
import TableViewIcon from '@mui/icons-material/GridView';
import RefreshIcon from '@mui/icons-material/Cached';
import NextPageIcon from '@mui/icons-material/ArrowForwardIos';
import PrevPageIcon from '@mui/icons-material/ArrowBackIos';
import { Loading } from "../../../../../../components/Loading";
import { useFirstRender } from "../../../../../../../lib/useFirstRender";

enum ViewMode {
  List,
  Object,
  Table
}
export const DocumentsView = () => {
  // hooks
  const params = useParams();
  const collection = params.collection;
  const { documents, isLoading, find, prevPage, nextPage, from,
    to, count, reset, isResetDisabled
  } = useDocuments(collection);
  const [showOptions, setShowOptions] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.List)
  const [queryInput, setQueryInput] = useState<string>("");

  useFirstRender(() => {
    find('{}');
  })


  if (!collection) return null;



  const handleFind = () => {
    find(queryInput);
  }

  return <Box sx={{
    height: 'calc(100vh - 260px)'
  }}>
    Documents view!
    <div className="topRow">
      <Box display={'flex'} gap={2} alignItems={'center'}>
        <Link href={'/docs'}>Filter</Link>
        <OutlinedInput
          value={queryInput}
          onChange={(e: any) => setQueryInput(e.target.value)}
          sx={{
            height: '2.5rem',
            width: '100%',
          }}
          placeholder="type a query : {field: 'value'}" />
        <Button disabled={isResetDisabled} onClick={reset}>Reset</Button>
        <Button variant="contained" onClick={handleFind}>Find</Button>
        <Button disabled variant="outlined">{"</>"}</Button>
        <Button sx={{ px: 3 }} onClick={() => setShowOptions(() => !showOptions)}>Options</Button>
      </Box>
    </div>
    <div className="options-rows">
      {/*  todo  */}
    </div>
    <Box sx={{ mb: 2 }} />
    <Box display={'flex'} alignItems={'center'} className="second-row" gap={2}>
      <Button variant="contained" size="small">Add Data</Button>
      <Button variant="outlined" size="small">Export Collection</Button>
      <Box sx={{ mr: 'auto' }} />
      <div>{from}-{to} of {count}</div>
      <IconButton size="small">
        <RefreshIcon />
      </IconButton>
      <ButtonGroup>
        <IconButton onClick={prevPage} size="small">
          <PrevPageIcon />
        </IconButton>
        <IconButton onClick={nextPage} size="small">
          <NextPageIcon />
        </IconButton>
      </ButtonGroup>
      <ButtonGroup>
        <IconButton>
          <ListViewIcon />
        </IconButton>
        <IconButton>
          <ObjectViewIcon />
        </IconButton>
        <IconButton>
          <TableViewIcon />
        </IconButton>
      </ButtonGroup>
    </Box>
    <Box sx={{ mt: 2 }} />
    <Box className="data-view" sx={{ height: '100%', }}>
      {isLoading && <Loading />}
      {viewMode === ViewMode.List &&
        <List sx={{ maxHeight: '100%', overflow: 'auto', height: '100%', px: 0 }}>
          {documents.map(it => (<ListItem key={it._id}>
            <pre>
              {JSON.stringify(it, null, 2)}
            </pre>
          </ListItem>
          ))}
        </List>
      }
    </Box>
  </Box>
};
