'use strict';

(function () {

  var KeyCodes = window.utils.KeyCodes;
  var Effects = window.utils.Effects;
  var Scale = window.utils.Scale;

  var imgUploadInputElement = document.querySelector('#upload-file');
  var imgUploadContainerElement = document.querySelector('.img-upload__overlay');
  var imgUploadCancelElement = imgUploadContainerElement.querySelector('.img-upload__cancel');
  var imgUploadPreviewElement = imgUploadContainerElement.querySelector('.img-upload__preview');
  var effectsListElement = imgUploadContainerElement.querySelector('.effects__list');
  var imgUploadScaleElement = imgUploadContainerElement.querySelector('.img-upload__scale');
  var resizeControlValueElement = imgUploadContainerElement.querySelector('.resize__control--value');
  var resizeControlMinusElement = imgUploadContainerElement.querySelector('.resize__control--minus');
  var resizeControlPlusElement = imgUploadContainerElement.querySelector('.resize__control--plus');
  var scaleLevelElement = imgUploadContainerElement.querySelector('.scale__level');
  var sliderPinElement = imgUploadContainerElement.querySelector('.scale__pin');
  var hashtagsInputElement = imgUploadContainerElement.querySelector('.text__hashtags');
  var descrInputElement = imgUploadContainerElement.querySelector('.text__description');

  function closeImgUploadContainer() {
    imgUploadContainerElement.classList.add('hidden');
    imgUploadInputElement.value = '';
    imgUploadPreviewElement.style.transform = 'scale(1)';
    document.removeEventListener('keydown', onEscPress);
  }

  function onEscPress(evt) {
    if (evt.keyCode === KeyCodes.ESC && evt.target !== hashtagsInputElement && evt.target !== descrInputElement) {
      closeImgUploadContainer();
    }
  }

  function openImgUploadContainer() {
    imgUploadContainerElement.classList.remove('hidden');
    document.addEventListener('keydown', onEscPress);
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
    scaleLevelElement.style.width = '100%';
    sliderPinElement.style.left = '100%';
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

  function setScale(evt, scaleOption) {
    var currentElement = evt.target;
    var scaleChange = currentElement.dataset.scale;
    var currentScaleValue = parseInt(resizeControlValueElement.value, 10);

    switch (scaleChange) {
      case scaleOption.DEC:
        currentScaleValue -= scaleOption.STEP * 100;
        break;
      case scaleOption.INC:
        currentScaleValue += scaleOption.STEP * 100;
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

  resizeControlMinusElement.addEventListener('click', function (evt) {
    setScale(evt, Scale);
  });

  resizeControlPlusElement.addEventListener('click', function (evt) {
    setScale(evt, Scale);
  });

})();
