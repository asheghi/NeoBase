import { PageContext } from "../../../../lib/types/vite-ssr.type";

export const onBeforeRender = (pageContext: PageContext) => {
  const encodedRedirectUrl = pageContext?.urlQuery?.redirect;
  let redirectUrl: string | undefined = undefined;
  if (encodedRedirectUrl) {
    redirectUrl = Buffer.from(
      `${encodedRedirectUrl ?? ""}`,
      "base64"
    ).toString();
  }

  return {
    pageContext: {
      pageProps: {
        redirectUrl,
      },
    },
  };
};
