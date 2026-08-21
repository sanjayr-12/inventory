import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Product, StockStatus } from '@/src/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format numbers in Indian numbering system with Rupee symbol: ₹1,50,000
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format Indian numbers (e.g. 1,500)
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

/**
 * Format ISO date string into readable Indian format
 */
export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Calculate stock health status with Sandalwood warm theme tokens
 */
export function getStockStatus(product: Product): {
  status: StockStatus;
  label: string;
  badgeClass: string;
  dotColor: string;
  icon: string;
} {
  if (product.currentStock <= 0) {
    return {
      status: 'out_of_stock',
      label: 'Out of Stock',
      badgeClass: 'bg-[#fdf0ed] text-[#b9381e] border-[#f8d0c8]',
      dotColor: 'bg-[#d9482b]',
      icon: '🔴',
    };
  }
  if (product.currentStock <= product.lowStockThreshold) {
    return {
      status: 'low_stock',
      label: 'Running Low',
      badgeClass: 'bg-[#fcf3e6] text-[#b45309] border-[#fae2c0]',
      dotColor: 'bg-[#d97706]',
      icon: '🟠',
    };
  }
  if (product.currentStock >= product.lowStockThreshold * 5 && product.totalUnitsSold < product.currentStock * 0.2) {
    return {
      status: 'overstocked',
      label: 'Excess / Slow',
      badgeClass: 'bg-[#f5eef9] text-[#704282] border-[#e7daf0]',
      dotColor: 'bg-[#8e44ad]',
      icon: '🟣',
    };
  }
  return {
    status: 'healthy_stock',
    label: 'In Stock',
    badgeClass: 'bg-[#eef5ee] text-[#2d6a3f] border-[#d2e4d3]',
    dotColor: 'bg-[#2d6a3f]',
    icon: '🟢',
  };
}
