import React from "react";
import { useRules } from "./useRules";
import { useCollection } from "../Collections/useCollection";

export const RulesView = () => {
  const collection = useCollection();
  const rules = useRules(collection);

  return <div>Rules view,

    <br />
    <pre>{JSON.stringify(rules, null, 2)}</pre>
  </div>;
};
