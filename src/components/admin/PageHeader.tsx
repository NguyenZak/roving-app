import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: ReactNode;
  };
  stats?: Array<{
    label: string;
    value: string | number;
    change?: string;
    changeType?: "positive" | "negative" | "neutral";
    icon?: ReactNode;
    color?: string;
  }>;
}

export default function PageHeader({ title, description, action, stats }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {/* Main Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
        </div>
        {action && (
          action.onClick ? (
            <Button 
              onClick={action.onClick}
              className="px-6 py-3 font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </Button>
          ) : (
            <Button 
              asChild
              className="px-6 py-3 font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
            >
              <a href={action.href}>
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </a>
            </Button>
          )
        )}
      </div>

      {/* Stats Cards */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white border-0 shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  {stat.change && (
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 
                        stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">from last month</span>
                    </div>
                  )}
                </div>
                {stat.icon && (
                  <div className={`p-3 rounded-xl shadow-lg ${
                    stat.color || 'bg-blue-500'
                  }`}>
                    {stat.icon}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
