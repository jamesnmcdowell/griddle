let itemsContainer = document.querySelector('.items-container');
var displayedThoughts = []; // Global Var 1
var order = 0 // Global Var 2
 
document.addEventListener('DOMContentLoaded', function (event) {
  //materialize modal setup
  $('.modal').modal();
  $('select').material_select();
  //firebase 
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
  //get data from firebase, render on page, and initiate draggable
  getData().then( (firebaseArr) => {
    for (itemObj of firebaseArr) {
      render(itemObj);
    }
  }).then(draggable);
});

//read data to firebase
let getData = function() {
  let firebaseArr = [];
  let firebaseRef = firebase.database().ref();
  return firebaseRef.once('value').then(function(snapshot) {
    let firebaseObj = snapshot.val();
    for (key in firebaseObj) {
      firebaseArr.push(firebaseObj[key]);
    }
//      orderThoughts(firebaseArr);
    displayedThoughts = firebaseArr.slice();
//    order = getOrder();
    return firebaseArr;
  })
};

//return cardObj with correct type
let defineCardType = function(itemObj) {
  let itemDiv;
  if (itemObj.type === "text") {
    itemDiv = createTextCardElem(itemObj);
  }
  else if (itemObj.type === "image") {
    itemDiv = createImgElements(itemObj);
  }
  else if (itemObj.type === "list") {
    itemDiv = createListElements(itemObj);
  }
  else if (itemObj.type === 'video') {
    itemDiv = createVideoElements(itemObj);
  }
  //creates specific card element type
  let cardElem = createCard(itemObj, itemDiv);
  return cardElem;
};

//render an array of objects
let render = function(itemObj) {
  let cardObj = defineCardType(itemObj);
  itemsContainer.insertBefore(cardObj.card, itemsContainer.childNodes[0]);
//  itemsContainer.appendChild(cardObj.card);
  return cardObj;
};

//write data to firebase
let writeData = function(itemObj) {
  let idGenerate = firebase.database().ref().push();
  let id = idGenerate.getKey();
  let setObj = {
    id: id,
    title: itemObj.title,
    content: itemObj.content,
    type: itemObj.type,
    order: itemObj.order,
  };
  let promise = idGenerate.set(setObj).then(function() {
    return setObj;
  });
  return promise;
};

//draggable JS library
let draggable = function() {
  var container, options, sortable;
  container = document.querySelector('.items-container');
  options = {
    draggable: '.card',
    constrainDimensions: 'true'
  };
  sortable = new Draggable.Sortable(container, options)
  .on('drag:start', function(event) {
    event.data.mirror.style.width = `${event.data.source.offsetWidth}px`;
    event.data.mirror.style.height = `${event.data.source.offsetHeight}px`;
  })
  .on('sortable:stop', function(event) {
//    reOrderThoughts(document.querySelectorAll('.card'))
  });
};

var addDataIdAttribute = function(card, object) {
  card.setAttribute('data-id', object.id );
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
  cardAction2.textContent = "Tweet";
  cardAction3.textContent = "Delete";
  cardAction4.textContent = 'FBpost'
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
  
  cardAction2.addEventListener('click', function(e) {
    if (itemObj.type === 'text') tweet(e);
    else Materialize.toast('Sorry, can only post text', 2000);
  });

  cardObj.cta3.addEventListener('click', function(e) {
    deleteData(itemObj.id);
    cardObj.card.remove();
  });

  cardObj.cta4.addEventListener('click', function(e) {
    if (itemObj.type === 'text') postOnFB(itemObj.content, event);
    else Materialize.toast('Sorry, can only post text', 2000); 
  });

  return cardObj;
};

//######### Reusable Form Elements ########################

var deleteData = function(objId) {
  firebase.database().ref().child(objId).remove();
  for (i = 0; i < displayedThoughts.length; i++) {
    if (objId === displayedThoughts[i].id) {
      displayedThoughts.splice(i, 1);
    }
  }
};

var deleteAllData = function() {
  firebase.database().ref().set(null);
};

var createTitleInput = function() {
  var titleInput = document.createElement('input');
  titleInput.setAttribute('name', 'addTitle');
  titleInput.setAttribute('placeholder', 'Add title...');
  titleInput.className = 'title-input';
  return titleInput;
};

let createTextArea = function() {
  var textArea = document.createElement('textarea');
  textArea.setAttribute('id', 'text-form');
  textArea.setAttribute('name', 'addText');
  textArea.setAttribute('placeholder', 'Type some text...')
  textArea.classList.add('text-form', 'materialize-textarea');
  return textArea;
};

var createAddBtn = function() {
  var submitButton = document.createElement('button');
  submitButton.id = 'add';
  submitButton.textContent = 'Add';
  submitButton.classList.add('cancel-submit-btn','waves-light','waves-effect','btn');
  return submitButton;
};

var createCancelBtn = function() {
  var cancelButton = document.createElement('button');
  cancelButton.id = 'cancel';
  cancelButton.textContent = 'Cancel';
  cancelButton.classList.add('cancel-submit-btn','waves-light','waves-effect','btn');
  return cancelButton;
};

var createFormTemplate = function(formElem) {
  var divForm = document.createElement('div');
  divForm.className = 'div-form';
  var form = document.createElement('form');
  var titleInput = createTitleInput();
  
  form.appendChild(titleInput);
  form.appendChild(formElem);
  let btnObj = createBtnDiv();
  form.appendChild(btnObj.divButtons);
  divForm.appendChild(form);
  let divFormObj = {divForm: divForm, 
                    buttonAdd: btnObj.buttonAdd, 
                    buttonCancel: btnObj.buttonCancel  
                   };
  return divFormObj;
};

let createBtnDiv = function() {
  var divButtons = document.createElement('div');
  divButtons.className = 'buttons';
  var buttonAdd = createAddBtn();
  var buttonCancel = createCancelBtn();
  divButtons.appendChild(buttonAdd);
  divButtons.appendChild(buttonCancel);
  let btnObj = {divButtons: divButtons, 
                buttonAdd: buttonAdd, 
                buttonCancel: buttonCancel 
               };
  return btnObj;
}

let defineObjType = function(objType) {
    var someObj;
    if (objType === 'text') {
      someObj = createTextObj();
    } else
    if (objType === 'list') {
      someObj = createListObj();
    } else
    if (objType === 'image') {
      someObj = createImgObj();
    } else
    if (objType === 'video') {
      someObj = createVideoObj();
    } else {
      console.log('check object type!! createButtons function')
    }
    return someObj;
};

///#####################

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
//  order += 1;
//  displayedThoughts.push(textObj);
  return textObj;
};

//create element specifically for text items
let createTextCardElem = function(textObj) {
  var containerDiv = document.createElement('div');
  var p = document.createElement('p');
  p.textContent = textObj.content;
  containerDiv.appendChild(p);
  return containerDiv;
};

//create text form
var createTextForm = function() { 
  let elem = createTextArea(); 
  return elem;  
};


var divModalContainer = document.querySelector('div.modal-content');
var closeModal = document.querySelector('div.modal-footer>a');
//########### ADD TEXT MODAL ######################
var addTextModal = document.querySelector('#add-text');

addTextModal.addEventListener('click', function() {
  var textElem = createTextForm();
  var divFormObj = createFormTemplate(textElem);
  var objType = 'text';
  divModalContainer.appendChild(divFormObj.divForm);
  
  divFormObj.buttonAdd.addEventListener('click', function() {
    let definedObj = defineObjType(objType);
    writeData(definedObj).then(render);
    deleteDivForm();
    closeModal.click();
  })
  
  divFormObj.buttonCancel.addEventListener('click', function(){
    deleteDivForm();
  })
  
});



///#####################


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
//  order += 1;
//  displayedThoughts.push(imgObj);
  return imgObj;
};

//create element specifically for image items
let createImgElements = function(imgObj) {
  var containerDiv = document.createElement('div');
  var image = document.createElement('img');
  image.setAttribute('src', imgObj.content);
//  image.style.maxWidth = '90%';
//  image.style.maxHeight = '80%';
  containerDiv.appendChild(image);
  return containerDiv;
};

var createImgForm = function() { 
  var input = document.createElement('input');
  input.setAttribute('id', 'url-form');
  input.setAttribute('name', 'imageUrl');
  input.setAttribute('placeholder', 'Enter url here...')
  input.className = 'url-image-form';
  return input;  
};

//########### ADD IMG MODAL ######################
var addImageModal = document.querySelector('#add-image');

addImageModal.addEventListener('click', function() {
  var imgElem = createImgForm();
  var divFormObj = createFormTemplate(imgElem);
  var objType = 'image';
  divModalContainer.appendChild(divFormObj.divForm);
  
  divFormObj.buttonAdd.addEventListener('click', function() {
    let definedObj = defineObjType(objType);
    writeData(definedObj).then(render);
    deleteDivForm();
    closeModal.click();
  })
  
  divFormObj.buttonCancel.addEventListener('click', function(){
    deleteDivForm();
  })
  
});

///#####################

var createListObj = function() {
  var arrDOMElements = document.querySelectorAll('input.bullet-point');
  var titleInput = document.querySelector('.div-form .title-input');
  var listContents = [];
  for (var i = 0; i < arrDOMElements.length; i ++) {
    listContents.push(arrDOMElements[i].value)
  }
  var listObj = {
    type: "list",
    title: titleInput.value,
    content: listContents,
    order: getOrder()
  };
//  order += 1;
//  displayedThoughts.push(listObj);
  return listObj;
};

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
};

var createListForm = function() { 
  var divForm = document.createElement('div');
  divForm.className = "list-form";
  var ul = document.createElement('ul')
  ul.className = 'bulletpoints';
  appendInputLi(ul);
  divForm.appendChild(ul);
  let divFormObj = {
    divForm: divForm,
    ul: ul,
  };
  return divFormObj;  
};

//##### ADD LIST MODAL #################################
var addListModal = document.querySelector('#add-list');

addListModal.addEventListener('click', function() {
  var listFormObj = createListForm();
  var divFormObj = createFormTemplate(listFormObj.divForm);
  var objType = 'list';
  divModalContainer.appendChild(divFormObj.divForm);
  
  divFormObj.buttonAdd.addEventListener('click', function() {
    let definedObj = defineObjType(objType);
    writeData(definedObj).then(render);
    deleteDivForm();
    closeModal.click();
  })
  
  divFormObj.buttonCancel.addEventListener('click', function(){
    deleteDivForm();
  })
  
    listFormObj.divForm.addEventListener('keydown', function(e) {
    if(e.keyCode === 13 && e.target.className === 'title-input') {
      bullet.focus();
    }
    if(e.keyCode === 13 && e.target.className === 'bullet-point') {
      e.preventDefault();
      appendInputLi(listFormObj.ul);
    }
  })
  
});

var appendInputLi = function(ul) {
  var li = document.createElement('li');
  var newBullet = createBulletInput();
  li.appendChild(newBullet)
  ul.appendChild(li);
  newBullet.focus();
};

var createBulletInput = function() {
  var input = document.createElement('input');
  input.setAttribute('name', 'bulletPoint');
  input.setAttribute('placeholder', 'Add...')
  input.className = 'bullet-point';
  return input;
};

//################### 

var createSpeechForm = function() {
  var speechDiv = document.createElement('div');
  var textArea = document.createElement('textarea');
  textArea.setAttribute('id', 'speech-form');
  textArea.setAttribute('name', 'addText');
  textArea.setAttribute('placeholder', 'Say something...')
  textArea.className = 'speech-form';
  textArea.classList.add('materialize-textarea');
  var progressBar = createProgressBar();
  speechDiv.appendChild(progressBar);
  speechDiv.appendChild(textArea);
  let speechObj = {
    divForm: speechDiv,
    textArea: textArea,
  };
  return speechObj; 
};

var createProgressBar = function() {
  var progressBar = document.createElement('div');
  progressBar.className = 'progress';
  var indeterminate = document.createElement('div');
  indeterminate.className = 'indeterminate';
  progressBar.appendChild(indeterminate);
  return progressBar;
};


//########## SPEECH TO TEXT MODAL ##############
var speechModal = document.querySelector('#speech');

speechModal.addEventListener('click', function() {
  var speechObj = createSpeechForm();
  var divFormObj = createFormTemplate(speechObj.divForm);
  var objType = 'text';
  divFormObj.buttonAdd.textContent = 'End';
  
  divModalContainer.appendChild(divFormObj.divForm);
  
  divFormObj.buttonAdd.addEventListener('click', function() {
    let definedObj = defineObjType(objType);
    writeData(definedObj).then(render);
    deleteDivForm();
    closeModal.click();
  })
  
  divFormObj.buttonCancel.addEventListener('click', function(){
    deleteDivForm();
  })
  
  var commands = {
    'end': function() {
      annyang.abort();
      divFormObj.buttonAdd.click();
    },
    'cancel': function() {
      annyang.abort();
      deleteDivForm();
    },
    'start over': function() {
      speechObj.textArea.textContent = '';
    }
  }
  annyang.start()
  annyang.addCommands(commands)

  annyang.addCallback('result', function(phrases) {
    if (phrases[0] !== ' and' && phrases[0] !== ' end') {
      speechObj.textArea.textContent += phrases[0];
    }
  })
});

//###########################

let createVideoObj = function() {
  var videoForm = document.querySelector('form')
  var url = videoForm.videoUrl.value;
  var filePath = parseYoutube(url);
  var embedUrl = `https://www.youtube.com/embed/${filePath}?rel=0`
  var title = videoForm.addTitle.value;
  var videoObj = {
    type: 'video',
    title: title,
    content: embedUrl,
    order: getOrder(),
  }
//  order += 1;
//  displayedThoughts.push(videoObj);
  return videoObj;
};

let createVideoElements = function(videoObj) {
  var containerDiv = document.createElement('div');
  containerDiv.className = 'video-container';
  var iframe = document.createElement('iframe');
  iframe.setAttribute('src', videoObj.content);
  iframe.setAttribute('frameborder', "0");
  iframe.setAttribute('allowfullscreen', '');
  iframe.style.maxWidth = '100%';
  iframe.style.maxHeight = '100%';
  containerDiv.appendChild(iframe);
  return containerDiv;
};

let parseYoutube = function (url) {
  var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[2].length == 11) {
    return match[2];
  } else {
    console('failed to parse youtube video')
  } 
};

var createVideoForm = function() {
  var videoDiv = document.createElement('div');
  var input = document.createElement('input');
  input.setAttribute('id', 'video-form');
  input.setAttribute('name', 'videoUrl');
  input.setAttribute('placeholder', 'Enter url here...')
  input.className = 'url-video-form';
  videoDiv.appendChild(input);
  return  videoDiv;
};

//########## video embed modal ##############
var addVideoModal = document.querySelector('#add-video')

addVideoModal.addEventListener('click', function() {
  var videoElem = createVideoForm();
  var divFormObj = createFormTemplate(videoElem);
  var objType = 'video';
  divModalContainer.appendChild(divFormObj.divForm);
  
  divFormObj.buttonAdd.addEventListener('click', function() {
    let definedObj = defineObjType(objType);
    writeData(definedObj).then(render);
    deleteDivForm();
    closeModal.click();
  })
  
  divFormObj.buttonCancel.addEventListener('click', function(){
    deleteDivForm();
  })
  
});

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
  } else
  if (itemObj.type === 'video') {
    editVideo(itemObj, cardObj);
  }
  else ( console.log('smth wrong'))
};

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
};

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
};

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
};

var editVideo = function(itemObj, cardObj) {
  modalTrigger.click();
  addVideoModal.click();
  var title = document.querySelector('input.title-input');
  title.value = itemObj.title;
  var urlForm = document.querySelector('.url-video-form');
  urlForm.value = itemObj.content;
  var buttonAdd = document.querySelector('#add');
  buttonAdd.addEventListener('click', function() {
    deleteData(itemObj.id);
    cardObj.card.remove();
    //add position
  })
};

var deleteDivForm = function() {
  var divForm = document.querySelector('div.div-form');
  if (divForm) {
    divForm.outerHTML = "";
  }
};

////////////////







//Order functions
//var getOrder = function() {
//  var order = displayedThoughts.length;
//  return order;
//};
//var orderThoughts = function(thoughts) {
//  thoughts.sort(function(a, b){
//    // console.log(a.order);
//    return a.order-b.order
//  })
//};

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
//    console.log(listOfIds);
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
//      console.log(listOfIds);
      order += 1;
    }
  });
};


var renderFilter = function(event) {
  var filterThoughts = [];
  var type = event.target.getAttribute('data-filter-type');
  if (type === 'reset') {
    itemsContainer.querySelectorAll(':scope > div').forEach(e => e.remove());
    for (itemObj of displayedThoughts) {
      render(itemObj);
    }
  } else {
      for (itemObj of displayedThoughts) {
          filter(itemObj, type, filterThoughts);
      }
      itemsContainer.querySelectorAll(':scope > div').forEach(e => e.remove());
      for (itemObj of filterThoughts) {
        render(itemObj);
      }
  }
};

var filter = function(object, type, filterThoughts) {
  if (object.type === type) {
    filterThoughts.push(object);
  }
};

//Selectors for filters
var textFilterButton = document.querySelector('body > div.filter-wrapper > div > a:nth-child(2) > i');
textFilterButton.addEventListener('click', function() {
  renderFilter(event);
});
var imgFilterButton = document.querySelector('body > div.filter-wrapper > div > a:nth-child(3) > i');
imgFilterButton.addEventListener('click', function() {
  renderFilter(event);
});

var videoFilterButton = document.querySelector('body > div.filter-wrapper > div > a:nth-child(4) > i');
videoFilterButton.addEventListener('click', function() {
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