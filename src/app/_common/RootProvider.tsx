"use client";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {RecoilRoot} from "recoil";
import ModalContainer from "../_components/_portal/ModalContainer";
import SubProvider from "./SubProvider";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootProvider({children}: {children: React.ReactNode}) {
  return (
    <QueryClientProvider client={client}>
      <RecoilRoot>
        {/* <ContextConsumer> */}
        <SubProvider>{children}</SubProvider>
        {/* </ContextConsumer> */}
        <ModalContainer />
      </RecoilRoot>
    </QueryClientProvider>
  );
}
