import type { PropsWithChildren } from 'react';

type TableProps = PropsWithChildren<{
  className?: string;
}>;

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className={`table-shell${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}
