module.exports = (name, home) => {
  home = home || 'index';
  return {
    name: name,
    route: '/' + name,
    home: '/' + home
  };
};

// module.exports = (name, home) => {
//   home = home || 'index';
//   return {
//     name: name,
//     root: '/' + name,
//     home: '/' + home
//   };
// };
