import { filterData } from './filterData.js';
import ko from 'knockout';

class FilterGroup {
  constructor(data) {
    this.name = data.name;
    this.filters = data.filters.map(item => new Filter(item));
  }
}

class Filter {
  constructor(d) {
    this.name = d.name;
    this.index = d.index;
    this.checked = ko.observable(false);
    this.groups = d.groups ? d.groups.map(item => new FilterGroup(item)) : [];
    this.filters = d.filters ? d.filters.map(item => new Filter(item)) : [];
  }
  toggle(filter) {
    filter.checked(!filter.checked());
  }
}

class FilterCategory {
  constructor(data) {
    this.name = data.name;
    this.filters = data.filters.map(item => new Filter(item));
  }
}

export const filterCategories = filterData.map(x => new FilterCategory(x));
