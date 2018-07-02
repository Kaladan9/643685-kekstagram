'use strict';

(function () {

  var Pictures = window.utils.Pictures;
  var load = window.backend.load;
  var showLoadError = window.utils.showLoadError;
  var debounce = window.debounce;

  var picturesContainerElement = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture').content;
  var filtersElement = document.querySelector('.img-filters');
  var buttonFilterPopularElement = filtersElement.querySelector('#filter-popular');
  var buttonFilterNewElement = filtersElement.querySelector('#filter-new');
  var buttonFilterDiscussedElement = filtersElement.querySelector('#filter-discussed');

  function createPicturesId(arr) {
    var idArr = [];
    for (var i = 0; i < arr.length; i++) {
      var index = parseInt(arr[i].url.replace(/\D+/g, ''), 10) - 1;
      idArr.push(index);
    }
    return idArr;
  }

  function getRandomArrValue(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
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

  function renderPictures(pictures, idArr) {
    var similarListElement = picturesContainerElement;
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < pictures.length; i++) {
      fragment.appendChild(createPictureElement(pictures[i], idArr[i]));
    }

    similarListElement.appendChild(fragment);
  }

  function showPictures(pictures) {
    var picturesId = createPicturesId(pictures);
    var pictureContainer = document.querySelector('.pictures');
    renderPictures(pictures, picturesId);
    pictureContainer.classList.remove('hidden');
    filtersElement.classList.remove('img-filters--inactive');
  }

  function removePreviousPictures() {
    while (picturesContainerElement.querySelector('.picture__link')) {
      picturesContainerElement.querySelector('.picture__link').remove();
    }
  }

  function changeActiveElement(evt) {
    var currentButton = evt.target;
    var previousButton = document.querySelector('.img-filters__button--active');

    previousButton.classList.remove('img-filters__button--active');
    currentButton.classList.add('img-filters__button--active');
  }

  function filterPopularElement(evt, pictures, picturesOption) {
    changeActiveElement(evt);
    removePreviousPictures();
    showPictures(pictures, picturesOption);
  }

  function filterRandomPictures(evt, pictures, picturesOption) {
    var copyArr = pictures.slice();
    var newArr = [];

    for (var i = 0; i < 10; i++) {
      var randomElement = getRandomArrValue(copyArr);
      var randomElementIndex = copyArr.indexOf(randomElement);
      newArr.push(randomElement);
      copyArr.splice(randomElementIndex, 1);
    }

    changeActiveElement(evt);
    removePreviousPictures();
    showPictures(newArr, picturesOption);
  }

  function filterDiscussedPictures(evt, pictures, picturesOption) {
    var copyArr = pictures.slice();

    copyArr.sort(function (left, right) {
      return right.comments.length - left.comments.length;
    });

    changeActiveElement(evt);
    removePreviousPictures();
    showPictures(copyArr, picturesOption);
  }

  function onLoad(data) {
    window.pictures = data;
    showPictures(window.pictures, Pictures);
  }

  var showPopularPictures = debounce(function (evt) {
    filterPopularElement(evt, window.pictures, Pictures);
  });

  var showNewPictures = debounce(function (evt) {
    filterRandomPictures(evt, window.pictures, Pictures);
  });

  var showDiscussedPictures = debounce(function (evt) {
    filterDiscussedPictures(evt, window.pictures, Pictures);
  });

  buttonFilterNewElement.addEventListener('click', function (evt) {
    showNewPictures(evt);
  });

  buttonFilterPopularElement.addEventListener('click', function (evt) {
    showPopularPictures(evt);
  });

  buttonFilterDiscussedElement.addEventListener('click', function (evt) {
    showDiscussedPictures(evt);
  });

  load(onLoad, showLoadError);
})();
