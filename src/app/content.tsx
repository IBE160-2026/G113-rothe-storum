// In-tree content loading (AD-7, AR-10). loadContent() runs in a lazy
// useState initialiser, so a ContentError is thrown during render and caught
// by the top-level ErrorBoundary instead of leaving an empty #root. The UI
// reads content through useContent() and never imports src/content/.
import { createContext, useContext, useState, type ReactNode } from "react";
import { loadContent } from "../content/load";
import type { Content } from "../rules/types";

export { ContentError } from "../content/load";

const ContentContext = createContext<Content | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content] = useState(loadContent);
  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

/** The validated game content. Must be used inside ContentProvider. */
export function useContent(): Content {
  const content = useContext(ContentContext);
  if (content === null) {
    throw new Error("useContent() must be used inside <ContentProvider>");
  }
  return content;
}
