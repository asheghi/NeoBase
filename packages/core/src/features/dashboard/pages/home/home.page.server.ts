import { PageContext } from "../../../../lib/types/vite-ssr.type";

export function onBeforeRender(pageContext: PageContext): {
  pageContext?: Partial<PageContext>;
} {
  // is Authenticated?
  if (!pageContext.user)
    return {
      pageContext: {
        redirect: "/login",
      },
    };
  // authenticated but not a super admin
  if (pageContext.user.role !== "admin") {
    return {
      pageContext: {
        redirect: "/profile",
      },
    };
  }
  return {};
}
