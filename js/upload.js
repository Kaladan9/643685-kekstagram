'use strict';

(function () {
  var Scale = {
    DEC: 'dec',
    INC: 'inc',
    STEP: 0.25,
    MAX: 100,
    MIN: 25
  };

  var KeyCodes = window.utils.KeyCodes;
  var Effects = window.utils.Effects;
  var save = window.backend.save;
  var showSendError = window.utils.showSendError;

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
  var userFormElement = document.querySelector('.img-upload__form');
  var submitButtonElement = imgUploadContainerElement.querySelector('.img-upload__submit');
  var messageErrorElement = document.querySelector('.img-upload__message--error');
  var tryAgainLinkElement = messageErrorElement.querySelector('.error__link--again');
  var downloadAnotherFileLinkElement = messageErrorElement.querySelector('.error__link--download');

  function resetEffects() {
    resizeControlValueElement.value = '100%';
    imgUploadPreviewElement.className = '';
    imgUploadPreviewElement.classList.add('img-upload__preview');
    imgUploadScaleElement.classList.add('hidden');
    imgUploadPreviewElement.style.transform = 'scale(1)';
    imgUploadPreviewElement.style.filter = '';
    scaleLevelElement.style.width = '100%';
    sliderPinElement.style.left = '100%';
  }

  function onEscPress(evt) {
    if (evt.keyCode === KeyCodes.ESC && evt.target !== hashtagsInputElement && evt.target !== descrInputElement) {
      closeImgUploadContainer();
    }
  }

  function openImgUploadContainer() {
    resetEffects();
    imgUploadContainerElement.classList.remove('hidden');
    document.addEventListener('keydown', onEscPress);
    userFormElement.addEventListener('submit', onSubmitForm);
  }

  function closeImgUploadContainer() {
    imgUploadContainerElement.classList.add('hidden');
    document.removeEventListener('keydown', onEscPress);
    userFormElement.removeEventListener('submit', onSubmitForm);
    imgUploadInputElement.value = '';
    hashtagsInputElement.value = '';
    descrInputElement.value = '';
    submitButtonElement.disabled = '';
  }

  function onFilterClick(evt) {
    var currentElement = evt.target;

    if (currentElement === effectsListElement) {
      return;
    }

    resetEffects();

    while (currentElement.parentElement !== effectsListElement) {
      currentElement = currentElement.parentElement;
    }

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

  function onSubmitForm(evt) {
    evt.preventDefault();
    save(new FormData(userFormElement), closeImgUploadContainer, showSendError);
    submitButtonElement.disabled = 'disabled';
  }

  function onTryAgainClick(evt) {
    evt.preventDefault();
    submitButtonElement.disabled = '';
    messageErrorElement.classList.add('hidden');
  }

  function onDownloadAnotherFileClick(evt) {
    evt.preventDefault();
    messageErrorElement.classList.add('hidden');
    closeImgUploadContainer();
  }

  imgUploadInputElement.addEventListener('change', function () {
    openImgUploadContainer();
  });

  imgUploadCancelElement.addEventListener('click', function () {
    closeImgUploadContainer();
  });

  effectsListElement.addEventListener('click', onFilterClick);

  resizeControlMinusElement.addEventListener('click', function (evt) {
    setScale(evt, Scale);
  });

  resizeControlPlusElement.addEventListener('click', function (evt) {
    setScale(evt, Scale);
  });

  tryAgainLinkElement.addEventListener('click', onTryAgainClick);
  downloadAnotherFileLinkElement.addEventListener('click', onDownloadAnotherFileClick);

})();
