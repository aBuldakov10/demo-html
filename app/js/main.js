document.addEventListener('DOMContentLoaded', () => {
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

  /*** Fill preferences ***/
  if (sessionStorage.getItem('preferences')) {
    setPreferences();
  }

  /*** Change theme ***/
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

  /*** Preferences function ***/
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
        this.classList.toggle('active');
      });
    });
  }

  /*** Tabs ***/
  $('.js-tabs .tabs__navigation-link').on('click', function (e) {
    e.preventDefault();

    let thisAnchor = $(this).attr('href'),
      thisTarget = $(thisAnchor);

    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    $('.tabs__content-item').hide();
    thisTarget.show();
  });
});
