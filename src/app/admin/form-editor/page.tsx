import FormEditor from "@/components/admin/FormEditor";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

export default function FormEditorPage() {
  return (
    <AdminPageWrapper>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between pb-6 border-b">
          <div>
            <h1 className="text-3xl font-inter-bold tracking-tight text-gray-900">Form Editor</h1>
            <p className="mt-2 text-gray-600 font-inter-normal">
              Customize the content and appearance of your contact form
            </p>
          </div>
        </div>

        {/* Form Editor Component */}
        <FormEditor />
      </div>
    </AdminPageWrapper>
  );
}
