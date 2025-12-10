import type { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { queryClient } from "@/shared/utils";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

const isDev = import.meta.env.DEV;

export const AppProviders = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        className: "font-sans",
      }}
    />
    {isDev && (
      <TanStackDevtools
        config={{
          defaultOpen: false,
          requireUrlFlag: true,
          urlFlag: "devtools",
        }}
        plugins={[
          { name: "TanStack Query", render: <ReactQueryDevtoolsPanel /> },
          {
            name: "TanStack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    )}
  </QueryClientProvider>
);
