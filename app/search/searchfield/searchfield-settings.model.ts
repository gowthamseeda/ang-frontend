export class SearchFieldSettings {
  // eslint-disable-next-line
  searchResultItemClickAction?: SearchResultItemClickAction = 'singleselect';
  // eslint-disable-next-line
  saveSearchQuery? = true;
  // eslint-disable-next-line
  contextId?: string;

  constructor(settings: SearchFieldSettings) {
    if (settings.searchResultItemClickAction !== undefined) {
      this.searchResultItemClickAction = settings.searchResultItemClickAction;
    }
    if (settings.saveSearchQuery !== undefined) {
      this.saveSearchQuery = settings.saveSearchQuery;
    }
    this.contextId = settings.contextId;
  }
}

type SearchResultItemClickAction = 'singleselect' | 'multiselect' | 'routing';
