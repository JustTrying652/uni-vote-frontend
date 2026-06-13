interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumb?: string
  action?: React.ReactNode
}

export default function PageHeader({ title, subtitle, breadcrumb, action }: PageHeaderProps) {
  return (
    <div className="bg-[#1e3a5f] text-white">
      <div className="max-w-6xl mx-auto px-6 py-6">
        {breadcrumb && (
          <p className="text-blue-300 text-xs font-medium uppercase tracking-widest mb-2">
            {breadcrumb}
          </p>
        )}
        <div className="flex items-end justify-between">
          <div className="border-l-4 border-[#c9a84c] pl-4">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-blue-200 text-sm mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      </div>
    </div>
  )
}