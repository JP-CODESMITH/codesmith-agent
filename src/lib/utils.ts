// Import clsx for conditional CSS class name concatenation
import { clsx, type ClassValue } from 'clsx'

// Merge multiple class values (strings, objects, arrays) into a single className string
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}

// Generate a unique identifier using the browser's crypto.randomUUID API
export function generateId(): string {
  return crypto.randomUUID()
}

// Create a promise that resolves after the specified number of milliseconds
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
