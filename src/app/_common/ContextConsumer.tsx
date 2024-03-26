"use client";

import {RouterEvent} from "@/types/AppRouterInstance";
import _ from "lodash";
import {
  AppRouterContext,
  AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {useCallback, useEffect, useRef} from "react";

const coreMethodFields = [
  "push",
  "replace",
  "refresh",
  "back",
  "prefetch",
  "forward",
] as const;

const routerEvents: Record<
  RouterEvent,
  Array<(url: string, options?: any) => void>
> = {
  routeChangeStart: [],
  routeChangeComplete: [],
};

const ContextConsumer = ({children}: {children: React.ReactNode}) => {
  const index = useRef(0);

  const events: AppRouterInstance["events"] = {
    on(event: RouterEvent, cb: (url: string, options?: any) => void) {
      routerEvents[event] = [...routerEvents[event], cb];
    },
    off(event: RouterEvent, cb: (url: string, options?: any) => void) {
      routerEvents[event] = _.without(routerEvents[event], cb);
    },
  };
  function proxy(
    router: AppRouterInstance,
    field: (typeof coreMethodFields)[number]
  ) {
    const method = router[field];

    Object.defineProperty(router, field, {
      get: () => {
        return (url: string, options?: any) => {
          try {
            if (!_.isEmpty(routerEvents.routeChangeStart)) {
              routerEvents.routeChangeStart.forEach((fn) => fn(url, options));
            }
            method(url, options);
          } catch (e) {
            console.error(e);
          }
        };
      },
    });
  }
  const eventListenerHandler = useCallback(
    (listener: EventListenerOrEventListenerObject) => (event: Event) => {
      const eventListener =
        "handleEvent" in listener ? listener.handleEvent : listener;

      if (event.type === "popstate") {
        if (!_.isEmpty(routerEvents.routeChangeStart)) {
          try {
            routerEvents.routeChangeStart.forEach((fn) =>
              fn(window.location.pathname, event)
            );
          } catch (e) {
            const backEvent = index.current > window.history.state?.index;
            const forwardEvent = index.current < window.history.state?.index;

            if (backEvent) window.history.forward();
            else if (forwardEvent) window.history.back();
            else return;

            return console.error(e);
          }
        }
      }

      eventListener(event);
    },
    []
  );
  useEffect(() => {
    const originAddEventListener = window.addEventListener;

    window.addEventListener = function <K extends keyof WindowEventMap>(
      type: K,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) {
      originAddEventListener(type, eventListenerHandler(listener), options);
    };

    return () => {
      window.addEventListener = originAddEventListener;
    };
  }, [eventListenerHandler]);

  useEffect(() => {
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    index.current = window.history.state?.index ?? 0;

    window.history.pushState = (
      data: any,
      _: string,
      url?: string | URL | null
    ) => {
      const historyIndex = window.history.state?.index ?? 0;
      const nextIndex = historyIndex + 1;
      const state = {...data, index: nextIndex};

      index.current = nextIndex;

      return History.prototype.pushState.apply(window.history, [state, _, url]);
    };
    window.history.replaceState = (
      data: any,
      _: string,
      url?: string | URL | null
    ) => {
      const historyIndex = window.history.state?.index ?? 0;
      const state = {...data, index: historyIndex};

      index.current = historyIndex;

      return History.prototype.replaceState.apply(window.history, [
        state,
        _,
        url,
      ]);
    };

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  return (
    <AppRouterContext.Consumer>
      {(router) => {
        if (router) {
          router.events = events;
          coreMethodFields.forEach((field) => proxy(router, field));
        }
        return children;
      }}
    </AppRouterContext.Consumer>
  );
};

export default ContextConsumer;
