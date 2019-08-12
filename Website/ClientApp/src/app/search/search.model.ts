import { DocumentIndex } from '../core/markdown/markdown.service';

export interface SearchResult {
  category: string;
  docs: DocumentIndex[];
  count: number;
}
