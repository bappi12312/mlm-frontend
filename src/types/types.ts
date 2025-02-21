export interface CoursePakage {
  name: string;
  price: number;
  description: string;
  image: string;
  status?: string;
  category: string;
  createdAt?: Date;
  _id?: string | null;
}

export interface Sale {
  _id: string;
  buyer: string;
  affiliate: string;
  course: string;
  createdAt: string;
  amount: number;
  commission: number;
  user: string;
  __v: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  referalCode?: string;
  referredBy?: string | null;
  earnings?: number;
  directRecruit?: number;
  status: string;
  photo?: string;
  downline?: string[];
  transactions?: string[];
  createdAt: string;
  updatedAt: string;
  isPayForCourse?: boolean;
  isPay: boolean;
  isAffiliate: boolean;
  affiliateBalance: number;
  affiliateSales: [];
  uplines: string[];
}

export interface Payment {
  _id: string;
  Amount: number;
  FromNumber: string;
  PaymentDate: string;
  updatedAt: string;
  createdAt: string;
  ToNumber: string;
  user: string;
  __v: number;
}