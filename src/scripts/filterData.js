export const filterData = [
  { name: 'Этапы', filters: [
    { name: 'старославянский', index: [2, 5] },
    { name: 'церковнославянский в XI–XVII в.', index: [2, 3, 7], groups: [
      { name: 'национальные версии', filters: [
        { name: 'древнерусский', index: [4, 5, 6, 7] },
        { name: 'древнеболгарский', index: [1, 2, 3, 4] },
        { name: 'старобеларусский', index: [1, 2] },
      ]}
    ]},
    { name: 'Новое время', index: [1, 5, 6, 7] },
  ]},

  { name: 'Инструменты', filters: [
    { name: 'программы', index: [6, 7] },
    { name: 'шрифты', index: [4] },
  ]},
];
