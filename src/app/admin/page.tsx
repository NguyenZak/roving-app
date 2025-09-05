import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Package,
  BarChart3,
  Activity
} from "lucide-react";

export const dynamic = "force-dynamic";

const stats = [
  {
    title: "Total Tours",
    value: "24",
    change: "+12%",
    changeType: "positive",
    icon: MapPin,
    color: "from-blue-500 to-blue-600"
  },
  {
    title: "Active Bookings",
    value: "128",
    change: "+8%",
    changeType: "positive", 
    icon: Calendar,
    color: "from-green-500 to-green-600"
  },
  {
    title: "Monthly Revenue",
    value: "$12,430",
    change: "+23%",
    changeType: "positive",
    icon: DollarSign,
    color: "from-purple-500 to-purple-600"
  },
  {
    title: "Total Users",
    value: "356",
    change: "+5%",
    changeType: "positive",
    icon: Users,
    color: "from-orange-500 to-orange-600"
  }
];

const recentBookings = [
  { id: 1, customer: "Sarah Johnson", tour: "Ha Long Bay Cruise", date: "2025-08-01", status: "confirmed", amount: "$450" },
  { id: 2, customer: "Michael Chen", tour: "Sapa Trekking", date: "2025-08-02", status: "pending", amount: "$320" },
  { id: 3, customer: "Emma Davis", tour: "Mekong Delta", date: "2025-08-03", status: "confirmed", amount: "$280" },
  { id: 4, customer: "David Wilson", tour: "Hanoi City Tour", date: "2025-08-04", status: "cancelled", amount: "$150" },
  { id: 5, customer: "Lisa Brown", tour: "Phu Quoc Island", date: "2025-08-05", status: "confirmed", amount: "$520" }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function AdminDashboard() {
  return (
    <AdminPageWrapper>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your travel business today.</p>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Revenue Overview
            </CardTitle>
            <p className="text-sm text-gray-600">Monthly revenue performance</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-blue-600 font-medium">Chart Component</p>
                <p className="text-xs text-blue-500">Revenue by month visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Activity className="h-5 w-5 text-green-600" />
              Booking Trends
            </CardTitle>
            <p className="text-sm text-gray-600">Tour popularity and booking patterns</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Activity className="h-12 w-12 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-green-600 font-medium">Chart Component</p>
                <p className="text-xs text-green-500">Bookings by tour visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Recent Bookings */}
      <section>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Calendar className="h-5 w-5 text-purple-600" />
              Recent Bookings
            </CardTitle>
            <p className="text-sm text-gray-600">Latest customer bookings and their status</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm">Customer</th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm">Tour</th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm">Date</th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm">Amount</th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{booking.customer}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-900">{booking.tour}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-600">{booking.date}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-green-600">{booking.amount}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </AdminPageWrapper>
  );
}



