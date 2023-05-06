import React, { useState } from "react";
import { useRules } from "./useRules";
import { useCollection } from "../../useCollection";
import { Box, Button } from "@mui/material";
import useWatch from "../../../../../lib/useWatch";
import { RuleItem } from "./RuleItem";
import { Api } from "../../../../../lib/api";

export const RulesView = () => {
  const collection = useCollection();
  console.log('check: cols:', collection);

  const { rules, refetch: refetchRules } = useRules(collection);
  const [updatedRules, setUpdatedRules] = useState<any[] | undefined>(undefined);
  const changed = JSON.stringify(rules) !== JSON.stringify(updatedRules);

  // when api data comes
  useWatch(rules, () => {
    if (!updatedRules && rules && rules.length) {
      setUpdatedRules(rules);
    }
  })

  //end of hooks


  const handleResetChanges = () => {
    setUpdatedRules(rules);
  }

  const handleAddPolicy = () => {
    if (!updatedRules) return;
    setUpdatedRules([...updatedRules, {
      name: "New Policy",
      user: null,
      create: false,
      read: false,
      delete: false,
      update: false,
    }])
  }

  const handleRuleChange = (index: number) => (newItem: any) => {
    if (!updatedRules) return;
    const temp = [...updatedRules];
    temp.splice(index, 1, newItem)
    setUpdatedRules(temp);
  }

  const handleRuleDelete = (index: number) => () => {
    if (!updatedRules) return;
    const temp = [...updatedRules];
    temp.splice(index, 1);
    setUpdatedRules(temp);
  }

  const handleSave = async () => {
    await Api.Collection(collection!).AccessControl.updateConfig(updatedRules)
    setUpdatedRules(undefined);
    refetchRules();
  }

  console.log('check: updatedRules', updatedRules);


  const handleResetDefaultConfig = async () => {
    await Api.Collection(collection!).AccessControl.resetConfig();
    setUpdatedRules(undefined);
    refetchRules();
  }

  return <Box>
    <Box display={'flex'} gap={2} py={1}>
      <Button
        variant="text"
        color="secondary"
        disabled={!changed}
        onClick={handleResetChanges}
      >
        Reset Changes
      </Button>
      <Button
        variant="text"
        color="success"
        disabled={!changed}
        onClick={handleSave}
      >
        Save
      </Button>
      <Box ml="auto" />
      <Button
        onClick={handleResetDefaultConfig}
        variant="outlined"
        color="warning">Reset to Default Config</Button>
    </Box>

    <Box sx={{
      display: 'flex',
      gap: 4,
      overflow: 'auto',
      px: 2,
      py: 2,
      maxHeight: 'calc(100vh - 220px)',
      minHeight: 'calc(100vh - 220px)',
      scrollbarWidth: 'thin',
      background: '#17171710',
      '&::-webkit-scrollbar': {
        width: '0.4em',
      },
      '&::-webkit-scrollbar-track': {
        background: "#f1f1f1",
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#888',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: '#555'
      },
      boxShadow: '0px -2px 32px -5px rgba(0,0,0,0.57) inset',
    }}
      flexDirection={'column'}>
      {updatedRules && updatedRules.map((rule, index) => {
        return <RuleItem
          item={rule}
          onDelete={handleRuleDelete(index)}
          onUpdate={handleRuleChange(index)}
        />
      })}
      <Box display="flex" justifyContent="center">
        <Button size="large" variant="contained" color="primary" onClick={handleAddPolicy}>Add Policy</Button>
      </Box>
    </Box>
    <Box
      display='flex'
      gap={2}
      mt={4}
    >
      <Box ml={'auto'} />

    </Box>
  </Box>;
};

export default RulesView;