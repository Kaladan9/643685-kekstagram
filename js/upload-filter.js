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

  function setNewPinPosition(offset) {
    scaleLevelElement.style.width = offset + 'px';
    sliderPinElement.style.left = offset + 'px';
    setSaturation();
  }

  function getCoords(elem) {
    var box = elem.getBoundingClientRect();

    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset,
      width: box.width
    };
  }

  function onSliderPinMouseDown(evt) {
    evt.preventDefault();

    var pin = evt.target;
    var pinContainer = evt.target.parentElement;

    var pinCoords = getCoords(pin);
    var shiftX = evt.pageX - pinCoords.left;
    var sliderCoords = getCoords(pinContainer);
    var rightBorder = pinContainer.offsetWidth;

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      var leftPosition = moveEvt.pageX - shiftX - sliderCoords.left + pinCoords.width / 2;

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
