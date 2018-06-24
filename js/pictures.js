'use strict';

var Pictures = {
  COMMENTS: [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ],
  DESCRIPTIONS: [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'
  ],
  COUNT: 25,
  MIN_LIKES: 15,
  MAX_LIKES: 200,
  MIN_COMMENTS: 1,
  MAX_COMMENTS: 3,
  MIN_AVATAR_NUM: 1,
  MAX_AVATAR_NUM: 6
};

var KeyCodes = {
  ESC: 27,
  ENTER: 13
};

var picturesContainerElement = document.querySelector('.pictures');
var bigPictureElement = document.querySelector('.big-picture');
var popupCloseElement = bigPictureElement.querySelector('.cancel');

function onPopupEscPress(evt) {
  if (evt.keyCode === KeyCodes.ESC) {
    closePopup();
  }
}

function closePopup() {
  bigPictureElement.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
}

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createCommentsArr(comments, minComments, maxComments) {
  var count = getRandomValue(minComments, maxComments);
  var unusedComments = comments.slice();
  var resArr = [];

  for (var i = 0; i < count; i++) {
    var commentIndex = getRandomValue(0, unusedComments.length - 1);
    resArr.push(unusedComments[commentIndex]);
    unusedComments.splice(commentIndex, 1);
  }
  return resArr;
}

function createPicturesList(pictureOption) {
  var pictures = [];

  for (var i = 0; i < pictureOption.COUNT; i++) {
    pictures.push({
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomValue(pictureOption.MIN_LIKES, pictureOption.MAX_LIKES),
      comments: createCommentsArr(pictureOption.COMMENTS, pictureOption.MIN_COMMENTS, pictureOption.MAX_COMMENTS),
      description: pictureOption.DESCRIPTIONS[getRandomValue(0, pictureOption.DESCRIPTIONS.length - 1)],
      dataAttribute: i
    });
  }
  return pictures;
}

function createPictures(pictures) {
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture__link');
  var pictureElement = pictureTemplate.cloneNode(true);
  var commentsCount = pictures.comments.length;
  var likesCount = pictures.likes;

  pictureElement.querySelector('.picture__img').src = pictures.url;
  pictureElement.querySelector('.picture__img').dataset.index = pictures.dataAttribute;
  pictureElement.querySelector('.picture__stat--likes').textContent = likesCount;
  pictureElement.querySelector('.picture__stat--comments').textContent = commentsCount;

  return pictureElement;
}

function renderPictures(pictures, picturesCount) {
  var similarListElement = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < picturesCount; i++) {
    fragment.appendChild(createPictures(pictures[i]));
  }
  similarListElement.appendChild(fragment);
}

function renderComments(count, comments, picturesOption) {
  var similarListElement = document.querySelector('.social__comments');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < count; i++) {
    var liElement = document.createElement('li');
    liElement.className = 'social__comment';

    var imgElement = document.createElement('img');
    imgElement.className = 'social__picture';
    imgElement.src = 'img/avatar-'
      + getRandomValue(picturesOption.MIN_AVATAR_NUM, picturesOption.MAX_AVATAR_NUM)
      + '.svg';
    imgElement.alt = 'Аватар комментатора фотографии';
    imgElement.width = '35';
    imgElement.height = '35';

    var pElement = document.createElement('p');
    pElement.className = 'social__text';
    pElement.textContent = comments[i];

    liElement.appendChild(imgElement);
    liElement.appendChild(pElement);
    fragment.appendChild(liElement);
  }
  similarListElement.appendChild(fragment);
}

var pictures = createPicturesList(Pictures);

function showPictures(picturesList, picturesOption) {
  var pictureContainer = document.querySelector('.pictures');
  renderPictures(picturesList, picturesOption.COUNT);
  pictureContainer.classList.remove('hidden');
}

function renderPopup(picturesList, picturesOption, evt) {
  var currentElement = evt.target;
  var index = +currentElement.dataset.index;
  var smallPictureElements = picturesContainerElement.querySelectorAll('.picture__img');

  if (currentElement !== smallPictureElements[index]) {
    return;
  }

  var commentsCount = picturesList[index].comments.length;
  var commentsElement = document.querySelector('.social__comments');

  bigPictureElement.querySelector('.big-picture__img > img').src = picturesList[index].url;
  bigPictureElement.querySelector('.likes-count').textContent = picturesList[index].likes;
  bigPictureElement.querySelector('.comments-count').textContent = commentsCount;
  bigPictureElement.querySelector('.social__caption').textContent = picturesList[index].description;

  commentsElement.innerHTML = '';
  renderComments(commentsCount, pictures[index].comments, picturesOption);

  bigPictureElement.classList.remove('hidden');
  bigPictureElement.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPictureElement.querySelector('.social__loadmore').classList.add('visually-hidden');
  document.addEventListener('keydown', onPopupEscPress);
}

showPictures(pictures, Pictures);

picturesContainerElement.addEventListener('click', function (evt) {
  renderPopup(pictures, Pictures, evt);
});

popupCloseElement.addEventListener('click', function () {
  closePopup();
});

// --------------------------------------------------------------- //

var Effects = {
  NONE: 'none',
  CHROME: 'chrome',
  SEPIA: 'sepia',
  MARVIN: 'marvin',
  PHOBOS: 'phobos',
  HEAT: 'heat'
};

var Scale = {
  DEC: 'dec',
  INC: 'inc',
  STEP: 0.25,
  MAX: 100,
  MIN: 25
};

var imgUploadInputElement = document.querySelector('#upload-file');
var imgUploadContainerElement = document.querySelector('.img-upload__overlay');
var imgUploadCancelElement = imgUploadContainerElement.querySelector('.img-upload__cancel');
var sliderPinElement = imgUploadContainerElement.querySelector('.scale__pin');
var imgUploadPreviewElement = imgUploadContainerElement.querySelector('.img-upload__preview');
var effectsListElement = imgUploadContainerElement.querySelector('.effects__list');
var imgUploadScaleElement = imgUploadContainerElement.querySelector('.img-upload__scale');
var lineElement = imgUploadContainerElement.querySelector('.scale__line');
var resizeControlValueElement = imgUploadContainerElement.querySelector('.resize__control--value');
var resizeControlMinusElement = imgUploadContainerElement.querySelector('.resize__control--minus');
var resizeControlPlusElement = imgUploadContainerElement.querySelector('.resize__control--plus');

function closeImgUploadContainer() {
  imgUploadContainerElement.classList.add('hidden');
  imgUploadInputElement.value = '';
  imgUploadPreviewElement.style.transform = 'scale(1)';
  document.removeEventListener('keydown', onUploadEscPress);
}

function onUploadEscPress(evt) {
  if (evt.keyCode === KeyCodes.ESC) {
    closeImgUploadContainer();
  }
}

function openImgUploadContainer() {
  imgUploadContainerElement.classList.remove('hidden');
  document.addEventListener('keydown', onUploadEscPress);
}

imgUploadInputElement.addEventListener('change', function () {
  openImgUploadContainer();
});

imgUploadCancelElement.addEventListener('click', function () {
  closeImgUploadContainer();
});

function resetEffectSettings() {
  imgUploadPreviewElement.classList = '';
  imgUploadPreviewElement.classList.add('img-upload__preview');
  imgUploadScaleElement.classList.add('hidden');
  imgUploadPreviewElement.style.filter = '';
}

resetEffectSettings();

function addEffect(evt) {
  var currentElement = evt.target;

  if (currentElement === effectsListElement) {
    return;
  }

  while (currentElement.parentElement !== effectsListElement) {
    currentElement = currentElement.parentElement;
  }

  resetEffectSettings();

  var currentEffect = currentElement.dataset.effect;

  if (currentEffect !== Effects.NONE) {
    imgUploadScaleElement.classList.remove('hidden');
  }

  imgUploadPreviewElement.classList.add('effects__preview--' + currentEffect);
  imgUploadPreviewElement.dataset.active = currentEffect;
}

function getMultiplierAtPinPosition() {
  var pinOffset = Math.round(sliderPinElement.offsetLeft * 100) / 100;
  var lineWidth = lineElement.getBoundingClientRect().width;

  return Math.round((pinOffset / lineWidth) * 100) / 100;
}

function setSaturation() {
  var filter = imgUploadPreviewElement.dataset.active;
  var multiplier = getMultiplierAtPinPosition();
  var imageFilter;

  switch (filter) {
    case Effects.NONE:
      imageFilter = '';
      break;
    case Effects.CHROME:
      imageFilter = 'grayscale(' + multiplier + ')';
      break;
    case Effects.SEPIA:
      imageFilter = 'sepia(' + multiplier + ')';
      break;
    case Effects.MARVIN:
      imageFilter = 'invert(' + multiplier * 100 + '%)';
      break;
    case Effects.PHOBOS:
      imageFilter = 'blur(' + multiplier * 3 + 'px)';
      break;
    case Effects.HEAT:
      imageFilter = 'brightness(' + (multiplier * 2 + 1) + ')';
      break;
    default:
      imageFilter = '';
      break;
  }

  imgUploadPreviewElement.style.filter = imageFilter;
}

function setScale(evt, scaleOption) {
  var currentElement = evt.target;
  var scaleChange = currentElement.dataset.scale;
  var currentScaleValue = parseInt(resizeControlValueElement.value, 10);

  switch (scaleChange) {
    case scaleOption.DEC:
      currentScaleValue = currentScaleValue - (scaleOption.STEP * 100);
      break;
    case scaleOption.INC:
      currentScaleValue = currentScaleValue + (scaleOption.STEP * 100);
      break;
  }

  if ((currentScaleValue >= scaleOption.MIN) && (currentScaleValue <= scaleOption.MAX)) {
    imgUploadPreviewElement.style.transform = 'scale(' + currentScaleValue / 100 + ')';
    resizeControlValueElement.value = currentScaleValue + '%';
  }
}

effectsListElement.addEventListener('click', function (evt) {
  addEffect(evt);
});

sliderPinElement.addEventListener('mouseup', function () {
  setSaturation();
});

resizeControlMinusElement.addEventListener('click', function (evt) {
  setScale(evt, Scale);
});

resizeControlPlusElement.addEventListener('click', function (evt) {
  setScale(evt, Scale);
});
