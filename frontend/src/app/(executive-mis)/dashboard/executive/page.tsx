"use client";

import { useState } from "react";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import {
    IndianRupee,
    TrendingUp,
    TrendingDown,
    Activity,
    Users,
    Bed,
    Building2,
    Calendar,
    Target,
    Award,
    ArrowUpRight,
    Download,
    Filter
} from "lucide-react";

// --- Mock Data ---
const revenueTrends = [
    { name: "Jan", revenue: 45, expenses: 32 },
    { name: "Feb", revenue: 48, expenses: 34 },
    { name: "Mar", revenue: 52, expenses: 36 },
    { name: "Apr", revenue: 49, expenses: 35 },
    { name: "May", revenue: 58, expenses: 38 },
    { name: "Jun", revenue: 61, expenses: 40 },
    { name: "Jul", revenue: 65, expenses: 42 },
];

const departmentPerformance = [
    { name: "Oncology", revenue: 2800000, growth: "+20%", patients: 1240 },
    { name: "Cardiology", revenue: 2100000, growth: "+12%", patients: 1850 },
    { name: "Orthopedics", revenue: 1800000, growth: "+8%", patients: 2100 },
    { name: "Neurology", revenue: 1500000, growth: "+15%", patients: 950 },
];

const patientDemographics = [
    { name: "0-18 Years", value: 15 },
    { name: "19-35 Years", value: 30 },
    { name: "36-50 Years", value: 25 },
    { name: "51-70 Years", value: 20 },
    { name: "70+ Years", value: 10 },
];

const strategicGoals = [
    { title: "Reduce Average Wait Time", target: "15 mins", current: "22 mins", progress: 65, color: "bg-blue-500" },
    { title: "Expand Telemedicine", target: "40% of consults", current: "28%", progress: 70, color: "bg-emerald-500" },
    { title: "Improve Patient Satisfaction (NPS)", target: "85", current: "78", progress: 85, color: "bg-purple-500" },
    { title: "Reduce Readmission Rates", target: "< 5%", current: "7.2%", progress: 40, color: "bg-yellow-500" },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function ExecutiveDashboard() {
    const [activeTab, setActiveTab] = useState("financial");

    const formatCurrency = (val: number) => `₹${val}M`;

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
                        Executive Overview
                    </h1>
                    <p className="text-gray-400 mt-1 text-sm">
                        Strategic insights and high-level performance metrics.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 bg-dark-secondary border border-dark-tertiary rounded hover:bg-dark-tertiary transition-colors text-sm text-gray-300">
                        <Calendar size={16} />
                        <span>YTD 2026</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-dark-secondary border border-dark-tertiary rounded hover:bg-dark-tertiary transition-colors text-sm text-gray-300">
                        <Filter size={16} />
                        <span>All Branches</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded hover:bg-emerald-500 hover:text-white transition-all text-sm font-medium">
                        <Download size={16} />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* High-Level KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* KPI 1 */}
                <div className="bg-dark-secondary rounded5 border border-dark-tertiary relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <IndianRupee size={64} />
                    </div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <IndianRupee className="text-emerald-500" size={20} />
                            </div>
                            <span className="text-gray-400 font-medium">Total Revenue</span>
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">₹3.78B</h3>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            <TrendingUp size={14} /> +14.2%
                        </span>
                        <span className="text-gray-500">vs last year</span>
                    </div>
                </div>

                {/* KPI 2 */}
                <div className="bg-dark-secondary rounded5 border border-dark-tertiary relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity size={64} />
                    </div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Activity className="text-blue-500" size={20} />
                            </div>
                            <span className="text-gray-400 font-medium">EBITDA Margin</span>
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">24.5%</h3>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            <TrendingUp size={14} /> +2.1%
                        </span>
                        <span className="text-gray-500">vs last year</span>
                    </div>
                </div>

                {/* KPI 3 */}
                <div className="bg-dark-secondary rounded5 border border-dark-tertiary relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users size={64} />
                    </div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Users className="text-purple-500" size={20} />
                            </div>
                            <span className="text-gray-400 font-medium">Total Patients</span>
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">1.24M</h3>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            <TrendingUp size={14} /> +8.4%
                        </span>
                        <span className="text-gray-500">vs last year</span>
                    </div>
                </div>

                {/* KPI 4 */}
                <div className="bg-dark-secondary rounded5 border border-dark-tertiary relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Bed size={64} />
                    </div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-yellow-500/10 rounded-lg">
                                <Bed className="text-yellow-500" size={20} />
                            </div>
                            <span className="text-gray-400 font-medium">Avg Bed Occupancy</span>
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">82.3%</h3>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="flex items-center gap-1 text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                            <TrendingDown size={14} /> -1.2%
                        </span>
                        <span className="text-gray-500">vs last year</span>
                    </div>
                </div>
            </div>

            {/* Main Content Tabs */}
            <div className="bg-dark-secondary roundedrder border-dark-tertiary overflow-hidden">
                <div className="flex gap-1 p-1 bg-dark-tertiary/30 border-b border-dark-tertiary overflow-x-auto">
                    {[
                        { id: "financial", label: "Financial Performance", icon: IndianRupee },
                        { id: "operational", label: "Operational Metrics", icon: Activity },
                        { id: "strategic", label: "Strategic Goals", icon: Target },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? "bg-dark-secondary text-emerald-400 shadow-sm"
                                        : "text-gray-400 hover:text-gray-200 hover:bg-dark-tertiary/50"
                                }`}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="p-6">
                    {activeTab === "financial" && (
                        <div className="space-y-6">
                            {/* Financial Chart */}
                            <div className="bg-dark-tertiary/20 p-5 roundedrder border-dark-tertiary">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Revenue vs Expenses</h3>
                                        <p className="text-sm text-gray-400">Monthly breakdown (in Millions ₹)</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                            <span className="text-gray-300">Revenue</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                            <span className="text-gray-300">Expenses</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-[350px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={revenueTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                </linearGradient>
                                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                            <YAxis tickFormatter={formatCurrency} stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: "#1e1e1e", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                                                itemStyle={{ fontSize: "14px", fontWeight: 500 }}
                                                formatter={(value: number) => [`₹${value}M`, undefined]}
                                            />
                                            <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                            <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Department Performance Table */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4">Top Performing Departments</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-dark-tertiary">
                                                <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</th>
                                                <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">YTD Revenue</th>
                                                <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Growth</th>
                                                <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Patients</th>
                                                <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-dark-tertiary">
                                            {departmentPerformance.map((dept, idx) => (
                                                <tr key={idx} className="hover:bg-dark-tertiary/20 transition-colors">
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-dark-tertiary flex items-center justify-center text-emerald-400 font-bold text-xs">
                                                                {dept.name.charAt(0)}
                                                            </div>
                                                            <span className="font-medium text-gray-200">{dept.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 font-semibold text-white">
                                                        ₹{(dept.revenue / 1000000).toFixed(1)}M
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="inline-flex items-center gap-1 text-emerald-400 text-sm font-medium bg-emerald-500/10 px-2 py-1 rounded">
                                                            <TrendingUp size={14} /> {dept.growth}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-gray-300">
                                                        {dept.patients.toLocaleString()}
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <button className="text-gray-400 hover:text-emerald-400 transition-colors p-1">
                                                            <ArrowUpRight size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "operational" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Patient Demographics */}
                            <div className="bg-dark-tertiary/20 p-5 roundedrder border-dark-tertiary">
                                <h3 className="text-lg font-bold text-white mb-6">Patient Demographics</h3>
                                <div className="h-[300px] w-full flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={patientDemographics}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={80}
                                                outerRadius={110}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {patientDemographics.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: "#1e1e1e", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                                                formatter={(value: number) => [`${value}%`, 'Share']}
                                            />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Resource Utilization */}
                            <div className="bg-dark-tertiary/20 p-5 roundedrder border-dark-tertiary flex flex-col gap-5">
                                <h3 className="text-lg font-bold text-white mb-2">Resource Utilization</h3>
                                
                                <div className="space-y-5">
                                    <div>
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <p className="text-gray-300 font-medium">Operation Theaters</p>
                                                <p className="text-xs text-gray-500">Usage rate across all branches</p>
                                            </div>
                                            <span className="text-lg font-bold text-blue-400">76%</span>
                                        </div>
                                        <div className="w-full bg-dark-tertiary rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <p className="text-gray-300 font-medium">ICU Beds</p>
                                                <p className="text-xs text-gray-500">Critical care capacity</p>
                                            </div>
                                            <span className="text-lg font-bold text-red-400">92%</span>
                                        </div>
                                        <div className="w-full bg-dark-tertiary rounded-full h-2">
                                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <p className="text-gray-300 font-medium">MRI / CT Scanners</p>
                                                <p className="text-xs text-gray-500">Diagnostic equipment uptime</p>
                                            </div>
                                            <span className="text-lg font-bold text-emerald-400">88%</span>
                                        </div>
                                        <div className="w-full bg-dark-tertiary rounded-full h-2">
                                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg flex items-start gap-3">
                                        <Award className="text-yellow-500 shrink-0 mt-0.5" size={18} />
                                        <div>
                                            <p className="text-sm font-medium text-yellow-400">Action Required</p>
                                            <p className="text-xs text-gray-400 mt-1">ICU occupancy is critical (>90%). Consider activating overflow protocols or expediting step-down transfers.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "strategic" && (
                        <div>
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">FY26 Strategic Goals Progress</h3>
                                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20">
                                    Q3 Review
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {strategicGoals.map((goal, idx) => (
                                    <div key={idx} className="p-5 border border-dark-tertiary bg-dark-tertiary/10 roundedver:bg-dark-tertiary/30 transition-colors">
                                        <h4 className="font-semibold text-gray-200 mb-1">{goal.title}</h4>
                                        <div className="flex justify-between text-sm mb-4">
                                            <span className="text-gray-500">Target: <strong className="text-gray-300">{goal.target}</strong></span>
                                            <span className="text-gray-500">Current: <strong className="text-gray-300">{goal.current}</strong></span>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-dark-secondary rounded-full h-2.5 overflow-hidden border border-dark-tertiary">
                                                <div 
                                                    className={`h-full rounded-full ${goal.color}`} 
                                                    style={{ width: `${goal.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-bold w-10 text-right text-gray-300">{goal.progress}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-6 p-5 border border-emerald-500/20 bg-emerald-500/5 rounded
                                <h4 className="font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                                    <Target size={18} />
                                    Executive Summary
                                </h4>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    The organization is on track to meet 3 out of 4 primary strategic goals for this fiscal year. 
                                    Significant improvements in patient satisfaction and telemedicine adoption have offset slight delays 
                                    in reducing readmission rates. Recommend re-allocating Q4 budget to the post-discharge care management team.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
