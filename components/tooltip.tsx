import React from 'react';
import { Tooltip as PaperTooltip } from 'react-native-paper';

type Props = {
  /** Text shown on hover (web) / long-press (touch). */
  label?: string;
  /** When false, the child is rendered without a tooltip. */
  enabled?: boolean;
  children: React.ReactElement;
};

/**
 * Thin wrapper over Paper's Tooltip with sensible defaults. Tooltips are
 * anchored to their child (not part of the imperative overlay module) — wrap a
 * single pressable element. Pass `enabled={collapsed}` to only show labels when
 * the trigger's own label is hidden.
 */
export default function Tooltip({ label, enabled = true, children }: Props) {
  if (!enabled || !label) return children;
  return (
    <PaperTooltip title={label} enterTouchDelay={300} leaveTouchDelay={150}>
      {children}
    </PaperTooltip>
  );
}
