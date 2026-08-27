export interface NewConnectionLead {
  id: string;
  leadNo: string;
  applicantName: string;
  phone: string;
  cnic: string;
  address: string;
  branchName: string;
  selectedPackage: string;
  stage: "inquiry" | "feasibility_passed" | "deposit_paid" | "installation_scheduled" | "activated";
  fatBoxNearest: string;
  fatDistanceMeters: number;
  portAvailable: boolean;
  securityDepositPkr: number;
  assignedVan?: string;
  createdAt: string;
}

export const MOCK_NEW_CONNECTIONS: NewConnectionLead[] = [
  {
    id: "lead-01",
    leadNo: "LD-9921",
    applicantName: "Dr. Bilal Qureshi",
    phone: "+92 300 4455667",
    cnic: "37405-9921445-7",
    address: "House 58, Street 4, Sector F-10/3, Islamabad",
    branchName: "Islamabad Core (F-10 HQ)",
    selectedPackage: "50 Mbps Ultra Fiber",
    stage: "installation_scheduled",
    fatBoxNearest: "FAT-F10-18 (Port 2 Available)",
    fatDistanceMeters: 65,
    portAvailable: true,
    securityDepositPkr: 5000,
    assignedVan: "Van #04 (Usman Ali)",
    createdAt: "2026-08-25",
  },
  {
    id: "lead-02",
    leadNo: "LD-9922",
    applicantName: "Hina Tariq",
    phone: "+92 333 1122334",
    cnic: "37405-1122334-8",
    address: "Apartment 302, Silver Heights, F-10 Markaz",
    branchName: "Islamabad Core (F-10 HQ)",
    selectedPackage: "100 Mbps Pro Gamer",
    stage: "feasibility_passed",
    fatBoxNearest: "FAT-F10-09 (Port 4 Available)",
    fatDistanceMeters: 40,
    portAvailable: true,
    securityDepositPkr: 6000,
    createdAt: "2026-08-26",
  },
  {
    id: "lead-03",
    leadNo: "LD-9923",
    applicantName: "Apex Logistics Office",
    phone: "+92 321 8877665",
    cnic: "37405-8877665-9",
    address: "Plaza 12, G-11 Markaz, Islamabad",
    branchName: "Islamabad Core (F-10 HQ)",
    selectedPackage: "1 Gbps Corporate Dedicated",
    stage: "inquiry",
    fatBoxNearest: "FAT-G11-04 (Port 1 Available)",
    fatDistanceMeters: 110,
    portAvailable: true,
    securityDepositPkr: 25000,
    createdAt: "2026-08-27",
  },
];
