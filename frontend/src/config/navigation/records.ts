import { LayoutDashboard, FileText, BarChart3, Settings, Stethoscope, Shield, FolderOpen, Archive, Code, Award, Bug, Scale, FileStack, Send } from "lucide-react";
import type { NavItem } from "./types";

export const recordsMenu: NavItem[] = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        icon: FolderOpen,
        label: "Medical Records",
        href: "/records/medical",
        subItems: [
          { label: "Patient Medical Records", href: "/records/medical/patient" },
          { label: "OPD Records", href: "/records/medical/opd" },
          { label: "IPD Records", href: "/records/medical/ipd" },
          { label: "Emergency Records", href: "/records/medical/emergency" },
          { label: "Archived Records", href: "/records/medical/archived" },
          { label: "Record Requests", href: "/records/medical/requests" },
          { label: "Record Tracking", href: "/records/medical/tracking" },
        ]
      },
      {
        icon: FileText,
        label: "Clinical Documentation",
        href: "/records/clinical",
        subItems: [
          { label: "Progress Notes", href: "/records/clinical/progress" },
          { label: "Doctor Notes", href: "/records/clinical/doctor" },
          { label: "Nursing Notes", href: "/records/clinical/nursing" },
          { label: "Operative Notes", href: "/records/clinical/operative" },
          { label: "Procedure Notes", href: "/records/clinical/procedure" },
          { label: "Consultation Notes", href: "/records/clinical/consultation" },
          { label: "Discharge Summary", href: "/records/clinical/discharge" },
          { label: "Death Summary", href: "/records/clinical/death" },
        ]
      },
      {
        icon: Archive,
        label: "Health Information Management",
        href: "/records/him",
        subItems: [
          { label: "Record Indexing", href: "/records/him/indexing" },
          { label: "Record Completion", href: "/records/him/completion" },
          { label: "Missing Documents", href: "/records/him/missing" },
          { label: "Incomplete Records", href: "/records/him/incomplete" },
          { label: "Duplicate Record Check", href: "/records/him/duplicate" },
          { label: "Document Scanning", href: "/records/him/scanning" },
          { label: "Digital Archive", href: "/records/him/archive" },
        ]
      },
      {
        icon: Code,
        label: "Medical Coding",
        href: "/records/coding",
        subItems: [
          { label: "ICD-10 Coding", href: "/records/coding/icd10" },
          { label: "ICD-11 Coding", href: "/records/coding/icd11" },
          { label: "CPT Coding", href: "/records/coding/cpt" },
          { label: "Procedure Coding", href: "/records/coding/procedure" },
          { label: "DRG Coding", href: "/records/coding/drg" },
          { label: "Coding Audit", href: "/records/coding/audit" },
        ]
      },
      {
        icon: Stethoscope,
        label: "Clinical Audit",
        href: "/records/audit",
        subItems: [
          { label: "Documentation Audit", href: "/records/audit/documentation" },
          { label: "Case Sheet Audit", href: "/records/audit/case-sheet" },
          { label: "Prescription Audit", href: "/records/audit/prescription" },
          { label: "Mortality Audit", href: "/records/audit/mortality" },
          { label: "Readmission Audit", href: "/records/audit/readmission" },
          { label: "Surgical Audit", href: "/records/audit/surgical" },
        ]
      },
      {
        icon: Award,
        label: "Quality Management",
        href: "/records/quality",
        subItems: [
          { label: "Quality Indicators", href: "/records/quality/indicators" },
          { label: "Patient Safety Indicators", href: "/records/quality/patient-safety" },
          { label: "KPI Dashboard", href: "/records/quality/kpi" },
          { label: "Sentinel Events", href: "/records/quality/sentinel" },
          { label: "Near Miss Events", href: "/records/quality/near-miss" },
          { label: "Root Cause Analysis (RCA)", href: "/records/quality/rca" },
          { label: "CAPA", href: "/records/quality/capa" },
        ]
      },
      {
        icon: Shield,
        label: "NABH / Accreditation",
        href: "/records/accreditation",
        subItems: [
          { label: "NABH Standards", href: "/records/accreditation/nabh" },
          { label: "JCI Standards", href: "/records/accreditation/jci" },
          { label: "Department Checklists", href: "/records/accreditation/checklists" },
          { label: "Policy Management", href: "/records/accreditation/policy" },
          { label: "SOP Management", href: "/records/accreditation/sop" },
          { label: "Accreditation Audit", href: "/records/accreditation/audit" },
          { label: "Compliance Tracking", href: "/records/accreditation/compliance" },
        ]
      },
      {
        icon: Bug,
        label: "Infection Control",
        href: "/records/infection",
        subItems: [
          { label: "HAI Surveillance", href: "/records/infection/hai" },
          { label: "Infection Reporting", href: "/records/infection/reporting" },
          { label: "Antibiotic Stewardship", href: "/records/infection/antibiotic" },
          { label: "Isolation Monitoring", href: "/records/infection/isolation" },
          { label: "Infection Audit", href: "/records/infection/audit" },
          { label: "Infection Trends", href: "/records/infection/trends" },
        ]
      },
      {
        icon: Scale,
        label: "Consent & Legal",
        href: "/records/legal",
        subItems: [
          { label: "Consent Management", href: "/records/legal/consent" },
          { label: "Medico-Legal Cases (MLC)", href: "/records/legal/mlc" },
          { label: "Legal Requests", href: "/records/legal/requests" },
          { label: "Court Cases", href: "/records/legal/court" },
          { label: "Police Requests", href: "/records/legal/police" },
          { label: "Record Release Approval", href: "/records/legal/release" },
        ]
      },
      {
        icon: FileStack,
        label: "Document Management",
        href: "/records/documents",
        subItems: [
          { label: "Patient Documents", href: "/records/documents/patient" },
          { label: "Consent Forms", href: "/records/documents/consent" },
          { label: "Scanned Documents", href: "/records/documents/scanned" },
          { label: "Digital Signatures", href: "/records/documents/signatures" },
          { label: "Document Templates", href: "/records/documents/templates" },
          { label: "Version Control", href: "/records/documents/version" },
        ]
      },
      {
        icon: Send,
        label: "Release of Information (ROI)",
        href: "/records/roi",
        subItems: [
          { label: "Patient Requests", href: "/records/roi/patient" },
          { label: "Insurance Requests", href: "/records/roi/insurance" },
          { label: "Corporate Requests", href: "/records/roi/corporate" },
          { label: "Government Requests", href: "/records/roi/government" },
          { label: "Legal Requests", href: "/records/roi/legal" },
          { label: "Approval Workflow", href: "/records/roi/workflow" },
        ]
      },
      {
        icon: FileText,
        label: "Reports",
        href: "/records/reports",
        subItems: [
          { label: "Medical Record Reports", href: "/records/reports/medical" },
          { label: "Coding Reports", href: "/records/reports/coding" },
          { label: "Audit Reports", href: "/records/reports/audit" },
          { label: "NABH Reports", href: "/records/reports/nabh" },
          { label: "Infection Reports", href: "/records/reports/infection" },
          { label: "Compliance Reports", href: "/records/reports/compliance" },
          { label: "Record Completion Reports", href: "/records/reports/completion" },
        ]
      },
      {
        icon: BarChart3,
        label: "Analytics",
        href: "/records/analytics",
        subItems: [
          { label: "Documentation Analytics", href: "/records/analytics/documentation" },
          { label: "Quality Analytics", href: "/records/analytics/quality" },
          { label: "Infection Analytics", href: "/records/analytics/infection" },
          { label: "Coding Analytics", href: "/records/analytics/coding" },
          { label: "Audit Analytics", href: "/records/analytics/audit" },
          { label: "Compliance Dashboard", href: "/records/analytics/compliance" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/records/settings",
        subItems: [
          { label: "ICD Master", href: "/records/settings/icd" },
          { label: "Document Templates", href: "/records/settings/templates" },
          { label: "Audit Templates", href: "/records/settings/audit" },
          { label: "Quality Indicators", href: "/records/settings/quality" },
          { label: "Compliance Rules", href: "/records/settings/compliance" },
          { label: "Record Retention Policy", href: "/records/settings/retention" },
        ]
      }

];
