export interface Campaign {
  id: number;
  title: string;
  description: string;
  resultsNotDisplayed: number;
  isActive: boolean;
}

export interface CampaignDetail extends Campaign {
  campaignInfos: string[];
  instructionInfos: string[];
  results: CampaignResult[];
}

export interface CampaignResult {
  id: number;
  originalImage: string;
  resultImage: string;
  type: "terreno" | "propriedade";
  feedback: {
    like: boolean;
    comment: string;
  };
  status: "visualized" | "finished" | "processing" | "failed";
  created_at: number;
}

export interface CampaignsResponse {
  campaigns: Campaign[];
}

export interface CampaignDetailResponse {
  campaign: CampaignDetail;
}
