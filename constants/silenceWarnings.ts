/**
 * Suppresses known, harmless deprecation warnings emitted by third-party
 * libraries (react-native-paper / react-navigation) under react-native-web.
 *
 * These come from library internals we don't control and only add console
 * noise. Importing this module for its side effect filters them out in dev.
 * Remove an entry once the upstream library stops emitting it.
 */
const IGNORED_WARNINGS = [
  'props.pointerEvents is deprecated',
  '"shadow*" style props are deprecated',
  'useNativeDriver` is not supported because the native animated module is missing',
];

if (__DEV__) {
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    const message = typeof args[0] === 'string' ? args[0] : '';
    if (IGNORED_WARNINGS.some((pattern) => message.includes(pattern))) {
      return;
    }
    originalWarn(...args);
  };
}
