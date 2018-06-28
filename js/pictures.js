'use strict';
// pictures.js

(function () {

  var Pictures = window.utils.Pictures;
  var KeyCodes = window.utils.KeyCodes;

  var picturesContainerElement = document.querySelector('.pictures');
  var bigPictureElement = document.querySelector('.big-picture');
  var popupCloseElement = bigPictureElement.querySelector('.cancel');

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
      .content;

    var pictureElement = pictureTemplate.cloneNode(true);
    var commentsCount = pictures.comments.length;
    var likesCount = pictures.likes;

    pictureElement.querySelector('.picture__img').src = pictures.url;
    pictureElement.querySelector('.picture__link').dataset.index = pictures.dataAttribute;
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
    var smallPictureElements = picturesContainerElement.querySelectorAll('.picture__link');

    while (currentElement.parentElement !== picturesContainerElement) {
      currentElement = currentElement.parentElement;
    }

    var index = +currentElement.dataset.index;

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
    document.addEventListener('keydown', onEscPress);
  }

  function closePopup() {
    bigPictureElement.classList.add('hidden');
    document.removeEventListener('keydown', onEscPress);
  }

  function onEscPress(evt) {
    if (evt.keyCode === KeyCodes.ESC) {
      closePopup();
    }
  }

  function onImageEnterPress(evt) {
    if (evt.keyCode === KeyCodes.ENTER) {
      renderPopup(pictures, Pictures, evt);
    }
  }

  showPictures(pictures, Pictures);

  picturesContainerElement.addEventListener('click', function (evt) {
    renderPopup(pictures, Pictures, evt);
  });

  picturesContainerElement.addEventListener('keydown', function (evt) {
    onImageEnterPress(evt);
  });

  popupCloseElement.addEventListener('click', function () {
    closePopup();
  });

})();
