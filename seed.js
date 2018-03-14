const mongoose = require('mongoose'),
  Campground = require('./models/campSchema'),
  Comment = require('./models/commentSchema'),
  data = require('./data/seed_data');

function seedDb() {
  Campground.remove({}, err => {
    if (err) {
      console.log(err);
      return;
    }
    //remove camp
    console.log('removed campgrounds');

    Comment.remove({}, err => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('removed Comments');

      data.forEach(seed => {
        Campground.create(seed, (err, newCamp) => {
          if (err) {
            console.log(err);
            return;
          }
          //commentS
          Comment.create(
            {
              text: 'This is the place to Camp',
              author: { id: '5a9a13d5cd256702548e7abc', username: 'ozbo1973' }
            },
            (err, comment) => {
              if (err) {
                console.log(err);
                return;
              }
              newCamp.comments.push(comment);
              newCamp.save();
            }
          );
          //./comment create
        });
        //./camp create
      });
      //./foreach data
      console.log('added stuff');
    });
    //./ comment remove
  });
  //./camp remove
}

module.exports = seedDb;
