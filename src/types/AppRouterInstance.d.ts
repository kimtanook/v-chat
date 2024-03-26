import "next/dist/shared/lib/app-router-context.shared-runtime";

export type RouterEvent = "routeChangeStart" | "routeChangeComplete";

declare module "next/dist/shared/lib/app-router-context.shared-runtime" {
  interface AppRouterInstance {
    events: {
      on: (
        event: RouterEvent,
        cb: (url: string, options?: any) => void
      ) => void;
      off: (
        event: RouterEvent,
        cb: (url: string, options?: any) => void
      ) => void;
    };
  }
}
