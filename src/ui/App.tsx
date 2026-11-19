import { ContentProvider } from "../app/content";
import { StartScreen } from "./screens/StartScreen";

export function App() {
  return (
    <ContentProvider>
      <StartScreen />
    </ContentProvider>
  );
}
