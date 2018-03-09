let itemsContainer = document.querySelector('.items-container');

document.addEventListener('DOMContentLoaded', function (event) {
  getData().then(render);
});

function testfunc() {
  // console.log('you added something!');
}

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

let writeData = function(testObj) {
  return firebase.database().ref().push().set({
    title: testObj.title,
    content: testObj.content,
    type: testObj.type
  }).then( function () {

  });
};

let render = function(itemsArr) {
  console.log(itemsArr);
  itemsArr.forEach( function(card, i)  {
    // console.log(card);
    let cardObj = createCard(card);
    itemsContainer.appendChild(cardObj.card);


    cardObj.cta3.addEventListener('click', function(event) {
      cardObj.card.remove();
    });
  })
};

var createElementWithClasses = function(element, classArray) {
  var newElement = document.createElement(element);
  classArray.forEach(function(newClass) {
    newElement.classList.add(newClass);
  });

  return newElement;
}

let createCard = function(itemObj) {
  let cardDiv = createElementWithClasses('div', ['grid-item']);
  let cardWrapperDiv = createElementWithClasses('div', ['card', 'blue-grey', 'darken-1']);
  let cardContentDiv = createElementWithClasses('div', ["card-content", "white-text"]);
  let cardTitle = createElementWithClasses('span', ['card-title']);
  let cardContentInner = document.createElement('ul');
  let cardActionDiv = createElementWithClasses('div', ['card-action']);
  let cardAction1 = document.createElement('a');
  let cardAction2 = document.createElement('a');
  let cardAction3 = document.createElement('a');

  cardContentDiv.appendChild(cardTitle);
  cardContentDiv.appendChild(cardContentInner);
  cardActionDiv.appendChild(cardAction1);
  cardActionDiv.appendChild(cardAction2);
  cardActionDiv.appendChild(cardAction3);
  cardWrapperDiv.appendChild(cardContentDiv);
  cardWrapperDiv.appendChild(cardActionDiv);

  cardTitle.textContent = itemObj.title;
  cardContentInner.textContent = itemObj.content;
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


$(document).ready(function(){
  // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
});



//########################
var divModalContent = document.querySelector('div.modal-content');

var closeModal = document.querySelector('div.modal-footer>a')

var addImageModal = document.querySelector('#add-image');

addImageModal.addEventListener('click', function() {

  var divForm = createImageForm();
  var buttonAdd = createAddBtn();
  var buttonCancel = createCancelBtn();

  buttonAdd.addEventListener('click', function() {
    var imageForm = document.querySelector('form')
    var url = imageForm.imageUrl.value;

    var title = imageForm.addTitle.value;

    var imgObj = {
      type: 'image',
      title: title,
      content: url
    }

    writeData(imgObj).then(testfunc);

    var cardObj = createCard(imgObj);
    var image = document.createElement('img');
    image.setAttribute('src', imgObj.content);
    image.style.maxWidth = '90%';
    image.style.maxHeight = '80%';



    cardObj.card.querySelector('ul').innerHTML = '';
    cardObj.card.querySelector('ul').appendChild(image);

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

///#####################
var addTextModal = document.querySelector('#add-text');

addTextModal.addEventListener('click', function() {

  var divForm = createTextForm();
  var buttonAdd = createAddBtn();
  var buttonCancel = createCancelBtn();

  buttonAdd.addEventListener('click', function() {
    var textForm = document.querySelector('form')
    var text = textForm.addText.value;

    var title = textForm.addTitle.value;


    var textObj = {
      type: 'text',
      title: title,
      content: text
    }

    writeData(textObj).then(testfunc);

    var cardObj = createCard(textObj);

    cardObj.card.querySelector('ul').textContent = text;

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

//#####################

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
