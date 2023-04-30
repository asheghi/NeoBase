import { useEffect, useState } from "react";
import { ApiType } from "../../api";

export const useOAuthProviders = (api: ApiType) => {
  const [oAuthProviders, setOAuthProviders] = useState<string[]>([]);

  useEffect(() => {
    api.Auth.oAuthProviders()
      .then(({ data }) => {
        setOAuthProviders(data);
      })
      .catch(e => {
        console.error('failed to fetch oauth providers!');
        console.error(e);
      })
  }, []);


  return oAuthProviders;
}