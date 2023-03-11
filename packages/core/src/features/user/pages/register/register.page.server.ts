import { PageContext } from "../../../../lib/types/vite-ssr.type";

export const onBeforeRender = (pageContext: PageContext) => {
  const encodedRedirectUrl = pageContext?.urlQuery?.redirect;
  const redirectUrl = Buffer.from(
    `${encodedRedirectUrl ?? ""}`,
    "base64"
  ).toString();
  return {
    pageContext: {
      pageProps: {
        redirectUrl,
      },
    },
  };
};
