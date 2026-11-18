import { copy } from "../copy";
import styles from "./StartScreen.module.css";

export function StartScreen() {
  return (
    <main className={styles.screen}>
      <h1 className={styles.title}>{copy.start.title}</h1>
    </main>
  );
}
