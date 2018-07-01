'use strict';

(function () {

  var Pictures = window.utils.Pictures;
  var load = window.backend.load;
  var showError = window.utils.showError;

  var pictureTemplate = document.querySelector('#picture').content;

  function createPicturesId(picturesCount) {
    var idArr = [];
    for (var i = 0; i < picturesCount; i++) {
      idArr.push(i);
    }
    return idArr;
  }

  function createPictureElement(pictures, idArr) {
    var pictureElement = pictureTemplate.cloneNode(true);
    var commentsCount = pictures.comments.length;
    var likesCount = pictures.likes;

    pictureElement.querySelector('.picture__img').src = pictures.url;
    pictureElement.querySelector('.picture__link').dataset.index = idArr;
    pictureElement.querySelector('.picture__stat--likes').textContent = likesCount;
    pictureElement.querySelector('.picture__stat--comments').textContent = commentsCount;

    return pictureElement;
  }

  function renderPictures(pictures, picturesCount, idArr) {
    var similarListElement = document.querySelector('.pictures');
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < picturesCount; i++) {
      fragment.appendChild(createPictureElement(pictures[i], idArr[i]));
    }

    similarListElement.appendChild(fragment);
  }

  function showPictures(pictures, picturesOption) {
    var picturesId = createPicturesId(Pictures.COUNT);
    var pictureContainer = document.querySelector('.pictures');
    renderPictures(pictures, picturesOption.COUNT, picturesId);
    pictureContainer.classList.remove('hidden');
  }

  function onLoad(data) {
    window.pictures = data;
    showPictures(window.pictures, Pictures);
  }

  load(onLoad, showError);

})();
