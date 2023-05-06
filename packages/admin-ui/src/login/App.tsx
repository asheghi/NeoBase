import { PageContextProvider } from "../lib/pageContext";
import { AuthProvider } from "@neobase/client/react";
import { Api } from "../lib/api";
import { Forms } from '@neobase/client/react'

export const App = () => {
    const dashboardUrl = location.protocol + "//" + location.host + "/dashboard/";
    return (
        <PageContextProvider >
            <AuthProvider api={Api}>
                <Forms.LoginForm returnTo={dashboardUrl} />
            </AuthProvider>
        </PageContextProvider>
    );
}
