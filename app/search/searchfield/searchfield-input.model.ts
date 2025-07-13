import { SearchFilter } from '../models/search-filter.model';
import { SearchResultMessage } from '../search-result/search-result.component';

export class SearchFieldInput {
  searchResultMessage: SearchResultMessage;
  // eslint-disable-next-line
  predefinedSearchFilters?: SearchFilter[] = [];
  // eslint-disable-next-line
  placeHolderText? = 'SEARCHFIELD_INLINE_PLACEHOLDER';

  constructor(input: SearchFieldInput) {
    this.searchResultMessage = input.searchResultMessage;
    if (input.predefinedSearchFilters !== undefined) {
      this.predefinedSearchFilters = input.predefinedSearchFilters;
    }
    if (input.placeHolderText !== undefined) {
      this.placeHolderText = input.placeHolderText;
    }
  }
}
