'use strict';

(function () {

  var Effects = window.utils.Effects;

  var imgUploadContainerElement = document.querySelector('.img-upload__overlay');
  var imgUploadPreviewElement = imgUploadContainerElement.querySelector('.img-upload__preview');
  var scaleLevelElement = imgUploadContainerElement.querySelector('.scale__level');
  var sliderPinElement = imgUploadContainerElement.querySelector('.scale__pin');
  var lineElement = imgUploadContainerElement.querySelector('.scale__line');


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

  function getCoords(elem) {
    var box = elem.getBoundingClientRect();

    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };

  }

  function setNewPinPosition(pinCoords) {
    scaleLevelElement.style.width = pinCoords + 'px';
    sliderPinElement.style.left = pinCoords + 'px';
    setSaturation();
  }

  function onSliderPinMouseDown(evt) {
    evt.preventDefault();

    var pinCoords = getCoords(sliderPinElement);
    var shiftX = evt.pageX - pinCoords.left;
    var sliderCoords = getCoords(lineElement);
    var rightBorder = lineElement.offsetWidth;
    var pinWidth = parseInt(getComputedStyle(sliderPinElement).width, 10);

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      var leftPosition = moveEvt.pageX - shiftX - sliderCoords.left + pinWidth / 2;

      if (leftPosition < 0) {
        leftPosition = 0;
      }

      if (leftPosition > rightBorder) {
        leftPosition = rightBorder;
      }

      setNewPinPosition(leftPosition);
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      setSaturation();
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function onLineElementClick(evt) {
    evt.preventDefault();

    var sliderCoords = getCoords(lineElement);
    var leftPosition = evt.pageX - sliderCoords.left;

    setNewPinPosition(leftPosition);
  }

  sliderPinElement.addEventListener('mousedown', onSliderPinMouseDown);
  lineElement.addEventListener('click', onLineElementClick);

})();
