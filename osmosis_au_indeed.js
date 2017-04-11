var osmosis = require('osmosis');
var Promise = require('bluebird');

/*
const theListArr = [
  {
    // start === 0
    list: 'https://au.indeed.com/jobs?q=php&l=melbourne&start=',
    num: 10,
    cat: 'php_melbourne'
  },
  {
    list: 'https://au.indeed.com/jobs?q=web&l=melbourne&start=',
    num: 10,
    cat: 'web_melbourne'
  },
  {
    list: 'https://au.indeed.com/jobs?q=javascript&l=melbourne&start=',
    num: 10, // max 10
    cat: 'javascript_melbourne'
  },
  {
    list: 'https://au.indeed.com/jobs?q=IT&l=melbourne&start=',
    num: 10, // max 10
    cat: 'it_melbourne'
  }
];
*/

const theListArr = [
  {
    // start === 0
    list: 'https://au.indeed.com/jobs?q=php&l=melbourne&start=',
    num: 4,
    cat: 'php_melbourne'
  },
  {
    list: 'https://au.indeed.com/jobs?q=web&l=melbourne&start=',
    num: 4,
    cat: 'web_melbourne'
  }
];


function genEachPage(theList, theListLength) {
  const theReturn = [];
  // run every 10 pages
  for(var i=0; i<theListLength; i++) {
    let page = theList + i*10;
    theReturn.push(page);
  }

  return theReturn;
}


function run() {
  return Promise.each(theListArr, (listObj) => {
    return new Promise((resolve, reject) => {
      console.log('====' + listObj.list + '====');
      let jobArr = genEachPage(listObj.list, listObj.num);

      Promise.each(jobArr, (singlePage) => {
        return new Promise((resolve1, reject1) => {
          console.log();
          console.log('~~~~~~' + singlePage + '~~~~~~');

          osmosis
            .get(singlePage)
            .find('.row') // so we actually needs to use find, to find the parent.
            .set({
              'title': '.jobtitle',
              'company': '.company',
              'summary': '.summary'
            })
            .data((data) => {

              console.log(data);
              resolve1();

            }); // end osmosis

        }).delay(1000);
      })
      .then(() => {
        // ..............
        resolve();
      })
      .catch((err) => {
        console.log('--- page array error:' + theList);
        console.error(err);
        reject();
      });

    });

  });

}

// Run
run()
.then(() => {
  console.log('--- all done ---');
  process.exit(0);
})
.catch(err => {
  console.log('--- main error ---');
  console.error(err);
  process.exit(1);
});
