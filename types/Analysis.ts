export interface UserAnalysis {
  id: number;
  campaign?: {
    id: number;
    title: string;
    description: string;
  };
  originalImage: string;
  resultImage: string;
  type: "terreno" | "propriedade";
  feedback?: {
    like: boolean;
    comment: string;
  };
  status: "visualized" | "finished" | "processing" | "failed";
  created_at: number;
}

export interface UserAnalysesResponse {
  results: UserAnalysis[];
}
