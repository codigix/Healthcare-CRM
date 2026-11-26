import { LayoutDashboard, FileText, BarChart3, Settings, MessageCircle, Video, HeartHandshake, Megaphone, CalendarClock, ThumbsUp, Frown, Gift, Network, PhoneCall, LifeBuoy } from "lucide-react";
import type { NavItem } from "./types";

export const crmMenu: NavItem[] = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        icon: HeartHandshake,
        label: "Patient Engagement",
        href: "/crm/engagement",
        subItems: [
          { label: "Patient Directory", href: "/crm/engagement/directory" },
          { label: "Patient Timeline", href: "/crm/engagement/timeline" },
          { label: "Patient Journey", href: "/crm/engagement/journey" },
          { label: "VIP Patients", href: "/crm/engagement/vip" },
          { label: "International Patients", href: "/crm/engagement/international" },
        ]
      },
      {
        icon: Megaphone,
        label: "Lead & Enquiry Management",
        href: "/crm/leads",
        subItems: [
          { label: "General Enquiries", href: "/crm/leads/enquiries" },
          { label: "Lead Management", href: "/crm/leads/management" },
          { label: "Health Camp Leads", href: "/crm/leads/camp" },
          { label: "Corporate Leads", href: "/crm/leads/corporate" },
          { label: "Referral Leads", href: "/crm/leads/referral" },
          { label: "Lead Conversion", href: "/crm/leads/conversion" },
        ]
      },
      {
        icon: CalendarClock,
        label: "Appointments & Follow-up",
        href: "/crm/appointments",
        subItems: [
          { label: "Follow-up Patients", href: "/crm/appointments/followup" },
          { label: "Missed Appointments", href: "/crm/appointments/missed" },
          { label: "Recall Patients", href: "/crm/appointments/recall" },
          { label: "Appointment Reminders", href: "/crm/appointments/reminders" },
          { label: "Follow-up Calendar", href: "/crm/appointments/calendar" },
        ]
      },
      {
        icon: MessageCircle,
        label: "Communication Center",
        href: "/crm/communication",
        subItems: [
          { label: "SMS Center", href: "/crm/communication/sms" },
          { label: "WhatsApp Center", href: "/crm/communication/whatsapp" },
          { label: "Email Center", href: "/crm/communication/email" },
          { label: "Push Notifications", href: "/crm/communication/push" },
          { label: "Voice Calls", href: "/crm/communication/voice" },
          { label: "Communication History", href: "/crm/communication/history" },
        ]
      },
      {
        icon: ThumbsUp,
        label: "Feedback & Surveys",
        href: "/crm/feedback",
        subItems: [
          { label: "Patient Feedback", href: "/crm/feedback/patient" },
          { label: "Satisfaction Survey", href: "/crm/feedback/satisfaction" },
          { label: "NPS Survey", href: "/crm/feedback/nps" },
          { label: "Doctor Feedback", href: "/crm/feedback/doctor" },
          { label: "Department Feedback", href: "/crm/feedback/department" },
          { label: "Service Rating", href: "/crm/feedback/rating" },
        ]
      },
      {
        icon: Frown,
        label: "Complaints & Grievances",
        href: "/crm/complaints",
        subItems: [
          { label: "Complaint Registration", href: "/crm/complaints/registration" },
          { label: "Complaint Assignment", href: "/crm/complaints/assignment" },
          { label: "Complaint Tracking", href: "/crm/complaints/tracking" },
          { label: "Escalation Management", href: "/crm/complaints/escalation" },
          { label: "Resolution", href: "/crm/complaints/resolution" },
          { label: "Complaint Analytics", href: "/crm/complaints/analytics" },
        ]
      },
      {
        icon: Video,
        label: "Telemedicine",
        href: "/crm/telemedicine",
        subItems: [
          { label: "Video Consultation", href: "/crm/telemedicine/video" },
          { label: "Chat Consultation", href: "/crm/telemedicine/chat" },
          { label: "Telemedicine Schedule", href: "/crm/telemedicine/schedule" },
          { label: "Telemedicine History", href: "/crm/telemedicine/history" },
          { label: "Digital Prescription", href: "/crm/telemedicine/prescription" },
        ]
      },
      {
        icon: Megaphone,
        label: "Marketing & Campaigns",
        href: "/crm/marketing",
        subItems: [
          { label: "Email Campaigns", href: "/crm/marketing/email" },
          { label: "SMS Campaigns", href: "/crm/marketing/sms" },
          { label: "WhatsApp Campaigns", href: "/crm/marketing/whatsapp" },
          { label: "Health Camp Management", href: "/crm/marketing/camp" },
          { label: "Wellness Programs", href: "/crm/marketing/wellness" },
          { label: "Promotional Campaigns", href: "/crm/marketing/promotional" },
        ]
      },
      {
        icon: Gift,
        label: "Loyalty & Membership",
        href: "/crm/loyalty",
        subItems: [
          { label: "Membership Plans", href: "/crm/loyalty/plans" },
          { label: "Loyalty Points", href: "/crm/loyalty/points" },
          { label: "Family Membership", href: "/crm/loyalty/family" },
          { label: "Corporate Membership", href: "/crm/loyalty/corporate" },
          { label: "Wellness Packages", href: "/crm/loyalty/wellness" },
        ]
      },
      {
        icon: Network,
        label: "Referral Management",
        href: "/crm/referrals",
        subItems: [
          { label: "Doctor Referrals", href: "/crm/referrals/doctor" },
          { label: "Patient Referrals", href: "/crm/referrals/patient" },
          { label: "Corporate Referrals", href: "/crm/referrals/corporate" },
          { label: "Referral Rewards", href: "/crm/referrals/rewards" },
          { label: "Referral Analytics", href: "/crm/referrals/analytics" },
        ]
      },
      {
        icon: PhoneCall,
        label: "Call Center",
        href: "/crm/calls",
        subItems: [
          { label: "Call Queue", href: "/crm/calls/queue" },
          { label: "Incoming Calls", href: "/crm/calls/incoming" },
          { label: "Outgoing Calls", href: "/crm/calls/outgoing" },
          { label: "Missed Calls", href: "/crm/calls/missed" },
          { label: "Call Recordings", href: "/crm/calls/recordings" },
          { label: "Call History", href: "/crm/calls/history" },
        ]
      },
      {
        icon: LifeBuoy,
        label: "Patient Support",
        href: "/crm/support",
        subItems: [
          { label: "Help Desk", href: "/crm/support/helpdesk" },
          { label: "FAQs", href: "/crm/support/faqs" },
          { label: "Lost & Found", href: "/crm/support/lost" },
          { label: "Transport Assistance", href: "/crm/support/transport" },
          { label: "International Patient Support", href: "/crm/support/international" },
        ]
      },
      {
        icon: FileText,
        label: "Reports",
        href: "/crm/reports",
        subItems: [
          { label: "CRM Dashboard", href: "/crm/reports/dashboard" },
          { label: "Follow-up Report", href: "/crm/reports/followup" },
          { label: "Feedback Report", href: "/crm/reports/feedback" },
          { label: "Complaint Report", href: "/crm/reports/complaint" },
          { label: "Marketing Report", href: "/crm/reports/marketing" },
          { label: "Referral Report", href: "/crm/reports/referral" },
          { label: "Telemedicine Report", href: "/crm/reports/telemedicine" },
          { label: "Patient Retention Report", href: "/crm/reports/retention" },
        ]
      },
      {
        icon: BarChart3,
        label: "Analytics",
        href: "/crm/analytics",
        subItems: [
          { label: "Patient Satisfaction", href: "/crm/analytics/satisfaction" },
          { label: "Patient Retention", href: "/crm/analytics/retention" },
          { label: "Campaign Analytics", href: "/crm/analytics/campaign" },
          { label: "Communication Analytics", href: "/crm/analytics/communication" },
          { label: "CRM KPIs", href: "/crm/analytics/kpis" },
          { label: "Doctor Ratings", href: "/crm/analytics/ratings" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/crm/settings",
        subItems: [
          { label: "Communication Templates", href: "/crm/settings/templates" },
          { label: "Feedback Templates", href: "/crm/settings/feedback" },
          { label: "Campaign Templates", href: "/crm/settings/campaign" },
          { label: "Reminder Settings", href: "/crm/settings/reminders" },
          { label: "Loyalty Rules", href: "/crm/settings/loyalty" },
        ]
      }
];
