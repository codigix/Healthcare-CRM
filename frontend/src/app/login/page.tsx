"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI, API_URL } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { 
 Shield, 
 Stethoscope, 
 Package, 
 FlaskConical, 
 ConciergeBell,
 Mail,
 Lock,
 User,
 Eye,
 EyeOff,
 PlusCircle,
 LogIn,
 CheckCircle2,
 AlertCircle,
 Pill
} from "lucide-react";

const DEPARTMENTS = [
 { 
 id: 'Admin', 
 label: 'Admin', 
 icon: Shield, 
 desc: 'Central system controls', 
 role: 'admin', 
 color: 'border-blue-500/30 hover:border-blue-500 text-blue-400 bg-blue-500/5 hover:bg-blue-500/10' 
 },
 { 
 id: 'Doctor', 
 label: 'Doctor', 
 icon: Stethoscope, 
 desc: 'Consultations & clinic care', 
 role: 'doctor', 
 color: 'border-emerald-500/30 hover:border-emerald-500 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10' 
 },
 { 
 id: 'Pharmacy', 
 label: 'Pharmacy', 
 icon: Pill, 
 desc: 'Medications & prescriptions', 
 role: 'pharmacy', 
 color: 'border-teal-500/30 hover:border-teal-500 text-teal-400 bg-teal-500/5 hover:bg-teal-500/10' 
 },
 { 
 id: 'Inventory', 
 label: 'Inventory', 
 icon: Package, 
 desc: 'Stocks & clinical supplies', 
 role: 'inventory', 
 color: 'border-amber-500/30 hover:border-amber-500 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10' 
 },
 { 
 id: 'Laboratory', 
 label: 'Laboratory', 
 icon: FlaskConical, 
 desc: 'Testing & diagnostics', 
 role: 'laboratory', 
 color: 'border-purple-500/30 hover:border-purple-500 text-purple-400 bg-purple-500/5 hover:bg-purple-500/10' 
 },
 { 
 id: 'Receptionist', 
 label: 'Receptionist', 
 icon: ConciergeBell, 
 desc: 'Front desk & bookings', 
 role: 'receptionist', 
 color: 'border-pink-500/30 hover:border-pink-500 text-pink-400 bg-pink-500/5 hover:bg-pink-500/10' 
 }
];

export default function LoginPage() {
 const [isRegister, setIsRegister] = useState(false);
 
 // Login State
 const [loginEmail, setLoginEmail] = useState("");
 const [loginPassword, setLoginPassword] = useState("");
 
 // Register State
 const [regName, setRegName] = useState("");
 const [regEmail, setRegEmail] = useState("");
 const [regPassword, setRegPassword] = useState("");
 const [regConfirmPassword, setRegConfirmPassword] = useState("");
 const [selectedDept, setSelectedDept] = useState("Doctor");
 
 // General State
 const [showPassword, setShowPassword] = useState(false);
 const [error, setError] = useState("");
 const [success, setSuccess] = useState("");
 const [loading, setLoading] = useState(false);
 
 const router = useRouter();
 const { setAuth } = useAuthStore();

 const handleLogin = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);
 setError("");
 setSuccess("");

 try {
 const response = await authAPI.login(loginEmail, loginPassword);
 const { token, user } = response.data;

 localStorage.setItem("token", token);
 setAuth(user, token);
 setSuccess("Logged in successfully! Redirecting...");
 setTimeout(() => {
 router.push("/dashboard");
 }, 1000);
 } catch (err: any) {
 if (!err.response) {
 setError(`Unable to connect to the backend server (${API_URL}). Please verify that your backend server is running and accessible.`);
 } else {
 setError(err.response?.data?.error || "Invalid credentials. Please try again.");
 }
 } finally {
 setLoading(false);
 }
 };

 const handleRegister = async (e: React.FormEvent) => {
 e.preventDefault();
 setError("");
 setSuccess("");

 if (!regName || !regEmail || !regPassword || !selectedDept) {
 setError("Please fill in all fields.");
 return;
 }

 if (regPassword !== regConfirmPassword) {
 setError("Passwords do not match.");
 return;
 }

 if (regPassword.length < 6) {
 setError("Password must be at least 6 characters.");
 return;
 }

 setLoading(true);

 try {
 const deptDetails = DEPARTMENTS.find(d => d.id === selectedDept);
 const payload: any = {
 name: regName,
 email: regEmail,
 password: regPassword,
 role: deptDetails?.role || 'staff',
 department: selectedDept
 };

 const response = await authAPI.register(payload);
 const { token, user } = response.data;

 localStorage.setItem("token", token);
 setAuth(user, token);
 setSuccess("Account registered successfully! Welcome aboard.");
 setTimeout(() => {
 router.push("/dashboard");
 }, 1500);
 } catch (err: any) {
 if (!err.response) {
 setError(`Unable to connect to the backend server (${API_URL}). Please verify that your backend server is running and accessible.`);
 } else {
 setError(err.response?.data?.error || "Registration failed. Try using another email.");
 }
 } finally {
 setLoading(false);
 }
 };

 const toggleView = () => {
 setIsRegister(!isRegister);
 setError("");
 setSuccess("");
 };

 return (
 <div className="min-h-screen bg-[#111315] relative flex items-center justify-center p-4 overflow-hidden">
 {/* Background Glowing Orbs for premium look */}
 <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#1abc9c]/10 blur-[120px] pointer-events-none"></div>
 <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>

 <div className="w-full max-w-2xl z-10 transition-all duration-300">
 <div className="text-center mb-8">
 <div className="flex justify-center mb-4">
 <div className="relative group">
 <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#1abc9c] to-blue-600 opacity-75 blur-md group-hover:opacity-100 transition duration-300"></div>
 <div className="relative w-16 h-16 bg-[#1e1f27] rounded-2xl flex items-center justify-center border border-white/10">
 <span className="text-3xl font-extrabold bg-gradient-to-r from-[#1abc9c] to-blue-500 bg-clip-text text-transparent">M</span>
 </div>
 </div>
 </div>
 <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">MedixPro</h1>
 <p className="text-gray-400 font-medium">Next-Gen Intelligent Healthcare CRM</p>
 </div>

 <div className="bg-[#1e1f27] border border-white/[0.08] rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
 {/* Subtle top indicator border */}
 <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#1abc9c] to-blue-600"></div>
 
 <div className="flex justify-between items-center mb-6">
 <h2 className="text-2xl font-bold text-white">
 {isRegister ? "Create Clinical Account" : "Access Portal"}
 </h2>
 <button 
 onClick={toggleView}
 suppressHydrationWarning
 className="text-[#1abc9c] hover:text-[#0d9b7f] font-semibold text-sm flex items-center gap-1 transition-colors"
 >
 {isRegister ? (
 <>
 <LogIn size={16} /> Already registered? Sign In
 </>
 ) : (
 <>
 <PlusCircle size={16} /> Register new user
 </>
 )}
 </button>
 </div>

 {error && (
 <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3 animate-shake">
 <AlertCircle size={20} className="flex-shrink-0" />
 <span>{error}</span>
 </div>
 )}

 {success && (
 <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex items-center gap-3">
 <CheckCircle2 size={20} className="flex-shrink-0" />
 <span>{success}</span>
 </div>
 )}

 {!isRegister ? (
 /* Login Form */
 <form onSubmit={handleLogin} className="space-y-5">
 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
 Email Address
 </label>
 <div className="relative">
 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
 <input
 type="email"
 value={loginEmail}
 onChange={(e) => setLoginEmail(e.target.value)}
 suppressHydrationWarning
 className="w-full bg-[#171b1e] border border-white/[0.08] focus:border-[#1abc9c] rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 outline-none transition-all duration-200"
 placeholder="admin@medixpro.com"
 required
 />
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
 Password
 </label>
 <div className="relative">
 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
 <input
 type={showPassword ? "text" : "password"}
 value={loginPassword}
 onChange={(e) => setLoginPassword(e.target.value)}
 suppressHydrationWarning
 className="w-full bg-[#171b1e] border border-white/[0.08] focus:border-[#1abc9c] rounded-xl pl-10 pr-10 py-3 text-white placeholder-gray-500 outline-none transition-all duration-200"
 placeholder="••••••••"
 required
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 suppressHydrationWarning
 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
 >
 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
 </button>
 </div>
 </div>

 <button
 type="submit"
 disabled={loading}
 suppressHydrationWarning
 className="w-full py-3 bg-[#1abc9c] hover:bg-[#0d9b7f] disabled:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[#1abc9c]/10 flex items-center justify-center gap-2 mt-4"
 >
 {loading ? (
 <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
 ) : (
 <>
 <LogIn size={18} /> Access Dashboard
 </>
 )}
 </button>
 </form>
 ) : (
 /* Register Form */
 <form onSubmit={handleRegister} className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
 Full Name
 </label>
 <div className="relative">
 <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
 <input
 type="text"
 value={regName}
 onChange={(e) => setRegName(e.target.value)}
 suppressHydrationWarning
 className="w-full bg-[#171b1e] border border-white/[0.08] focus:border-[#1abc9c] rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 outline-none transition-all duration-200"
 placeholder="e.g. Dr. Arthur Conan"
 required
 />
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
 Email Address
 </label>
 <div className="relative">
 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
 <input
 type="email"
 value={regEmail}
 onChange={(e) => setRegEmail(e.target.value)}
 suppressHydrationWarning
 className="w-full bg-[#171b1e] border border-white/[0.08] focus:border-[#1abc9c] rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 outline-none transition-all duration-200"
 placeholder="e.g. arthur@medixpro.com"
 required
 />
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
 Create Password
 </label>
 <div className="relative">
 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
 <input
 type={showPassword ? "text" : "password"}
 value={regPassword}
 onChange={(e) => setRegPassword(e.target.value)}
 suppressHydrationWarning
 className="w-full bg-[#171b1e] border border-white/[0.08] focus:border-[#1abc9c] rounded-xl pl-10 pr-10 py-3 text-white placeholder-gray-500 outline-none transition-all duration-200"
 placeholder="••••••••"
 required
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
 >
 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
 </button>
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
 Confirm Password
 </label>
 <div className="relative">
 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
 <input
 type={showPassword ? "text" : "password"}
 value={regConfirmPassword}
 onChange={(e) => setRegConfirmPassword(e.target.value)}
 suppressHydrationWarning
 className="w-full bg-[#171b1e] border border-white/[0.08] focus:border-[#1abc9c] rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 outline-none transition-all duration-200"
 placeholder="••••••••"
 required
 />
 </div>
 </div>
 </div>

 <div>
 <label className="block text-sm font-semibold text-gray-300 mb-3 text-left">
 Assign Department <span className="text-red-500">*</span>
 </label>
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
 {DEPARTMENTS.map((dept) => {
 const Icon = dept.icon;
 const isSelected = selectedDept === dept.id;
 return (
 <div
 key={dept.id}
 onClick={() => setSelectedDept(dept.id)}
 className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-start gap-2 relative ${
 isSelected 
 ? `${dept.color.split(' ')[0]} border-[#1abc9c] bg-[#1abc9c]/10 scale-[1.02] shadow-[#1abc9c]/5 shadow-md`
 : 'border-white/[0.05] bg-[#171b1e] hover:border-[#1abc9c]/40'
 }`}
 >
 <div className="flex items-center justify-between w-full">
 <div className={`p-2 rounded-lg bg-[#1e1f27] border border-white/[0.05] ${isSelected ? 'text-[#1abc9c]' : 'text-gray-400'}`}>
 <Icon size={18} />
 </div>
 {isSelected && (
 <span className="w-4 h-4 bg-[#1abc9c] text-white rounded-full flex items-center justify-center text-[10px] font-bold">
 ✓
 </span>
 )}
 </div>
 <div className="text-left mt-1">
 <div className="font-semibold text-white text-sm">{dept.label}</div>
 <div className="text-[11px] text-gray-400 mt-0.5 line-clamp-1 leading-tight">{dept.desc}</div>
 </div>
 </div>
 );
 })}
 </div>
 </div>

 <button
 type="submit"
 disabled={loading}
 suppressHydrationWarning
 className="w-full py-3 bg-[#1abc9c] hover:bg-[#0d9b7f] disabled:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[#1abc9c]/10 flex items-center justify-center gap-2 mt-4"
 >
 {loading ? (
 <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
 ) : (
 <>
 <PlusCircle size={18} /> Create Clinical Account
 </>
 )}
 </button>
 </form>
 )}

 <div className="mt-6 pt-6 border-t border-white/[0.05] text-center">
 <p className="text-gray-400 text-xs">
 Demo Credentials: <span className="text-[#1abc9c] font-semibold">admin@medixpro.com</span> / <span className="text-[#1abc9c] font-semibold">password123</span>
 </p>
 </div>
 </div>
 </div>
 </div>
 );
}
