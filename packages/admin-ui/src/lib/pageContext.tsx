import {createContext, useContext} from "react";

let contextValue = ((window as any).pageContext) ?? {}

if(import.meta.env.DEV){
   contextValue = {
      manifest:{
          "title": "NeoBase",
          "version": "0.0.1",
          "description": "NeoBase Server",
      },
       ...contextValue
   };
}

const PageContext = createContext(contextValue)

export const PageContextProvider = (props: {children: React.ReactNode}) => {
    return <PageContext.Provider value={contextValue}>
        {props.children}
    </PageContext.Provider>
};

export const usePageContext = () => {
    return useContext(PageContext);
}