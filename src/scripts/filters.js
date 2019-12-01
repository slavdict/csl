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
    this.disabled = this.index.length === 0;
  }
  toggle(self, event) {  // NOTE: KnockoutJS будет использовать toggle как функцию,
    // не привязанную в качестве метода к экземпляру класса, но передаст нужный
    // нам экземпляр в качестве первого аргумента. Поэтому, если передан первый
    // аргумент, то используем его в качестве this, а если нет то сам this.
    self = self || this;
    console.log(self.name, event);
    if (self.disabled) return;
    //self.items.forEach(item => {
    //  if (item.isGroup) item.items.forEach(i => i.toggle());
    //  else item.toggle();
    //});
    self.checked(!self.checked());
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
