import { useThemeStore } from '../store/themeStore';

export function Settings() {
  const dark = useThemeStore((s) => s.dark);
  const audio = useThemeStore((s) => s.audio);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const toggleAudio = useThemeStore((s) => s.toggleAudio);

  return (
    <div className="flex gap-2 mt-2">
      <button
        onClick={toggleTheme}
        className="px-3 py-1.5 rounded-lg bg-gray-800 text-sm text-gray-300 hover-grow active:scale-95 transition-transform duration-160 ease-out"
        style={{ transitionProperty: 'transform' }}
      >
        {dark ? '\u263E' : '\u2600'} {dark ? 'Dark' : 'Light'}
      </button>
      <button
        onClick={toggleAudio}
        className="px-3 py-1.5 rounded-lg bg-gray-800 text-sm text-gray-300 hover-grow active:scale-95 transition-transform duration-160 ease-out"
        style={{ transitionProperty: 'transform' }}
      >
        {audio ? '\u{1F50A}' : '\u{1F507}'} Sound
      </button>
    </div>
  );
}
