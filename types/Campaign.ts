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
    like: boolean | null; // null = não avaliado ainda, boolean = já avaliado
    comment: string | null; // null = não comentado ainda, string = já comentado
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

export interface AnalysisDetail extends CampaignResult {
  campaignId: number;
  campaignTitle: string;
  detectedBreedingSites: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface AnalysisDetailResponse {
  analysis: AnalysisDetail;
}
