import { ErrorBoundary } from './components/ErrorBoundary';
import { Game } from './components/Game';
import { useThemeStore } from './store/themeStore';

export default function App() {
  useThemeStore.getState().init();

  return (
    <ErrorBoundary>
      <Game />
    </ErrorBoundary>
  );
}
