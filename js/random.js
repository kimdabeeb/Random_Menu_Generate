'use strict';

let mealList = [
  '한식',
  '양식',
  '중식',
  '분식',
  '패스트푸드',
  '카페',
  '베이커리',
  '샐러드',
];

let mealListArr = [];
mealList.forEach(function (item) {
  mealListArr.push(item);
});

let displaySlot = document.querySelector('.menu_slot'); //menu slot
let elem = document.querySelector('.menu_print > h2'); //menu print

let resetNum = 1;
function mealIs() {
  setTimeout(timeFunc, 900);

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  displaySlot.style.display = 'none';
  console.log(shuffle(mealList));

  let mealPick = shuffle(mealList);
  elem.innerHTML = mealPick;

  if (resetNum === 0) {
    elem.style.display = 'block';
  }
}

function reset() {
  elem.style.display = 'none';
  displaySlot.style.display = 'block';

  resetNum = 0;
}
