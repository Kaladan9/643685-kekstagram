'use strict';

(function () {

  var Pictures = window.utils.Pictures;

  var pictureTemplate = document.querySelector('#picture').content;

  var getRandomValue = window.utils.getRandomValue;

  function createComments(comments, minComments, maxComments) {
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
        comments: createComments(pictureOption.COMMENTS, pictureOption.MIN_COMMENTS, pictureOption.MAX_COMMENTS),
        description: pictureOption.DESCRIPTIONS[getRandomValue(0, pictureOption.DESCRIPTIONS.length - 1)],
        id: i
      });
    }

    return pictures;
  }

  function createPictureElement(pictures) {
    var pictureElement = pictureTemplate.cloneNode(true);
    var commentsCount = pictures.comments.length;
    var likesCount = pictures.likes;

    pictureElement.querySelector('.picture__img').src = pictures.url;
    pictureElement.querySelector('.picture__link').dataset.index = pictures.id;
    pictureElement.querySelector('.picture__stat--likes').textContent = likesCount;
    pictureElement.querySelector('.picture__stat--comments').textContent = commentsCount;

    return pictureElement;
  }

  function renderPictures(pictures, picturesCount) {
    var similarListElement = document.querySelector('.pictures');
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < picturesCount; i++) {
      fragment.appendChild(createPictureElement(pictures[i]));
    }

    similarListElement.appendChild(fragment);
  }

  function showPictures(pictures, picturesOption) {
    var pictureContainer = document.querySelector('.pictures');
    renderPictures(pictures, picturesOption.COUNT);
    pictureContainer.classList.remove('hidden');
  }

  window.pictures = createPicturesList(Pictures);
  showPictures(window.pictures, Pictures);

})();
