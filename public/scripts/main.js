let itemsContainer = document.querySelector('.items-container');
var displayedThoughts = []; // Global Var 1
var order = 0 // Global Var 2

document.addEventListener('DOMContentLoaded', function (event) {
  //materialize modal setup
  $('.modal').modal();
  //get data from firebase and render on page
  getData().then(render).then(swappable);
  // The Firebase SDK is initialized and available here!
  //

//   firebase.auth().onAuthStateChanged(user => { });
   firebase.database().ref('/path/to/ref').on('value', snapshot => { });
//   firebase.messaging().requestPermission().then(() => { });
//   firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });

  try {
    let app = firebase.app();
    let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
    console.log( `Firebase SDK loaded with ${features.join(', ')}`);
  } catch (e) {
    console.error(e);
    console.log('Error loading the Firebase SDK, check the console.');
  }
});
//draggable JS library
let swappable = function() {
  new window.Draggable.Sortable(document.querySelectorAll('.items-container'), { draggable: '.card', constrainDimensions: 'true', swapAnimation: {
    duration: 200,
    easingFunction: 'ease-in-out',
  }})
  .on('drag:start', function(event) {
    event.data.mirror.style.width = `${event.data.source.offsetWidth}px`;
    event.data.mirror.style.height = `${event.data.source.offsetHeight}px`;
  })
  .on('drag:move', function(event) {
  })
  .on('drag:stop',  () => reOrderThoughts(document.querySelectorAll('.card')));
};

//read data to firebase
let getData = function() {
  let firebaseArr = [];
  let firebaseRef = firebase.database().ref();
  return firebaseRef.once('value').then(function(snapshot) {
    let firebaseObj = snapshot.val();
    for (key in firebaseObj) {
//      firebaseObj[key]["id"] = key;
      firebaseArr.push(firebaseObj[key]);
    }
    orderThoughts(firebaseArr);
    displayedThoughts = firebaseArr.slice();
    order = getOrder()
    return firebaseArr;
  })
};

//write data to firebase
let writeData = function(testObj) {
  let x = firebase.database().ref().push();
  let id = x.getKey();
  let setObj = {
    id: id,
    title: testObj.title,
    content: testObj.content,
    type: testObj.type,
    order: testObj.order,
  };
  let promise = x.set(setObj).then(function() {
    return setObj;
  });
  return promise;
};

//return cardObj with correct type
let load = function(itemObj) {
  let itemDiv;
  if (itemObj.type === "text") {
    itemDiv = createTextElements(itemObj);
  }
  else if (itemObj.type === "image") {
    itemDiv = createImgElements(itemObj);
  }
  else if (itemObj.type === "list") {
    itemDiv = createListElements(itemObj);
  }
  let cardObj = createCard(itemObj, itemDiv);
  return cardObj;
};

//render an array of objects
let render = function(itemsArr) {
  itemsArr.forEach( function(itemObj, i) {
    let cardObj = load(itemObj);
    itemsContainer.appendChild(cardObj.card);
  })
};

var filter = function(object, type, filterThoughts) {
  if (object.type === type) {
    filterThoughts.push(object);
  }
}

//dummy function for testing promises
function testfunc(data) {
  console.log('you added something!');
  var cardObj = load(data);
  placeFirst(cardObj.card);
  deleteDivForm();
  closeModal.click();
}
//Order functions
var getOrder = function() {
  var order = displayedThoughts.length;
  return order;
}

var reOrderThoughts = function(thoughts) {
  var order = 0
  var listOfIds = []
  var cards = document.querySelectorAll('.card');
  cards.forEach(function(card) {
    console.log(card);
    if (card.hasAttribute('aria-grabbed')) {
      var thought = displayedThoughts.find(function(thought) {
      return card.dataset.id === thought.id;
      })
    // console.log(thought.order);
    thought.order = order;
    //Updating Order in Firebase
    var db = firebase.database();
    db.ref(thought.id + '/order').set(String(order));
    listOfIds.push(thought.id);
    console.log(listOfIds);
    order += 1;
    }
    else if (card.classList.contains('draggable-mirror') || listOfIds.includes(card.dataset.id)) {
      console.log('mirror card');
    } else {
        var thought = displayedThoughts.find(function(thought) {
        return card.dataset.id === thought.id;
        })
      // console.log(thought.order);
      thought.order = order;
      //Updating Order in Firebase
      var db = firebase.database();
      db.ref(thought.id + '/order').set(String(order));
      listOfIds.push(thought.id);
      console.log(listOfIds);
      order += 1;
    }
  });
}

var addDataIdAttribute = function(card, object) {
  card.setAttribute('data-id', object.id );
}

var orderThoughts = function(thoughts) {
  thoughts.sort(function(a, b){
    // console.log(a.order);
    return a.order-b.order
  })
}


//########################
var createElementWithClasses = function(element, classArray) {
  var newElement = document.createElement(element);
  classArray.forEach(function(newClass) {
    newElement.classList.add(newClass);
  });
  return newElement;
}

//create card element
let createCard = function(itemObj, itemElem) {
  let cardDiv = createElementWithClasses('div', ['grid-item']);
  let cardWrapperDiv = createElementWithClasses('div', ['card']);
  let cardContentDiv = createElementWithClasses('div', ["card-content"]);
  let cardTitle = createElementWithClasses('span', ['card-title']);
  let cardActionDiv = createElementWithClasses('div', ['card-action']);
  addDataIdAttribute(cardWrapperDiv, itemObj);
  let cardAction1 = document.createElement('a');
  let cardAction2 = document.createElement('a');
  let cardAction3 = document.createElement('a');
  let cardAction4 = document.createElement('a');

  cardContentDiv.appendChild(cardTitle);
  cardActionDiv.appendChild(cardAction1);
  cardActionDiv.appendChild(cardAction2);
  cardActionDiv.appendChild(cardAction3);
  cardActionDiv.appendChild(cardAction4);
  cardWrapperDiv.appendChild(cardContentDiv);
  cardWrapperDiv.appendChild(cardActionDiv);

  cardTitle.textContent = itemObj.title;
  cardContentDiv.appendChild(itemElem);
  cardAction1.textContent = `Edit`;
  // cardAction1.setAttribute('href', '#modal1');
  // cardAction1.className = 'modal-trigger'
  cardAction2.textContent = "Tweet";
  cardAction3.textContent = "Delete";
  cardAction4.textContent = 'FBpost'
  cardAction2.addEventListener('click', tweet);

  let cardObj = {
    card: cardWrapperDiv,
    cta1: cardAction1,
    cta2: cardAction2,
    cta3: cardAction3,
    cta4: cardAction4
  };

  cardObj.cta1.addEventListener('click', function(e) {
    editData(itemObj, cardObj);
  });

  cardObj.cta3.addEventListener('mousedown', function(event) {
    event.preventDefault();
    deleteData(itemObj.id);
    cardObj.card.remove();
  });

  cardObj.cta4.addEventListener('click', function(event) {
    if (itemObj.type === 'text') {
      postOnFB(itemObj.content, event);
    }
  })

  return cardObj;
};

///#####################

//create text form
var createTextForm = function() {
  var divForm = document.createElement('div');
  divForm.className = 'div-form';
  var textForm = document.createElement('form');

  var textArea = document.createElement('textarea');
  textArea.setAttribute('id', 'text-form');
  textArea.setAttribute('name', 'addText');
  textArea.setAttribute('placeholder', 'Type some text...')
  textArea.className = 'text-form';
  textArea.classList.add('materialize-textarea');

  var titleArea = createTitleInput()

  textForm.appendChild(titleArea);
  textForm.appendChild(textArea);
  divForm.appendChild(textForm);

  return divForm;
}
//create object specifically for text items
let createTextObj = function() {
  var textForm = document.querySelector('form')
  var text = textForm.addText.value;
  var title = textForm.addTitle.value;
  var textObj = {
    type: 'text',
    title: title,
    content: text,
    order: getOrder(),
  }
  order += 1;
  displayedThoughts.push(textObj);
  return textObj;
}

//create element specifically for text items
let createTextElements = function(textObj) {
  var containerDiv = document.createElement('div');
  var p = document.createElement('p');
  p.textContent = textObj.content;
  containerDiv.appendChild(p);
  return containerDiv;
}

var renderFilter = function(event) {
  var filterThoughts = [];
  var type = event.target.getAttribute('data-filter-type');
  if (type === 'reset') {
    itemsContainer.querySelectorAll(':scope > div').forEach(e => e.remove());
    render(displayedThoughts);
  } else {
      displayedThoughts.forEach(function(element) {
      filter(element, type, filterThoughts);
    })
    itemsContainer.querySelectorAll(':scope > div').forEach(e => e.remove());
    render(filterThoughts.reverse());
  }
}

//Selectors for filters
var textFilterButton = document.querySelector('body > div.filter-wrapper > div > a:nth-child(2) > i');
textFilterButton.addEventListener('click', function() {
  renderFilter(event);
});
var imgFilterButton = document.querySelector('body > div.filter-wrapper > div > a:nth-child(3) > i');
imgFilterButton.addEventListener('click', function() {
  renderFilter(event);
});

var listFilterButton = document.querySelector('body > div.filter-wrapper > div > a:nth-child(5) > i');
listFilterButton.addEventListener('click', function() {
  renderFilter(event);
});
var restoreFilterButton = document.querySelector('body > div.filter-wrapper > div > a:nth-child(6) > i');
restoreFilterButton.addEventListener('click', function() {
  renderFilter(event);
});


var addTextModal = document.querySelector('#add-text');

//########### ADD TEXT MODAL ######################

addTextModal.addEventListener('click', function() {

  var divForm = createTextForm();
  var divButtons = createButtons('text', divForm)

  divForm.appendChild(divButtons);
  divModalContent.appendChild(divForm);
})

//create object specifically for image items
let createImgObj = function() {
  var imageForm = document.querySelector('form')
  var url = imageForm.imageUrl.value;
  var title = imageForm.addTitle.value;
  var imgObj = {
    type: 'image',
    title: title,
    content: url,
    order: getOrder(),
  }
  order += 1;
  displayedThoughts.push(imgObj);

  return imgObj;
}

//create element specifically for image items
let createImgElements = function(imgObj) {
  var containerDiv = document.createElement('div');
  var image = document.createElement('img');
  image.setAttribute('src', imgObj.content);
//  image.style.maxWidth = '90%';
//  image.style.maxHeight = '80%';
  containerDiv.appendChild(image);
  return containerDiv;
}

var divModalContent = document.querySelector('div.modal-content');
var closeModal = document.querySelector('div.modal-footer>a')
var addImageModal = document.querySelector('#add-image');

//############### ADD IMG MODAL ##############################

addImageModal.addEventListener('click', function() {

  var divForm = createImageForm();
  var divButtons = createButtons('image', divForm);
  divForm.appendChild(divButtons);
  divModalContent.appendChild(divForm);
})

var createImageForm = function() {
  var divForm = createElementWithClasses('div', ['div-form']);
  var imageForm = document.createElement('form');

  var input = document.createElement('input');
  input.setAttribute('id', 'url-form');
  input.setAttribute('name', 'imageUrl');
  input.setAttribute('placeholder', 'Enter url here...')
  input.className = 'url-image-form';

  var titleArea = createTitleInput()

  imageForm.appendChild(titleArea);
  imageForm.appendChild(input);
  divForm.appendChild(imageForm);

  return divForm;
}

//######### SOME REUSED FUNCTIONS ########################

var createTitleInput = function() {
  var titleInput = document.createElement('input');
  titleInput.setAttribute('name', 'addTitle');
  titleInput.setAttribute('placeholder', 'Add title...');
  titleInput.className = 'title-input';
  return titleInput;
}

var deleteElement = function(element) {
  element.outerHTML = "";
  delete element;
}

var createAddBtn = function() {
  var submitButton = document.createElement('button');
  submitButton.id = 'add';
  submitButton.textContent = 'Add';
  submitButton.className = 'cancel-submit-btn';
  submitButton.classList.add("waves-light");
  submitButton.classList.add('waves-effect');
  submitButton.classList.add('btn');
  return submitButton;
}

var createCancelBtn = function() {
  var cancelButton = document.createElement('button');
  cancelButton.id = 'cancel';
  cancelButton.textContent = 'Cancel';
  cancelButton.className = 'cancel-submit-btn';
  cancelButton.classList.add('waves-light');
  cancelButton.classList.add('waves-light');
  cancelButton.classList.add('waves-effect');
  cancelButton.classList.add('btn');
  return cancelButton;
}


var placeFirst = function(element) {
  var firstCard = itemsContainer.querySelector('div')
  itemsContainer.insertBefore(element, firstCard)
}

//##### ADD LIST MODAL #################################

var addListModal = document.querySelector('#add-list');

addListModal.addEventListener('click', function() {
  var divWrapper = document.createElement('div');
  divWrapper.className = 'div-form';
  var divForm = document.createElement('div');
  divForm.className = "list-form";

  var ul = document.createElement('ul')
  ul.className = 'bulletpoints';
  appendInputLi(ul);

  var titleInput = createTitleInput();

  divForm.appendChild(titleInput);
  divForm.appendChild(ul);

  var divButtons = createButtons('list', divWrapper);
  divWrapper.appendChild(divForm);
  divWrapper.appendChild(divButtons);
  divModalContent.appendChild(divWrapper);


  divForm.addEventListener('keydown', function(e) {
    if(e.keyCode === 13 && e.target.className === 'title-input') {
      bullet.focus();
    }
    if(e.keyCode === 13 && e.target.className === 'bullet-point') {
      e.preventDefault();
      appendInputLi(ul);
    }
  })
})

var appendInputLi = function(ul) {
  var li = document.createElement('li');
  var newBullet = createBulletInput();
  li.appendChild(newBullet)
  ul.appendChild(li);
  newBullet.focus();
}

var createBulletInput = function() {
  var input = document.createElement('input');
  input.setAttribute('name', 'bulletPoint');
  input.setAttribute('placeholder', 'Add...')
  input.className = 'bullet-point';
  return input;
}

var createListElements = function(listObj) {
  var containerDiv = document.createElement('div');
  var ul = document.createElement('ul');
  ul.className = 'bulletpoints card-bullets';
  for (var j = 0; j < listObj.content.length; j ++) {
    if (listObj.content[j] !== '')  {
      var li = document.createElement('li');
      li.textContent = listObj.content[j];
      ul.appendChild(li);
    }
  }
  containerDiv.appendChild(ul);
  return containerDiv;
}


var createListObj = function() {
  var arrDOMElements = document.querySelectorAll('input.bullet-point');
  var titleInput = document.querySelector('div.list-form>input');
  var listContents = [];
  for (var i = 0; i < arrDOMElements.length; i ++) {
    listContents.push(arrDOMElements[i].value)
  }
  var listObj = {
    type: "list",
    title: titleInput.value,
    content: listContents,
    order: getOrder()
  }
  order += 1;
  displayedThoughts.push(listObj);
  return listObj;
}

var createButtons = function(objType, divToDelete ) {

  var divButtons = document.createElement('div');
  divButtons.className = 'buttons';
  var buttonAdd = createAddBtn();
  var buttonCancel = createCancelBtn();
  divButtons.appendChild(buttonAdd);
  divButtons.appendChild(buttonCancel);

  buttonAdd.addEventListener('click', function() {
    var someObj;
    if (objType === 'text') {
      someObj = createTextObj();
    } else
    if (objType === 'list') {
      someObj = createListObj();
    } else
    if (objType === 'image') {
      someObj = createImgObj();
    } else {
      console.log('check object type!! createButtons function')
      return
    }

    writeData(someObj).then(testfunc);

  })

  buttonCancel.addEventListener('click', function(){
    deleteDivForm();
  })
  return divButtons;
}

//##################### SPEECH TO TEXT MODAL #######################

var speechModal = document.querySelector('#speech');

speechModal.addEventListener('click', function() {
  var divForm = createSpeechForm();
  var divButtons = createButtons('text', divForm)

  divForm.appendChild(divButtons);
  divModalContent.appendChild(divForm);

  var speechTextArea = divForm.querySelector('textarea');
  var addButton = divButtons.querySelector('button');
  addButton.textContent = 'End';

  var commands = {
    'end': function() {
      annyang.abort();
      addButton.click();
    },
    'cancel': function() {
      annyang.abort();
      deleteDivForm();
    },
    'start over': function() {
      speechTextArea.textContent = '';
    }
  }
  annyang.start()
  annyang.addCommands(commands)

  annyang.addCallback('result', function(phrases) {
    if (phrases[0] !== ' and' && phrases[0] !== ' end') {
      speechTextArea.textContent += phrases[0];
    }
  })
})

var createSpeechForm = function() {
  var divForm = document.createElement('div');
  divForm.className = 'div-form';
  var textForm = document.createElement('form');

  var textArea = document.createElement('textarea');
  textArea.setAttribute('id', 'speech-form');
  textArea.setAttribute('name', 'addText');
  textArea.setAttribute('placeholder', 'Say something...')
  textArea.className = 'speech-form';
  textArea.classList.add('materialize-textarea');

  var titleArea = createTitleInput()

  var progressBar = createProgressBar();

  textForm.appendChild(titleArea);
  textForm.appendChild(progressBar);
  textForm.appendChild(textArea);
  divForm.appendChild(textForm);

  return divForm;
}

var createProgressBar = function() {
  var progressBar = document.createElement('div');
  progressBar.className = 'progress';
  var indeterminate = document.createElement('div');
  indeterminate.className = 'indeterminate';
  progressBar.appendChild(indeterminate);
  return progressBar;
}

var deleteData = function(objId) {
  firebase.database().ref().child(objId).remove();
  for (i = 0; i < displayedThoughts.length; i++) {
    if (objId === displayedThoughts[i].id) {
      displayedThoughts.splice(i, 1);
    }
  }
}

var deleteAllData = function() {
  firebase.database().ref().set(null);
}

//############## EDITING ###########################
var editData = function(itemObj, cardObj) {
  if (itemObj.type === 'text') {
    editText(itemObj, cardObj);
  } else
  if (itemObj.type === 'image') {
    editImage(itemObj, cardObj);
  } else
  if (itemObj.type === 'list') {
    editList(itemObj, cardObj);
  }
  else ( console.log('smth wrong'))
}

var modalTrigger = document.querySelector('ul.right>li>a.modal-trigger');

var editText = function(itemObj, cardObj) {
  modalTrigger.click();
  addTextModal.click();
  var title = document.querySelector('input.title-input');
  title.value = itemObj.title;
  var text = document.querySelector('textarea');
  text.textContent = itemObj.content
  var buttonAdd = document.querySelector('#add');
  buttonAdd.addEventListener('click', function() {
    deleteData(itemObj.id);
    cardObj.card.remove();
    //add position
  })
}

var editImage = function(itemObj, cardObj) {
  modalTrigger.click();
  addImageModal.click();
  var title = document.querySelector('input.title-input');
  title.value = itemObj.title;
  var urlForm = document.querySelector('#url-form');
  urlForm.value = itemObj.content;
  var buttonAdd = document.querySelector('#add');
  buttonAdd.addEventListener('click', function() {
    deleteData(itemObj.id);
    cardObj.card.remove();
    //add position
  })
}

var editList = function(itemObj, cardObj) {
  modalTrigger.click();
  addListModal.click();
  var title = document.querySelector('input.title-input');
  title.value = itemObj.title;
  var bulletPoint = document.querySelector('input.bullet-point');
  bulletPoint.focus();
  var ul = document.querySelector('div.list-form>ul.bulletpoints')
  for (var i = 0; i < itemObj.content.length; i++) {
    if (itemObj.content[i] !== '') {
      document.activeElement.value = itemObj.content[i];
      appendInputLi(ul);
    }
  }

  var buttonAdd = document.querySelector('#add');
  buttonAdd.addEventListener('click', function() {
    deleteData(itemObj.id);
    cardObj.card.remove();
    console.log('should be deleted')
    //add position
  })
}

var deleteDivForm = function() {
  var divForm = document.querySelector('div.div-form');
  if (divForm) {
    divForm.outerHTML = "";
  }
}
