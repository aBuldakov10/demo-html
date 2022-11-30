document.addEventListener('DOMContentLoaded', () => {
  /*** Slider init ***/
  const slider = document.querySelector('.js-slider');

  if (slider) {
    new Swiper('.js-slider', {
      watchOverflow: true,
      allowTouchMove: false,
      speed: 0,

      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      on: {
        slideNextTransitionStart: function () {
          const prevSlide = document.querySelector('.swiper-slide-prev');
          const activeSlide = document.querySelector('.swiper-slide-active');

          // Set prev animation
          slideAnimation(prevSlide, 100, 50);

          // Set active animation
          slideAnimation(activeSlide, 100, 0);
        },

        slidePrevTransitionStart: function () {
          const nextSlide = document.querySelector('.swiper-slide-next');
          const activeSlide = document.querySelector('.swiper-slide-active');

          // Set next animation
          slideAnimation(nextSlide, -100, 0);

          // Set active animation
          slideAnimation(activeSlide, -50, 0);
        },
      },
    });
  }

  // Animation slide function
  function slideAnimation(element, from, to) {
    const elementImg = element.querySelector('.main-slider__img');
    const elementTitle = element.querySelector('.main-slider__title');

    const sliderItem = document.querySelector('.main-slider__item');
    const sliderItemInnerSpace = window.getComputedStyle(sliderItem).padding;
    const shiftSpacing = parseFloat(sliderItemInnerSpace) * 2;

    const nextElement = document.querySelector('.swiper-slide-next');
    const operationSign = nextElement === element ? '-' : '+';

    elementImg.setAttribute('style', '');
    elementImg.style.setProperty('transform', `translateX(${from}%)`);
    elementTitle.setAttribute('style', '');
    elementTitle.style.setProperty(
      'transform',
      `translateX(calc(${from}% ${operationSign} ${shiftSpacing}px))`
    );

    setTimeout(() => {
      elementImg.style.setProperty('transition-duration', '1200ms');
      elementImg.style.setProperty('transform', `translateX(${to}%)`);
      elementTitle.style.setProperty('transition-duration', '1200ms');
      elementTitle.style.setProperty('transform', `translateX(${to}%)`);
    }, 0);
  }

  /*** Likes ***/
  const likeBtns = document.querySelectorAll('.js-like .like__icon');
  let likesObj = {};

  likeBtns.forEach((itemBtn) => {
    itemBtn.addEventListener('click', function () {
      const thisParent = this.closest('.js-like');
      const thisId = this.getAttribute('data-slider-id');
      const isLikedSlide = this.getAttribute('data-is-liked');
      const thisLikeCounterElem = thisParent.querySelector('.like__counter');
      let thisLikeCounter = +thisLikeCounterElem.textContent;

      if (isLikedSlide === 'true') {
        return false;
      }

      this.setAttribute('data-is-liked', true);
      thisLikeCounterElem.innerHTML = (thisLikeCounter + 1).toString();
      likesObj[thisId] = thisLikeCounter + 1;
      sessionStorage.setItem('likes', JSON.stringify(likesObj));
    });
  });

  // Set likes on load
  if (sessionStorage.getItem('likes')) {
    const getStorageLikes = sessionStorage.getItem('likes');
    likesObj = JSON.parse(getStorageLikes);

    Object.keys(likesObj).forEach((key) => {
      const likedBtn = document.querySelector(
        `.js-like .like__icon[data-slider-id="${key}"]`
      );

      if (likedBtn) {
        likedBtn.setAttribute('data-is-liked', 'true');
        likedBtn.nextElementSibling.querySelector('.like__counter').innerHTML =
          likesObj[key];
      }
    });
  }

  /*** Init select list ***/
  const select = $('.js-select2');

  if (select) {
    select.each(function () {
      $(this).select2({
        minimumResultsForSearch: 20,
        dropdownParent: $(this).next('.dropDownSelect2'),
        width: '100%',
      });
    });
  }

  /*** Preferences ***/
  // Fill preferences on load
  if (sessionStorage.getItem('preferences')) {
    setPreferences();
  }

  // Change theme
  const form = document.querySelector('[name="preferences"]');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(e.target);
      let preferencesObj = {};

      formData.forEach((value, fieldName) => {
        preferencesObj[fieldName] = value;
      });

      sessionStorage.setItem('preferences', JSON.stringify(preferencesObj));

      setPreferences();
    });
  }

  // Preferences function
  function setPreferences() {
    const getStoragePreferences = sessionStorage.getItem('preferences');
    const getPreferencesObj = JSON.parse(getStoragePreferences);
    const root = document.querySelector('html');
    const textInput = document.querySelectorAll('[type="text"]');
    const textRadio = document.querySelectorAll('[type="radio"]');

    // Add theme class to body
    root.setAttribute('data-theme', getPreferencesObj.theme);

    // Fill text fields
    textInput.forEach((inputElement) => {
      inputElement.value = getPreferencesObj[inputElement.name];
    });

    // Set radio option
    textRadio.forEach((radioElement) => {
      if (
        radioElement.getAttribute('name') === 'theme' &&
        radioElement.value === getPreferencesObj.theme
      ) {
        radioElement.setAttribute('checked', true);
      }
    });

    // Set selected option
    Object.keys(getPreferencesObj).forEach((item) => {
      const select = document.querySelector(`select[name="${item}"]`);

      if (select) {
        select.querySelectorAll('option').forEach((optionElement) => {
          if (optionElement.value === getPreferencesObj[item]) {
            optionElement.setAttribute('selected', true);

            $('.js-select2').select2({ minimumResultsForSearch: 20 });
          }
        });
      }
    });

    // Set container width
    if (getPreferencesObj.containerWidth === '0') {
      document.documentElement.style.setProperty('--container-width', '');
    } else {
      document.documentElement.style.setProperty(
        '--container-width',
        `${getPreferencesObj.containerWidth}px`
      );
    }
  }

  /*** Set form range value ***/
  const rangeElem = document.querySelector('.js-form-range');
  const rangeElemVal = document.querySelector('.js-form-range-value');

  if (rangeElem) {
    rangeElemVal.innerHTML = `${rangeElem.value} %`;

    rangeElem.addEventListener('input', function () {
      rangeElemVal.innerHTML = `${this.value} %`;
    });
  }

  /*** Timer ***/
  const timerElement = document.querySelector('.js-timer');

  if (timerElement) {
    const timerValue = 30;
    let timerMinutes = timerValue * 60;

    const timer = setInterval(function () {
      const seconds = timerMinutes % 60;
      const renderSeconds = seconds < 10 ? `0${seconds}` : seconds;

      const minutes = (timerMinutes / 60) % 60;
      const renderMinutes =
        minutes < 10 ? `0${Math.trunc(minutes)}` : `${Math.trunc(minutes)}`;

      if (timerMinutes < 0) {
        clearInterval(timer);
      } else {
        timerElement.innerHTML = `00:${renderMinutes}:${renderSeconds}`;
      }

      --timerMinutes;
    }, 1000);
  }

  /*** Mobile menu ***/
  const body = document.querySelector('body');
  const header = document.querySelector('header');
  const headerNav = document.querySelector('.js-header-nav');
  const mobBurger = document.querySelector('.js-mob-burger');
  const headerMenu = document.querySelector('.js-header-menu');

  mobBurger.addEventListener('click', () => {
    body.classList.toggle('no-scroll');
    body.classList.toggle('is-blur');
    headerNav.classList.toggle('is-open-menu');
  });

  function setMobMenuPosition() {
    if (window.innerWidth >= 992) {
      headerMenu.setAttribute('style', '');
      return false;
    }

    const headerHeight = header.clientHeight;

    headerMenu.style.top = `${headerHeight}px`;
    headerMenu.style.height = `calc(100vh - ${headerHeight}px)`;
  }

  function hideMobMenu() {
    if (window.innerWidth >= 992) {
      return false;
    }

    body.classList.remove('no-scroll');
    body.classList.remove('is-blur');
    headerNav.classList.remove('is-open-menu');
  }

  function handleMobMenuAction() {
    setMobMenuPosition();
    hideMobMenu();
  }

  window.addEventListener('resize', handleMobMenuAction);
  window.addEventListener('orientationchange', handleMobMenuAction);

  /*** Add file ***/
  const addFileBtn = document.querySelector('.js-form-file-btn');
  const addFileTxt = document.querySelector('.form-file__title');

  if (addFileBtn) {
    addFileBtn.addEventListener('click', function (e) {
      e.preventDefault();

      const thisParent = this.closest('.form-file');
      const thisInputFileField = thisParent.querySelector('.form-file__input');

      thisInputFileField.click();

      thisInputFileField.addEventListener('change', () => {
        const countFiles = thisInputFileField.files.length;
        let addFileBtnString = '';

        if (countFiles >= 1) {
          addFileBtnString = `Добавлено ${countFiles} файла(ов)`;
        } else {
          addFileBtnString = 'добавить файл';
        }

        addFileTxt.innerHTML = addFileBtnString;
      });
    });
  }

  /*** Accordion ***/
  const switchElement = document.querySelectorAll('.js-switch');

  if (switchElement) {
    switchElement.forEach((item) => {
      item.addEventListener('click', function () {
        $(this).next().slideToggle(200);

        setTimeout(() => {
          this.classList.toggle('active');
        }, 200);
      });
    });
  }

  /*** Tabs ***/
  $('.js-tabs .tabs__navigation-link').on('click', function (e) {
    e.preventDefault();

    const thisAnchor = $(this).attr('href');
    const thisTarget = $(thisAnchor);

    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    $('.tab').removeClass('active');
    thisTarget.addClass('active');
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 768) {
      const mobTabContent = document.querySelectorAll('.mob-tab-content');

      mobTabContent.forEach((item) => {
        item.style.setProperty('display', '');
      });
    }
  });

  /*** Fetch api ***/
  const personsList = document.querySelector('.js-render-persons');

  if (personsList) {
    const api = 'https://rickandmortyapi.com/api';
    const fetchCharacter = async () => {
      const url = `${api}/character`;
      const data = await fetch(url);

      return await data.json();
    };

    fetchCharacter().then(({ results }) => {
      results.forEach(
        ({ id, image, status, name, gender, location, species, episode }) => {
          const personsListItem = document.createElement('li');
          const statusClass = status === 'Dead' ? 'is-dead' : '';

          personsListItem.setAttribute('id', `${id}`);
          personsListItem.classList.add('persons-list__item', 'person');

          personsListItem.innerHTML = `<div class="person__photo">
                                      <div class="person__photo-image ${statusClass}">
                                        <img src="${image}" alt="${name}">
                                      </div>
              
                                      <span class="person__photo-status">Status: ${status}</span>
                                     </div>

                                     <div class="person__info">
                                        <h3 class="person__info-item">${name}</h3>
                                        
                                        <div class="person__info-item">
                                          <span class="person__info-title">gender:</span>
                                          <span class="person__info-description">${gender}</span>
                                        </div>
                                        
                                        <div class="person__info-item">
                                          <span class="person__info-title">location:</span>
                                          <span class="person__info-description">${location.name}</span>
                                        </div>
                                        
                                        <div class="person__info-item">
                                          <span class="person__info-title">species:</span>
                                          <span class="person__info-description">${species}</span>
                                        </div>
                                                  
                                        <div class="person__info-item">
                                          <span class="person__info-title">episodes:</span>
                                          
                                          <ul class="person__info-description person-episode-list"></ul>
                                        </div>
                                     </div>`;

          personsList.append(personsListItem);

          const personEpisodesList =
            personsListItem.querySelector(`.person-episode-list`);

          episode.forEach((item, index) => {
            const isComma = index + 1 !== episode.length ? ',' : '';
            const personEpisodesListItem = document.createElement('li');
            const episodeNumber = item.split('/').reverse()[0];

            personEpisodesListItem.innerHTML = `Episode ${episodeNumber}${isComma}`;
            personEpisodesList.append(personEpisodesListItem);
          });
        }
      );
    });
  }
});
