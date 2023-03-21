import {createContext, useContext} from "react";

const contextValue = ((window as any).pageContext) ?? {}

const pageContext = createContext(contextValue)

export const PageContextProvider = (props: {children: React.ReactNode}) => {
    return <pageContext.Provider value={pageContext}>
        {props.children}
    </pageContext.Provider>
};

export const usePageContext = () => {
    const context = useContext(pageContext);
    return context;
}