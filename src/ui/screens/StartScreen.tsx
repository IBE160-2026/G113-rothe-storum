// Start screen (FR-1; EXPERIENCE → IA → Start screen, mockups S1 and X1a).
// Logo, tagline, optional name, "New journey" and "How to play". The screen
// only reports what the player chose; App decides where to go next.
import { Logo } from "../components/Logo";
import { NameField } from "../components/NameField";
import { copy } from "../copy";
import controls from "../styles/controls.module.css";
import styles from "./StartScreen.module.css";

interface Props {
  name: string;
  onNameChange: (name: string) => void;
  onNewJourney: () => void;
  onHowToPlay: () => void;
}

export function StartScreen({
  name,
  onNameChange,
  onNewJourney,
  onHowToPlay,
}: Props) {
  return (
    <main className={styles.screen}>
      <h1 className={styles.title}>
        <Logo size="large" />
        <span className={controls.visuallyHidden}>{copy.start.title}</span>
      </h1>
      <p className={styles.tagline}>{copy.start.tagline}</p>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          onNewJourney();
        }}
      >
        <NameField value={name} onChange={onNameChange} />
        <button type="submit" className={controls.primary}>
          {copy.start.newJourney}
        </button>
      </form>
      <button type="button" className={controls.textLink} onClick={onHowToPlay}>
        {copy.start.howToPlay}
      </button>
    </main>
  );
}
