import type { PropsWithChildren } from 'react';

type CardProps = PropsWithChildren<{
  title?: string;
  description?: string;
  className?: string;
}>;

export function Card({
  title,
  description,
  className = '',
  children,
}: CardProps) {
  return (
    <section className={`card${className ? ` ${className}` : ''}`}>
      {(title || description) && (
        <div className="card-header">
          <div>
            {title && <h3>{title}</h3>}
            {description && <p>{description}</p>}
          </div>
        </div>
      )}
      {children}
    </section>
  );
}
