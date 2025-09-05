"use client";

interface AdminPageWrapperProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export default function AdminPageWrapper({ 
  children, 
  className = "", 
  maxWidth = "full" 
}: AdminPageWrapperProps) {
  const maxWidthClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl", 
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    "2xl": "max-w-7xl",
    full: "max-w-none"
  };

  return (
    <div className={`min-h-full bg-gray-50`}>
      <div className={`mx-auto ${maxWidthClasses[maxWidth]}`}>
        <div className={`p-6 lg:p-8 space-y-6 ${className}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
