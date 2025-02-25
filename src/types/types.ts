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

export interface Link {
  _id: string;
  link: string;
  status: string;
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
  pakageLink: Link[];
}

export interface Payment {
  _id: string;
  Amount: number;
  FromNumber: string;
  PaymentDate: string;
  ToNumber: string;
  user: string;
  status?: string;
}

export interface PaymentRequest {
  _id: string;
  type: string;
  number: string;
  confirmNumber: string;
  date: string;
  user: string;
  status: string;
}