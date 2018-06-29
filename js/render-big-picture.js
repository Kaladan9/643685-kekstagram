'use strict';

(function () {
  var picturesList = window.pictures;
  var Pictures = window.utils.Pictures;
  var KeyCodes = window.utils.KeyCodes;

  var getRandomValue = window.utils.getRandomValue;

  var picturesContainerElement = document.querySelector('.pictures');
  var bigPictureElement = document.querySelector('.big-picture');
  var popupCloseElement = bigPictureElement.querySelector('.cancel');

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

  function openPopup(pictures, picturesOption, evt) {
    var currentElement = evt.target;
    var smallPictureElements = picturesContainerElement.querySelectorAll('.picture__link');

    while (currentElement.parentElement !== picturesContainerElement) {
      currentElement = currentElement.parentElement;
    }

    var index = parseInt(currentElement.dataset.index, 10);

    if (currentElement !== smallPictureElements[index]) {
      return;
    }

    var commentsCount = pictures[index].comments.length;
    var commentsElement = document.querySelector('.social__comments');

    bigPictureElement.querySelector('.big-picture__img > img').src = pictures[index].url;
    bigPictureElement.querySelector('.likes-count').textContent = pictures[index].likes;
    bigPictureElement.querySelector('.comments-count').textContent = commentsCount;
    bigPictureElement.querySelector('.social__caption').textContent = pictures[index].description;

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
      openPopup(picturesList, Pictures, evt);
    }
  }

  picturesContainerElement.addEventListener('click', function (evt) {
    openPopup(picturesList, Pictures, evt);
  });

  picturesContainerElement.addEventListener('keydown', onImageEnterPress);

  popupCloseElement.addEventListener('click', function () {
    closePopup();
  });

})();
