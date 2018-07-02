'use strict';

(function () {

  var Pictures = window.utils.Pictures;
  var KeyCodes = window.utils.KeyCodes;

  var getRandomValue = window.utils.getRandomValue;

  var picturesContainerElement = document.querySelector('.pictures');
  var bigPictureElement = document.querySelector('.big-picture');
  var popupCloseElement = bigPictureElement.querySelector('.cancel');
  var commentsElement = document.querySelector('.social__comments');
  var loadMoreCommentsElement = bigPictureElement.querySelector('.social__loadmore');

  function cutComments(arr) {
    if (arr.length > 5) {
      loadMoreCommentsElement.classList.remove('visually-hidden');
      return arr.splice(0, 5);
    } else {
      loadMoreCommentsElement.classList.add('visually-hidden');
      return arr.splice(0, arr.length);
    }
  }

  function renderComments(comments, picturesOption) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < comments.length; i++) {
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

    commentsElement.appendChild(fragment);
  }

  function openPopup(pictures, picturesOption, evt) {
    var currentElement = evt.target;

    while (currentElement.parentElement !== picturesContainerElement) {
      currentElement = currentElement.parentElement;
    }

    var index = parseInt(currentElement.dataset.index, 10);
    var commentsCount = pictures[index].comments.length;
    var commentsCopy = pictures[index].comments.slice();

    bigPictureElement.querySelector('.big-picture__img > img').src = pictures[index].url;
    bigPictureElement.querySelector('.likes-count').textContent = pictures[index].likes;
    bigPictureElement.querySelector('.comments-count').textContent = commentsCount;
    bigPictureElement.querySelector('.social__caption').textContent = pictures[index].description;

    bigPictureElement.classList.remove('hidden');
    bigPictureElement.querySelector('.social__comment-count').classList.add('visually-hidden');
    loadMoreCommentsElement.classList.add('visually-hidden');

    commentsElement.innerHTML = '';

    renderComments(cutComments(commentsCopy), picturesOption);

    document.addEventListener('keydown', onEscPress);
    loadMoreCommentsElement.addEventListener('click', function () {
      renderComments(cutComments(commentsCopy), picturesOption);
    });
  }

  function closePopup() {
    bigPictureElement.classList.add('hidden');
    commentsElement.innerHTML = '';
    document.removeEventListener('keydown', onEscPress);
  }

  function onEscPress(evt) {
    if (evt.keyCode === KeyCodes.ESC) {
      closePopup();
    }
  }

  function onImageEnterPress(evt) {
    if (evt.keyCode === KeyCodes.ENTER) {
      openPopup(window.pictures, Pictures, evt);
    }
  }

  picturesContainerElement.addEventListener('click', function (evt) {
    openPopup(window.pictures, Pictures, evt);
  });

  picturesContainerElement.addEventListener('keydown', onImageEnterPress);

  popupCloseElement.addEventListener('click', function () {
    closePopup();
  });

})();
