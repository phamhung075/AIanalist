export interface ITradingEconomicsNew {
  id?: string;
  title: string;
  content: string;
  time: string;
  link: string;
  timestamp?: number;
}

export interface ProcessedDataPost {
  validItems: Array<ITradingEconomicsNew & { processedTimestamp: number }>;
  totalValidItems?: number;
  lastNewTime?: number;
  lastNewTitle?: string;
}


export interface UpdateProcess {
  lastNewTime?: number;
  lastNewTitle?: string;
}