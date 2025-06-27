import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString, formatString = 'PPP') {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return format(date, formatString, { locale: ptBR });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; 
  }
}

export function formatCurrency(amount, currency = 'BRL') {
  if (typeof amount !== 'number') {
    return '';
  }
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currency }).format(amount);
}

export function calculateTotalPrice(pricePerAdult, pricePerChild, adults, children, signalPercentage = 0) {
  const adultPrice = (pricePerAdult || 0) * (adults || 0);
  const childPrice = (pricePerChild || 0) * (children || 0);
  const subtotal = adultPrice + childPrice;
  
  if (signalPercentage > 0 && signalPercentage <= 100) {
    const signalAmount = subtotal * (signalPercentage / 100);
    return {
      subtotal: subtotal,
      signalAmount: signalAmount,
      remainingAmount: subtotal - signalAmount,
      isSignalPayment: true
    };
  }
  
  return {
    subtotal: subtotal,
    signalAmount: subtotal, 
    remainingAmount: 0,
    isSignalPayment: false
  };
}

export function generateSlug(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}
