import { filterData } from '../../.temp/refs/filterData.js';
import ko from 'knockout';

class FilterGroup {
  constructor(data) {
    this.name = data.name;
    this.items = data.items.map(item => new Filter(item));
  }
}

class Filter {
  constructor(data) {
    this.name = data.name;
    this.index = data.index;
    this.checked = ko.observable(false);
    this.items = this.getItems(data);
  }
  toggle(filter) {
    filter.checked(!filter.checked());
  }
  getItems(data) {
    if (!data.items) return [];
    return data.items.map(item => {
      let Constructor = Filter;
      if (item.items && !item.index) Constructor = FilterGroup;
      return new Constructor(item);
    });
  }
}

Filter.prototype.isGroup = false;
FilterGroup.prototype.isGroup = true;

class FilterCategory {
  constructor(data) {
    this.name = data.name;
    this.items = data.items.map(item => new Filter(item));
  }
}

export const filterCategories = filterData.map(x => new FilterCategory(x));
