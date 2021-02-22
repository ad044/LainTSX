import React, { FC, ReactElement, Suspense } from "react";
import { render } from "@testing-library/react";

const SuspenseProvider: FC = ({ children }) => {
  return <Suspense fallback={null}>{children}</Suspense>;
};

const customRender = (ui: ReactElement) =>
  render(ui, { wrapper: SuspenseProvider });

export * from "@testing-library/react";

export { customRender as render };
