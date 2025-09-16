export interface Campaign {
  id: number;
  title: string;
  description: string;
  resultsNotDisplayed: number;
  isActive: boolean;
}

export interface CampaignsResponse {
  campaigns: Campaign[];
}
