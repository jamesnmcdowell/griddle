let itemsContainer = document.querySelector('.items-container');

document.addEventListener('DOMContentLoaded', function (event) {
  //materialize modal setup
  $('.modal').modal();
  //get data from firebase and render on page
  getData().then(render).then(swappable);
  
  
});
//draggable JS library
let swappable = function() {
  new window.Draggable.Sortable(document.querySelectorAll('.items-container'), { draggable: '.card' })
  .on('drag:start', function(event) {
      
  })
  .on('drag:move', function(event) {
    console.log('drag:move')
    console.log(event.data);
      let width = event.data.originalSource.offsetWidth;
      let height = event.data.originalSource.offsetHeight;
      console.log(event.data.mirror.offsetWidth);
                                   
  })
  .on('drag:stop',  () => console.log('drag:stop'));
};

//read data to firebase
let getData = function() {
  let firebaseArr = [];
  let firebaseRef = firebase.database().ref();
  return firebaseRef.once('value').then(function(snapshot) {
    let firebaseObj = snapshot.val();
    for (key in firebaseObj) {
      firebaseObj[key]["id"] = key;
      firebaseArr.push(firebaseObj[key]);
    }
    return firebaseArr;
  })
};

//write data to firebase
let writeData = function(testObj) {
  return firebase.database().ref().push().set({
    title: testObj.title,
    content: testObj.content,
    type: testObj.type
  })
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
  itemsArr.reverse().forEach( function(itemObj, i) {
    let cardObj = load(itemObj);
    itemsContainer.appendChild(cardObj.card);
    cardObj.cta3.addEventListener('click', function(event) {
      cardObj.card.remove();
    });
  })
};

//dummy function for testing promises
function testfunc() {
  console.log('you added something!');
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
  let cardContentDiv = createElementWithClasses('div', ["card-content", "white-text"]);
  let cardTitle = createElementWithClasses('span', ['card-title']);
  let cardActionDiv = createElementWithClasses('div', ['card-action']);
  let cardAction1 = document.createElement('a');
  let cardAction2 = document.createElement('a');
  let cardAction3 = document.createElement('a');

  cardContentDiv.appendChild(cardTitle);
  cardActionDiv.appendChild(cardAction1);
  cardActionDiv.appendChild(cardAction2);
  cardActionDiv.appendChild(cardAction3);
  cardWrapperDiv.appendChild(cardContentDiv);
  cardWrapperDiv.appendChild(cardActionDiv);

  cardTitle.textContent = itemObj.title;
  cardContentDiv.appendChild(itemElem);
  cardAction1.textContent = `Delay`;
  cardAction2.textContent = "Tweet";
  cardAction3.textContent = "Delete";
  cardAction2.addEventListener('click', tweet);

  let cardObj = {
    card: cardWrapperDiv,
    cta1: cardAction1,
    cta2: cardAction2,
    cta3: cardAction3
  };

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
    content: text
  }
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

var addTextModal = document.querySelector('#add-text');

//########### ADD TEXT MODAL ######################

addTextModal.addEventListener('click', function() {

  var divForm = createTextForm();
  var divButtons = createButtons('text', divForm, null)

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
    content: url
  }
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
  var divButtons = createButtons('image', divForm, null);
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
  submitButton.textContent = 'Add';
  submitButton.className = 'cancel-submit-btn'
  return submitButton;
}

var createCancelBtn = function() {
  var cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.className = 'cancel-submit-btn';
  return cancelButton;
}


var placeFirst = function(element) {
  var firstCard = itemsContainer.querySelector('div')
  itemsContainer.insertBefore(element, firstCard)
}

//##### ADD LIST MODAL #################################

var addListModal = document.querySelector('#add-list');

addListModal.addEventListener('click', function() {
  var arrDOMElements = []

  var divWrapper = document.createElement('div');
  var divForm = document.createElement('div');
  divForm.className = "list-form";

  var ul = document.createElement('ul')
  ul.className = 'bulletpoints';
  appendInputLi(ul, arrDOMElements);

  var titleInput = createTitleInput();

  divForm.appendChild(titleInput);
  divForm.appendChild(ul);

  var divButtons = createButtons('list', divWrapper, arrDOMElements);
  divWrapper.appendChild(divForm);
  divWrapper.appendChild(divButtons);
  divModalContent.appendChild(divWrapper);


  divForm.addEventListener('keydown', function(e) {
    if(e.keyCode === 13 && e.target.className === 'title-input') {
      bullet.focus();
    }
    if(e.keyCode === 13 && e.target.className === 'bullet-point') {
      e.preventDefault();
      appendInputLi(ul, arrDOMElements);
    }
  })
})

var appendInputLi = function(ul, arrOfElements) {
  var li = document.createElement('li');
  var newBullet = createBulletInput();
  li.appendChild(newBullet)
  ul.appendChild(li);
  newBullet.focus();
  arrOfElements.push(newBullet);
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


var createListObj = function(arrDOMElements) {
  var titleInput = document.querySelector('div.list-form>input');
  var listContents = [];
  for (var i = 0; i < arrDOMElements.length; i ++) {
    listContents.push(arrDOMElements[i].value)
  }
  var listObj = {
    type: "list",
    title: titleInput.value,
    content: listContents
  }
  return listObj;
}

var createButtons = function(objType, divToDelete, arrDOMElements ) {

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
      someObj = createListObj(arrDOMElements);
    } else 
    if (objType === 'image') {
      someObj = createImgObj();
    } else { 
      console.log('check object type!! createButtons function')
      return
    }

    writeData(someObj).then(testfunc);
    var cardObj = load(someObj);
    placeFirst(cardObj.card);
    deleteElement(divToDelete);
    closeModal.click();
  })

  buttonCancel.addEventListener('click', function(){
    deleteElement(divToDelete);
  })
  return divButtons;
}

//##################### SPEECH TO TEXT MODAL #######################

var speechModal = document.querySelector('#speech');

speechModal.addEventListener('click', function() {
  var divForm = createSpeechForm();
  var divButtons = createButtons('text', divForm, null)

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
      deleteElement(divForm);
    },
    'start over': function() {
      speechTextArea.textContent = '';
    }
  }
  // annyang.init(commands, true)

  annyang.start()

  annyang.addCommands(commands)

  annyang.addCallback('result', function(phrases) {
    if (phrases[0] !== ' and' && phrases[0] !== ' end') {
      speechTextArea.textContent += phrases[0];
    }
    // speechTextArea.textContent += phrases[0];
  })
})


var initRecognition = function() {
var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 5;
return recognition;
}

var createSpeechForm = function() {
  var divForm = document.createElement('div');
  divForm.className = 'div-form';
  var textForm = document.createElement('form');

  var textArea = document.createElement('textarea');
  textArea.setAttribute('id', 'speech-form');
  textArea.setAttribute('name', 'addText');
  textArea.setAttribute('placeholder', 'Say something...')
  textArea.className = 'speech-form';

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