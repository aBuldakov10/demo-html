document.addEventListener('DOMContentLoaded', () => {
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
  $('.js-switch').on('click', function () {
    $(this).next().slideToggle(200);
    $(this).toggleClass('active');
  });

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
