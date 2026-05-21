export type LikertScale = 1 | 2 | 3 | 4 | 5;

export interface Question {
  id: string;
  text: string;
  instrument: 'IPIP-NEO' | 'ECR-R' | 'DARK-TRIAD' | 'TEIQue' | 'BRIEF-COPE' | 'NFC' | 'DEALBREAKER';
  dimension: string;
  facet?: string;
  reversed?: boolean;
}

export interface DealbreakQuestion {
  id: string;
  text: string;
  instrument: 'DEALBREAKER';
  dimension: string;
  options: string[];
}
