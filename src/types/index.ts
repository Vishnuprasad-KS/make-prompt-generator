export interface FormData {
  prompt: string;
  keywords: string;
  model: string;
  otherDetails: string;
  selectedWebsite: string;
  selectedCollection: string;
}

export interface FormErrors {
  prompt?: string;
  model?: string;
  selectedWebsite?: string;
  selectedCollection?: string;
}

export type NotificationType = 'success' | 'error' | null;

export interface NotificationProps {
  type: NotificationType;
  message: string;
}

export interface Website {
  id: string;
  name: string;
}

export interface Collection {
  id: string;
  name: string;
}