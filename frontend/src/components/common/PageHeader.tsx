interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="mb-5">
      <h1 className="text-2xl font-semibold text-ink">{title}</h1>
      <p className="mt-1 text-sm text-muted">{subtitle}</p>
    </header>
  );
}
