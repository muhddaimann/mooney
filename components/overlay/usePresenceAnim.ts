import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * Drives a 0→1 presence value for overlay enter/exit transitions. Animates to 1
 * on mount (and whenever `visible` flips true) and back to 0 when `visible`
 * turns false, invoking `onExited` once the exit settles so the owner can
 * unmount the element after it has animated away.
 */
export function usePresenceAnim(
  visible: boolean,
  onExited?: () => void,
  duration = 220,
) {
  const progress = useRef(new Animated.Value(0)).current;
  const exitedRef = useRef(onExited);
  exitedRef.current = onExited;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration,
      easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start(({ finished }) => {
      if (finished && !visible) exitedRef.current?.();
    });
    return () => animation.stop();
  }, [visible, duration, progress]);

  return progress;
}
