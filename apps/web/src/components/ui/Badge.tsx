import type { PropsWithChildren } from 'react';

type BadgeTone = 'slate' | 'emerald' | 'amber' | 'rose' | 'blue';

type BadgeProps = PropsWithChildren<{
  tone?: BadgeTone;
}>;

export function Badge({ children, tone = 'slate' }: BadgeProps) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
