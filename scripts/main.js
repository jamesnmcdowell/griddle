let itemsContainer = document.querySelector('.items-container');

document.addEventListener('DOMContentLoaded', function (event) {
  render(itemsArr);
});

let render = function(itemsArr) {
  itemsArr.forEach( function(card, i)  {
    let cardObj = createCard(card);
    itemsContainer.appendChild(cardObj.card);

    cardObj.cta3.addEventListener('click', function(event) {
      cardObj.card.remove();
    });
  })
};

let createCard = function(itemObj) {
  let cardDiv = document.createElement('div');
  let cardWrapperDiv = document.createElement('div');
  let cardContentDiv = document.createElement('div');
  let cardTitle = document.createElement('span');
  let cardContentInner = document.createElement('ul');
  let cardActionDiv = document.createElement('div');
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

  cardTitle.classList.add("card-title");
  cardActionDiv.classList.add("card-action");
  cardContentDiv.classList.add("card-content");
  cardContentDiv.classList.add("white-text");
  cardWrapperDiv.classList.add("card");
  cardWrapperDiv.classList.add("blue-grey");
  cardWrapperDiv.classList.add("darken-1");
  cardDiv.classList.add("grid-item");

  cardTitle.textContent = itemObj.title;
  cardContentInner.textContent = itemObj.content;
  cardAction1.textContent = `Delay`;
  cardAction2.textContent = "Prioritize";
  cardAction3.textContent = "Delete";

  let cardObj = {
    card: cardWrapperDiv,
    cta1: cardAction1,
    cta2: cardAction2,
    cta3: cardAction3
  };

  return cardObj;
};

let itemsArr = [
  {
    title: "Cool title",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam."
  },
   {
    title: "Cool title",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam."
  },
   {
    title: "Cool title",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam."
  },
   {
    title: "Cool title",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam."
  },
   {
    title: "Cool title",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam."
  },
   {
    title: "Cool title",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam."
  },
   {
    title: "Cool title",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam."
  },
   {
    title: "Cool title",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam."
  },
   {
    title: "Cool title",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam."
  },
  {
    title: "Cool title",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam."
  },
  {
    title: "Cool title",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam."
  },
  {
    title: "Cool title",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam."
  }
];

$(document).ready(function(){
  // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
});



//########################
var divModalContent = document.querySelector('div.modal-content');

var addImageModal = document.querySelector('#add-image');

addImageModal.addEventListener('click', function() {

  var divForm = createImageForm();
  var buttonAdd = createAddBtn();
  var buttonCancel = createCancelBtn();

  buttonAdd.addEventListener('click', function() {
    var imageForm = document.querySelector('form')
    var url = imageForm.imageUrl.value;
    
    var imgObj = {
      type: 'image',
      title: 'Hello world',
      content: url
    }

    
    itemsArr.push(imgObj);
    //render(itemsArr)
    //might not be effective in terms of performance?

    var cardObj = createCard(imgObj);
    var image = document.createElement('img');
    image.setAttribute('src', imgObj.content);
    
   
    cardObj.card.querySelector('ul').innerHTML = '';
    cardObj.card.querySelector('ul').appendChild(image);
    itemsContainer.appendChild(cardObj.card);

    deleteElement(divForm);

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
    
    var textObj = {
      type: 'text',
      title: 'Hello world',
      content: text
    }

    
    itemsArr.push(textObj);
    //render(itemsArr)
    //might not be effective in terms of performance?

    var cardObj = createCard(textObj);
    
    
   
    cardObj.card.querySelector('ul').textContent = text;
    itemsContainer.appendChild(cardObj.card);

    deleteElement(divForm);

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

  textForm.appendChild(input);
  // imageForm.appendChild(label);
  divForm.appendChild(textForm);

  return divForm;
  
}

//######################


var deleteElement = function(element) {
  element.outerHTML = "";
  delete element;
}

var createImageForm = function() {
  var divForm = document.createElement('div');
  divForm.className = 'div-form';
  var imageForm = document.createElement('form');
  
  var input = document.createElement('input');
  input.setAttribute('id', 'url-form');
  input.setAttribute('name', 'imageUrl');
  input.setAttribute('placeholder', 'Enter url here...')
  input.className = 'url-image-form';

  imageForm.appendChild(input);
  // imageForm.appendChild(label);
  divForm.appendChild(imageForm);

  return divForm;
  
}

var createAddBtn = function() {
  var submitButton = document.createElement('button');
  // submitButton.setAttribute('type', 'button');
  submitButton.textContent = 'Add';
  submitButton.className = 'cancel-submit-btn'
  return submitButton;
}

var createCancelBtn = function() {
  var cancelButton = document.createElement('button');
  // cancelButton.setAttribute('type', 'button');
  cancelButton.textContent = 'Cancel';
  cancelButton.className = 'cancel-submit-btn';
  return cancelButton;
}

// var closeModal = function() {
//   var body = document.querySelector('body')
// }

// modals.addEventListener('click', function(e) {
//   if (e.target.id = 'add-img') {

//   }
//   else if (e.target.id = 'add-txt') {
//     createDiv
//     createInputForm
//     add button submit
//     add button cancel
//     append input to div
//     append div to modal 
//     positon fixed


//   }
// })

var addListModal = document.querySelector('#add-list');

addListModal.addEventListener('click', function() {
  var divForm = document.createElement('div');
  divForm.className = "list-form";

  var ul = document.createElement('ul')
  var li = document.createElement('li');

  // var bullet = createImageForm();
  var bullet = createBulletInput();
  li.appendChild(bullet)
  ul.appendChild(li);
  divForm.appendChild(ul);

  var divButtons = document.createElement('div');
  divButtons.className = 'buttons';
  var buttonAdd = createAddBtn();
  var buttonCancel = createCancelBtn();
  divButtons.appendChild(buttonAdd);
  divButtons.appendChild(buttonCancel);
  divModalContent.appendChild(divForm);
  divModalContent.appendChild(divButtons);


  divForm.addEventListener('keydown', function(e) {
    if(e.keyCode === 13) {
      e.preventDefault();
      console.log('enter')
      var li = document.createElement('li');

      var bullet = createBulletInput();
      li.appendChild(bullet)
      ul.appendChild(li);

      // divForm.appendChild(newDiv);
    }
  })


  
})


var createBulletInput = function() {
  
  
  var input = document.createElement('input');
  // input.setAttribute('id', 'bullet-point');
  input.setAttribute('name', 'bulletPoint');
  input.setAttribute('placeholder', 'Add...')
  input.className = 'bullet-point';

  // imageForm.appendChild(input);
  // // imageForm.appendChild(label);
  // divForm.appendChild(imageForm);

  return input;
}