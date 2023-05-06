import { PageContextProvider } from "../lib/pageContext";
import { AuthProvider } from "@neobase/client/react";
import { Forms } from '@neobase/client/react'
import { Api } from "../lib/api";
import '@neobase/client/react/theme.css'

export const App = () => {
    const dashboardUrl = location.protocol + "//" + location.host + "/dashboard/";
    return (
        <PageContextProvider >
            <AuthProvider api={Api}>
                <Forms.RegisterForm returnTo={dashboardUrl} />
            </AuthProvider>
        </PageContextProvider>
    );
}
