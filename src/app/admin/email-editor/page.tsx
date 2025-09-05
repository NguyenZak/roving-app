import EmailEditor from "@/components/admin/EmailEditor";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

export default function EmailEditorPage() {
  return (
    <AdminPageWrapper>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between pb-6 border-b">
          <div>
            <h1 className="text-3xl font-inter-bold tracking-tight text-gray-900">Email Template Editor</h1>
            <p className="mt-2 text-gray-600 font-inter-normal">
              Customize the content and templates of your confirmation and admin notification emails
            </p>
          </div>
        </div>

        {/* Email Editor Component */}
        <EmailEditor />
      </div>
    </AdminPageWrapper>
  );
}
