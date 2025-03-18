import { database, ref, set, push, onValue, orderByChild, equalTo, limitToFirst, get, query } from './firebase.js';

const throwersRef = ref(database, 'throwers');

const $throwerList = $('.throwers');

const renderThrowerList = function(data) {
  const throwerArray = Object.values(data);
  console.log(throwerArray);
  const formattedThrowerArray = throwerArray.map(thrower => {
    return '<li data-timestamp="' + thrower.timestamp +'">' + thrower.name + ' <a href="#" class="editThrower">edit</a> <input type="text" class="newThrowerName hide" placeholder="New Name"></li>';
  }).join('');

  $throwerList.empty().append(formattedThrowerArray);
};

const updateThrowerName = function(throwerTimestamp) {
  onValue(throwersRef, snapshot => {
    const throwersArray = snapshot.val();

    throwersArray.findIndex(thrower => thrower.timestamp === throwerTimestamp);
  }, {
    onlyOnce: true
  });
};

$('.throwers').on('click', '.editThrower', e => {
  e.preventDefault();

  const $parentListItem = $(e.target).closest('li');

  $parentListItem.find('.newThrowerName').removeClass('hide');

  console.log($parentListItem.data('timestamp'));
});

$('.insertThrower').on('submit', e => {
  e.preventDefault();

  const $theInput = $(e.target).find('.throwerName');

  const newThrowersRef = push(throwersRef);
  set(newThrowersRef, {
    name: $theInput.val(),
    active: true,
    timestamp: Date.now()
  });

  $theInput.val('');
});

onValue(throwersRef, snapshot => {
  const data = snapshot.val();
  if (data) {
    renderThrowerList(data);
  } else {
    console.log('List is empty');
  }
});