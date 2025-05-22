export interface FormData {
  prompt: string;
  keywords: string;
  model: string;
  otherDetails: string;
}

export interface FormErrors {
  prompt?: string;
  model?: string;
}

export type NotificationType = 'success' | 'error' | null;

export interface NotificationProps {
  type: NotificationType;
  message: string;
}