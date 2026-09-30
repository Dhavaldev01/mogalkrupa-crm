import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { safeNumber, formatCurrency } from "@/lib/utils";
import { Users, FileText, IndianRupee, Clock, Wallet, MoreHorizontal, ChevronDown } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import DateRangeFilter from "@/components/common/DateRangeFilter";
import MobileDateFilter from "@/components/mobile/MobileDateFilter";

export default function Dashboard() {
    const [dateFilter, setDateFilter] = useState({
        year: new Date().getFullYear().toString(),
        startDate: null,
        endDate: null
    });
    const { data: summaryResponse, isLoading, isError } = useQuery({
        queryKey: ["dashboard-summary", dateFilter.startDate, dateFilter.endDate],
        queryFn: () => dashboardService.getSummary({
            fromDate: dateFilter.startDate,
            toDate: dateFilter.endDate
        })
    });

    const data = summaryResponse?.data?.data || {};

    // We removed blocking if (isLoading) and if (isError) to let the dashboard render safely with empty data

    const billingOverviewData = (data.billingOverview || []).map(item => ({
        ...item,
        displayDate: item.date ? format(parseISO(item.date), 'dd MMM') : '',
        amount: safeNumber(item.amount)
    }));

    const paidAmount = safeNumber(data.paidAmount);
    const pendingAmount = safeNumber(data.pendingAmount);
    const totalPayment = paidAmount + pendingAmount;

    const paidPercentage = totalPayment > 0 ? ((paidAmount / totalPayment) * 100).toFixed(0) : 0;
    const pendingPercentage = totalPayment > 0 ? ((pendingAmount / totalPayment) * 100).toFixed(0) : 0;

    const paymentData = [
        { name: 'Paid Amount', value: paidAmount, color: '#E50914' },
        { name: 'Pending Amount', value: pendingAmount, color: '#E2E8F0' }
    ];

    return (
        <div className="p-3 md:p-[16px] space-y-3 md:space-y-[14px] bg-[#F8FAFC] md:bg-[#FAFAF9] min-h-[calc(100vh-56px)] pb-[calc(80px+env(safe-area-inset-bottom))] md:pb-[16px] w-full max-w-full overflow-hidden">
            {/* Top Bar */}
            <div className="flex flex-row justify-between items-center gap-2 mb-1 md:mb-2">
                <div>
                    <h1 className="text-[20px] md:text-[22px] font-bold text-[#0F172A] leading-tight">Dashboard</h1>
                    <p className="text-[11px] md:text-[13px] text-[#64748B] mt-0.5">Overview of your business</p>
                </div>
                <div className="md:hidden">
                    <MobileDateFilter dateFilter={dateFilter} setDateFilter={setDateFilter} />
                </div>
                <div className="hidden md:block">
                    <DateRangeFilter onApply={setDateFilter} />
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-[14px]">
                {[
                    { label: "Total Customers", value: data.totalCustomers || 0, icon: Users, color: "#E50914", bg: "#FDE8EA" },
                    { label: "Total Bills", value: data.totalInvoices || 0, icon: FileText, color: "#E50914", bg: "#FDE8EA" },
                    { label: "Total Billing", value: formatCurrency(data.todayBilling), icon: IndianRupee, color: "#059669", bg: "#D1FAE5" },
                    { label: "Pending Amount", value: formatCurrency(pendingAmount), icon: Clock, color: "#D97706", bg: "#FEF3C7" },
                    { label: "Paid Amount", value: formatCurrency(paidAmount), icon: Wallet, color: "#2563EB", bg: "#DBEAFE", hiddenMobile: true }
                ].map((stat, i) => (
                    <div key={i} className={`bg-white p-2.5 md:p-[16px] lg:p-[18px] rounded-[12px] md:rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.03)] border border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between md:justify-start gap-3 md:gap-[14px] ${stat.hiddenMobile ? "hidden md:flex" : "flex"}`}>
                        <div className="flex items-center gap-2 md:gap-0">
                            <div className="w-[28px] h-[28px] md:w-[44px] md:h-[44px] rounded-[6px] md:rounded-[8px] flex items-center justify-center shrink-0" style={{ backgroundColor: stat.bg, color: stat.color }}>
                                <stat.icon className="w-[14px] h-[14px] md:w-[22px] md:h-[22px]" strokeWidth={2.5} />
                            </div>
                            <p className="text-[11px] md:hidden font-medium text-[#475569] truncate max-w-[80px]">{stat.label}</p>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <p className="hidden md:block text-[13px] font-medium text-[#475569] mb-[4px] truncate">{stat.label}</p>
                            <h3 className="text-[18px] md:text-[24px] font-bold text-[#0F172A] leading-[1.15] truncate">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile Payment Status Card */}
            <div className="md:hidden bg-white rounded-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.03)] border border-[#E5E7EB] p-3 h-[110px] flex items-center gap-3">
                <div className="w-[80px] h-[80px] relative flex shrink-0 items-center justify-center">
                    {totalPayment > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={paymentData}
                                        cx="50%" cy="50%"
                                        innerRadius={28} outerRadius={38}
                                        dataKey="value" stroke="none"
                                    >
                                        {paymentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-0.5">
                                <span className="text-[8px] font-medium text-[#64748B]">Total</span>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full rounded-full border-4 border-[#F1F5F9] flex flex-col items-center justify-center">
                            <span className="text-[8px] font-medium text-[#64748B]">No Data</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h2 className="text-[12px] font-bold text-[#0F172A] mb-2 truncate">Payment Status</h2>
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#E50914]"></span>
                                <span className="text-[11px] font-medium text-[#475569]">Paid</span>
                            </div>
                            <span className="text-[11px] font-bold text-[#0F172A]">{paidPercentage}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#E2E8F0]"></span>
                                <span className="text-[11px] font-medium text-[#475569]">Pending</span>
                            </div>
                            <span className="text-[11px] font-bold text-[#0F172A]">{pendingPercentage}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Charts Row */}
            <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-[14px]">
                {/* Billing Overview */}
                <div className="lg:col-span-8 bg-white rounded-[8px] shadow-sm border border-[#E5E7EB] p-[16px] h-[340px] flex flex-col">
                    <div className="flex justify-between items-center mb-[14px] shrink-0">
                        <h2 className="text-[16px] font-bold text-[#0F172A]">Billing Overview</h2>
                        <button type="button" className="flex items-center gap-1.5 text-[13px] font-medium text-[#475569] hover:text-[#0F172A] outline-none">
                            This Month <ChevronDown size={16} />
                        </button>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        {billingOverviewData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={billingOverviewData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#E50914" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#E50914" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                    <XAxis dataKey="displayDate" tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                                    <RechartsTooltip
                                        formatter={(val) => [formatCurrency(val), 'Billing']}
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#E50914" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" activeDot={{ r: 6, fill: '#E50914', stroke: '#FFF', strokeWidth: 2 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-[14px] font-medium text-[#64748B]">No billing data this month</div>
                        )}
                    </div>
                </div>

                {/* Desktop Payment Status */}
                <div className="lg:col-span-4 bg-white rounded-[8px] shadow-sm border border-[#E5E7EB] p-[16px] h-[340px] flex flex-col">
                    <div className="flex justify-between items-center mb-1 shrink-0">
                        <h2 className="text-[16px] font-bold text-[#0F172A]">Payment Status</h2>
                        <button type="button" className="flex items-center gap-1.5 text-[13px] font-medium text-[#475569] hover:text-[#0F172A] outline-none">
                            This Month <ChevronDown size={16} />
                        </button>
                    </div>

                    <div className="flex-1 relative flex items-center justify-center min-h-0 py-2">
                        {totalPayment > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={paymentData}
                                            cx="50%" cy="50%"
                                            innerRadius={70} outerRadius={90}
                                            dataKey="value" stroke="none"
                                        >
                                            {paymentData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip formatter={(val) => formatCurrency(val)} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
                                    <span className="text-[13px] font-medium text-[#64748B]">Total</span>
                                    <span className="text-[18px] font-bold text-[#0F172A] leading-tight mt-0.5">{formatCurrency(totalPayment)}</span>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center text-[14px] font-medium text-[#64748B]">No payment data</div>
                        )}
                    </div>

                    <div className="mt-2 space-y-3 px-1 shrink-0">
                        <div className="flex justify-between items-center text-[14px]">
                            <div className="flex items-center gap-2.5 font-medium text-[#475569]">
                                <span className="size-3 rounded-full bg-[#E50914]"></span> Paid Amount
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-[#0F172A]">{formatCurrency(paidAmount)}</span>
                                <span className="text-[13px] font-medium text-[#64748B] w-8 text-right">{paidPercentage}%</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-[14px]">
                            <div className="flex items-center gap-2.5 font-medium text-[#475569]">
                                <span className="size-3 rounded-full bg-[#E2E8F0]"></span> Pending Amount
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-[#0F172A]">{formatCurrency(pendingAmount)}</span>
                                <span className="text-[13px] font-medium text-[#64748B] w-8 text-right">{pendingPercentage}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Invoices Header (Mobile) */}
            <div className="md:hidden flex justify-between items-end mt-1 mb-1 px-1">
                <h2 className="text-[14px] font-bold text-[#0F172A]">Recent Invoices</h2>
                <Link to="/invoices" className="text-[11px] font-bold text-[#E50914]">
                    View All
                </Link>
            </div>

            {/* Mobile Recent Invoices List */}
            <div className="md:hidden space-y-2">
                {data.recentInvoices?.length > 0 ? data.recentInvoices.slice(0, 5).map((inv) => {
                    const st = inv.status;
                    return (
                        <div key={inv._id} className="bg-white p-2.5 rounded-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.03)] border border-[#E5E7EB] flex items-center justify-between">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-[32px] h-[32px] rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center shrink-0">
                                    <FileText size={14} strokeWidth={2.5} />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[12px] font-bold text-[#0F172A] truncate">{inv.invoiceNumber}</span>
                                    </div>
                                    <div className="text-[10px] font-medium text-[#64748B] truncate mt-0.5">
                                        {new Date(inv.date).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })} &middot; {inv.customerSnapshot?.shopName || inv.customerSnapshot?.name}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end shrink-0 pl-2">
                                <span className="text-[12px] font-bold text-[#0F172A]">{formatCurrency(safeNumber(inv.grandTotal))}</span>
                                <span className={`mt-1 text-[9px] font-bold 
                                    ${st === "Paid" ? "text-[#00A651]" :
                                        st === "Partial" ? "text-[#F59E0B]" :
                                            "text-[#E50914]"}
                                `}>
                                    {st}
                                </span>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="py-6 text-center text-[#64748B] font-medium text-[12px]">No recent invoices</div>
                )}
            </div>

            {/* Desktop Recent Invoices Table */}
            <div className="hidden md:block bg-white rounded-[8px] shadow-sm border border-[#E5E7EB] overflow-hidden">
                <div className="p-[16px] border-b border-[#E5E7EB] flex justify-between items-center">
                    <h2 className="text-[16px] font-bold text-[#0F172A]">Recent Invoices</h2>
                    <Link to="/invoices" className="text-[13px] font-bold text-[#E50914] hover:underline flex items-center gap-1">
                        View All <span className="text-[16px] leading-none">→</span>
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[14px] whitespace-nowrap table-auto">
                        <thead className="bg-[#F8FAFC] text-[#0F172A] border-b border-[#E5E7EB]">
                            <tr>
                                <th className="py-3 px-4 font-semibold w-auto">Invoice</th>
                                <th className="py-3 px-4 font-semibold w-auto">Customer</th>
                                <th className="table-cell py-3 px-4 font-semibold">Date</th>
                                <th className="py-3 px-4 font-semibold text-right w-auto">Amount</th>
                                <th className="table-cell py-3 px-4 font-semibold text-right">Paid (₹)</th>
                                <th className="table-cell py-3 px-4 font-semibold text-right">Pending (₹)</th>
                                <th className="py-3 px-4 font-semibold text-center w-auto">Status</th>
                                <th className="table-cell py-3 px-4 font-semibold text-center w-[50px]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                            {data.recentInvoices?.length > 0 ? data.recentInvoices.map((inv) => {
                                const st = inv.status;
                                return (
                                    <tr key={inv._id} className="hover:bg-[#F8FAFC] transition-colors">
                                        <td className="py-3.5 px-4 font-semibold text-[#0F172A] overflow-hidden text-ellipsis">{inv.invoiceNumber}</td>
                                        <td className="py-3.5 px-4 overflow-hidden text-ellipsis">
                                            <div className="flex flex-col truncate">
                                                <span className="font-semibold text-[#0F172A] truncate">{inv.customerSnapshot?.shopName || inv.customerSnapshot?.name}</span>
                                                {inv.customerSnapshot?.shopName && <span className="text-[12px] text-[#64748B] mt-0.5 truncate">{inv.customerSnapshot?.name}</span>}
                                            </div>
                                        </td>
                                        <td className="table-cell py-3.5 px-4 text-[#475569]">{new Date(inv.date).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                        <td className="py-3.5 px-4 text-right font-bold text-[#0F172A] overflow-hidden text-ellipsis">{formatCurrency(safeNumber(inv.grandTotal))}</td>
                                        <td className="table-cell py-3.5 px-4 text-right font-semibold text-[#00A651]">{formatCurrency(safeNumber(inv.paidAmount))}</td>
                                        <td className="table-cell py-3.5 px-4 text-right font-semibold text-[#E50914]">{formatCurrency(safeNumber(inv.pendingAmount))}</td>
                                        <td className="py-3.5 px-4 text-center">
                                            <div className="flex justify-center">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[12px] font-semibold rounded-full
                                                    ${st === "Paid" ? "bg-[#E4F7EB] text-[#00A651]" :
                                                        st === "Partial" ? "bg-[#FFF3DF] text-[#F59E0B]" :
                                                            "bg-[#FDE7E8] text-[#E50914]"}
                                                `}>
                                                    <span className={`size-1.5 rounded-full 
                                                        ${st === "Paid" ? "bg-[#00A651]" :
                                                            st === "Partial" ? "bg-[#F59E0B]" :
                                                                "bg-[#E50914]"}
                                                    `}></span>
                                                    {st}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="table-cell py-3.5 px-4 text-center">
                                            <button className="text-[#64748B] hover:text-[#0F172A] p-1 rounded transition-colors outline-none focus:ring-2 focus:ring-[#E50914]/20 cursor-pointer inline-flex items-center justify-center">
                                                <MoreHorizontal size={18} strokeWidth={2} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="8" className="py-8 text-center text-[#64748B] font-medium text-[14px]">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}