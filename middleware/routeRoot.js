module.exports = (name, home) => {
  home = home || 'index';
  const r = {
    name: name,
    route: '/' + name,
    home: '/' + home,
    show: '/' + name + '/:id',
    viewShow: name + '/show',
    edit: '/' + name + '/:id' + '/edit',
    viewEdit: name + '/edit',
    update: '/' + name + '/:id'
  };
  return r;
};

// module.exports = (name, home) => {
//   home = home || 'index';
//   return {
//     name: name,
//     root: '/' + name,
//     home: '/' + home
//   };
// };
