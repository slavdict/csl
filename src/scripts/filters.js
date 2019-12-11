import { filterData } from '../../.temp/refs/filterData.js';
import ko from 'knockout';

var allRefIds = [];

class FilterGroup {
  constructor(data, selectedFilters) {
    this.name = data.name;
    this.items = data.items.map(item => new Filter(item, selectedFilters));
  }
}

class Filter {
  constructor(data, selectedFilters) {
    this.selectedFilters = selectedFilters;
    this.name = data.name;
    this.index = data.index;
    this.checked = ko.observable(false);
    this.items = this.getItems(data);
    this.disabled = this.index.length === 0;

    this.tune();
  }
  tune() {
    this.index.forEach(ref => {
      if (allRefIds.indexOf(ref) < 0) allRefIds.push(ref);
    });
  }
  toggle(self) { // toggle(self, event)
    // NOTE: KnockoutJS будет использовать toggle
    // как функцию, не привязанную в качестве метода к экземпляру класса, но
    // передаст нужный нам экземпляр в качестве первого аргумента. Поэтому,
    // если передан первый аргумент, то используем его в качестве this, а если
    // нет то сам this.
    self = self || this;
    if (self.disabled) return;
    let value = !self.checked();
    self.checked(value);
    self.selectedFilters[value ? 'push' : 'remove'](self);
  }
  getItems(data) {
    if (!data.items) return [];
    let self = this;
    return data.items.map(item => {
      let Constructor = Filter;
      if (item.items && !item.index) Constructor = FilterGroup;
      return new Constructor(item, self.selectedFilters);
    });
  }
}

Filter.prototype.isGroup = false;
FilterGroup.prototype.isGroup = true;

class FilterCategory {
  constructor(data) {
    this.name = data.name;
    this.selectedFilters = ko.observableArray([]);
    this.items = data.items.map(item => new Filter(item, this.selectedFilters));
  }
}

const filterCategories = filterData.map(x => new FilterCategory(x));

export { allRefIds, filterCategories };
