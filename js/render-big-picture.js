'use strict';

(function () {

  var LOAD_COMMENTS_LIMIT = 5;

  var Pictures = window.utils.Pictures;
  var KeyCodes = window.utils.KeyCodes;

  var getRandomValue = window.utils.getRandomValue;

  var picturesContainerElement = document.querySelector('.pictures');
  var bigPictureElement = document.querySelector('.big-picture');
  var popupCloseElement = bigPictureElement.querySelector('.cancel');
  var commentsElement = document.querySelector('.social__comments');
  var loadMoreCommentsElement = bigPictureElement.querySelector('.social__loadmore');
  var commentsCountElement = bigPictureElement.querySelector('.rendered__comments-count');
  var renderedCommentsCount;
  var remainingComments;

  function cutComments(arr) {
    if (arr.length > LOAD_COMMENTS_LIMIT) {
      loadMoreCommentsElement.classList.remove('visually-hidden');
      return arr.splice(0, LOAD_COMMENTS_LIMIT);
    }

    loadMoreCommentsElement.classList.add('visually-hidden');
    return arr.splice(0, arr.length);
  }

  function renderComments(comments, picturesOption) {
    var fragment = document.createDocumentFragment();

    comments.forEach(function (comment) {
      var commentBlockElement = document.createElement('li');
      commentBlockElement.className = 'social__comment';

      var userAvatarElement = document.createElement('img');
      userAvatarElement.className = 'social__picture';
      userAvatarElement.src = 'img/avatar-'
        + getRandomValue(picturesOption.MIN_AVATAR_NUM, picturesOption.MAX_AVATAR_NUM)
        + '.svg';
      userAvatarElement.alt = 'Аватар комментатора фотографии';
      userAvatarElement.width = '35';
      userAvatarElement.height = '35';

      var commentTextElement = document.createElement('p');
      commentTextElement.className = 'social__text';
      commentTextElement.textContent = comment;

      commentBlockElement.appendChild(userAvatarElement);
      commentBlockElement.appendChild(commentTextElement);
      fragment.appendChild(commentBlockElement);
    });

    commentsElement.appendChild(fragment);
  }

  function setRenderedCommentsCount() {
    renderedCommentsCount = bigPictureElement.querySelectorAll('.social__comment').length;
    commentsCountElement.textContent = renderedCommentsCount + ' из';
  }

  function openPopup(pictures, picturesOption, evt) {
    var currentElement = evt.target;

    while (currentElement.parentElement !== picturesContainerElement) {
      currentElement = currentElement.parentElement;
    }

    if (!currentElement.classList.contains('picture__link')) {
      return;
    }

    var id = parseInt(currentElement.dataset.id, 10) - 1;
    var commentsCount = pictures[id].comments.length;
    remainingComments = pictures[id].comments.slice();

    bigPictureElement.querySelector('.big-picture__img > img').src = pictures[id].url;
    bigPictureElement.querySelector('.likes-count').textContent = pictures[id].likes;
    bigPictureElement.querySelector('.comments-count').textContent = commentsCount;
    bigPictureElement.querySelector('.social__caption').textContent = pictures[id].description;

    bigPictureElement.classList.remove('hidden');
    loadMoreCommentsElement.classList.add('visually-hidden');

    commentsElement.innerHTML = '';

    renderComments(cutComments(remainingComments), picturesOption);
    setRenderedCommentsCount();

    document.addEventListener('keydown', onEscPress);
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

  loadMoreCommentsElement.addEventListener('click', function () {
    renderComments(cutComments(remainingComments), Pictures);
    setRenderedCommentsCount();
  });

  picturesContainerElement.addEventListener('keydown', onImageEnterPress);

  popupCloseElement.addEventListener('click', function () {
    closePopup();
  });

})();
