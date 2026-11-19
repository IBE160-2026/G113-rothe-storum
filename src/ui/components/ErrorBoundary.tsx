// Top-level error boundary (AR-10, #17, #24). A render error, including a
// ContentError from in-tree content loading, shows a fallback screen instead
// of an empty #root. The fallback uses only copy, never content. It does not
// catch event-handler or async errors (see spec-1-3 Design Notes).
import { Component, type ReactNode } from "react";
import { ContentError } from "../../app/content";
import { copy } from "../copy";
import styles from "./ErrorBoundary.module.css";

interface Props {
  children: ReactNode;
  /** Called by the Reload button. Defaults to reloading the page. */
  onReload?: () => void;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown): void {
    if (error instanceof ContentError) {
      console.error("Invalid content:", error.problems);
    } else {
      console.error(error);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    const onReload = this.props.onReload ?? (() => location.reload());
    return (
      <main className={styles.screen}>
        <h1 className={styles.title}>{copy.error.title}</h1>
        <p className={styles.body}>{copy.error.body}</p>
        <button type="button" className={styles.reload} onClick={onReload}>
          {copy.error.reload}
        </button>
      </main>
    );
  }
}
