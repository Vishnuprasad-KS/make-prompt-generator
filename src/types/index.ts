export interface FormData {
  prompt: string;
  keywords: string;
  model: string;
  otherDetails: string;
  selectedWebsite: string;
  selectedWebsiteName: string;
  selectedCollection: string;
  selectedCollectionName: string;
  category?: string;
}

export interface FormErrors {
  prompt?: string;
  model?: string;
  selectedWebsite?: string;
  selectedCollection?: string;
  category?: string;
}

export type NotificationType = 'success' | 'error' | null;

export interface NotificationProps {
  type: NotificationType;
  message: string;
}

export interface Website {
  id: string | undefined;
  name: string | undefined;
}

export interface Collection {
  id: string | undefined;
  name: string | undefined;
}

export interface ModelDeployment {
  id: string;
  model: string;
  status: string;
  scale_settings: {
    scale_type: string;
  };
  owner: string;
  created_at: number;
  updated_at: number;
  object: string;
}

export interface ModelDeploymentsResponse {
  data: ModelDeployment[];
  object: string;
}