let itemsContainer = document.querySelector('.items-container');

document.addEventListener('DOMContentLoaded', function (event) {
  //materialize modal setup
  $('.modal').modal();
  //get data from firebase and render on page
  getData().then(render);
});

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
  }).then( function () {
  });
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
  }
  let cardObj = createCard(itemObj, itemDiv);
  return cardObj;
};

//render an array of objects
let render = function(itemsArr) {
  itemsArr.forEach( function(itemObj, i) {
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
  let cardWrapperDiv = createElementWithClasses('div', ['card', 'blue-grey', 'darken-1']);
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

  var input = document.createElement('input');
  input.setAttribute('id', 'text-form');
  input.setAttribute('name', 'addText');
  input.setAttribute('placeholder', 'Type some text...')
  input.className = 'text-form';

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

addTextModal.addEventListener('click', function() {

  var divForm = createTextForm();
  var buttonAdd = createAddBtn();
  var buttonCancel = createCancelBtn();

  buttonAdd.addEventListener('click', function() {
    let textObj = createTextObj();
    writeData(textObj).then(testfunc);
    let textDiv = createImgElements(textObj);
    let cardObj = load(textObj);
  
    placeFirst(cardObj.card);

    deleteElement(divForm);
    closeModal.click();
  })

  buttonCancel.addEventListener('click', function(){
    deleteElement(divForm);
  })
  divForm.appendChild(buttonAdd);
  divForm.appendChild(buttonCancel);
  divModalContent.appendChild(divForm);
})

//######################

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
  image.style.maxWidth = '90%';
  image.style.maxHeight = '80%';
  containerDiv.appendChild(image);
  return containerDiv;
}

var divModalContent = document.querySelector('div.modal-content');
var closeModal = document.querySelector('div.modal-footer>a')
var addImageModal = document.querySelector('#add-image');

addImageModal.addEventListener('click', function() {

  var divForm = createImageForm();
  var buttonAdd = createAddBtn();
  var buttonCancel = createCancelBtn();

  buttonAdd.addEventListener('click', function() {
    let imgObj = createImgObj();
    writeData(imgObj).then(testfunc);
    let cardObj = load(imgObj);
    
    placeFirst(cardObj.card);
    deleteElement(divForm);
    closeModal.click();
  })
  
  buttonCancel.addEventListener('click', function(){
    deleteElement(divForm);
  })
  
  divForm.appendChild(buttonAdd);
  divForm.appendChild(buttonCancel);
  divModalContent.appendChild(divForm);
})

//######################


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

//##### This code needs to be converted to new structure above ########

var addListModal = document.querySelector('#add-list');

addListModal.addEventListener('click', function() {
  var arrDOMElements = []

  var divWrapper = document.createElement('div');
  var divForm = document.createElement('div');
  divForm.className = "list-form";

  var ul = document.createElement('ul')
  ul.className = 'bulletpoints';

  var li = document.createElement('li');
  var bullet = createBulletInput();
  arrDOMElements.push(bullet);

  var titleInput = createTitleInput();

  divForm.appendChild(titleInput);
  li.appendChild(bullet)
  ul.appendChild(li);
  divForm.appendChild(ul);

  var divButtons = document.createElement('div');
  divButtons.className = 'buttons';
  var buttonAdd = createAddBtn();
  var buttonCancel = createCancelBtn();
  divButtons.appendChild(buttonAdd);
  divButtons.appendChild(buttonCancel);

  divWrapper.appendChild(divForm);
  divWrapper.appendChild(divButtons);
  divModalContent.appendChild(divWrapper);


  divForm.addEventListener('keydown', function(e) {
    if(e.keyCode === 13 && e.target.className === 'title-input') {
      bullet.focus();
    }
    if(e.keyCode === 13 && e.target.className === 'bullet-point') {
      console.log(e)
      e.preventDefault();

      var li = document.createElement('li');

      var newBullet = createBulletInput();
      li.appendChild(newBullet)
      ul.appendChild(li);
      newBullet.focus();
      arrDOMElements.push(newBullet);
    }
  })


  buttonAdd.addEventListener('click', function() {
    var listContent = [];
    for (var i = 0; i < arrDOMElements.length; i ++) {
      listContent.push(arrDOMElements[i].value)
    }

    var listObj = {
      type: "list",
      title: titleInput.value,
      content: listContent

    }

    itemsArr.push(listObj);

    var cardObj = createCard(listObj);

    var contentEl = cardObj.card.querySelector('ul');
    contentEl.className = 'bulletpoints card-bullets';

    contentEl.innerHTML = '';
    for (var j = 0; j < listContent.length; j ++) {
      var li = document.createElement('li');
      if (listContent[j] !== '')  {
        li.textContent = listContent[j];
        contentEl.appendChild(li);
      }
    }

    placeFirst(cardObj.card);

    deleteElement(divWrapper);
    closeModal.click();
  })

  buttonCancel.addEventListener('click', function(){
  deleteElement(divWrapper);
  })

})


var createBulletInput = function() {
  var input = document.createElement('input');
  input.setAttribute('name', 'bulletPoint');
  input.setAttribute('placeholder', 'Add...')
  input.className = 'bullet-point';
  return input;
}

var filter = function(type) {

}
