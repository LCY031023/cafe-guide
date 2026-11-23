document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.cafe-card'));
  const statusButtons = document.querySelectorAll('[data-filter-status]');
  const regionButtons = document.querySelectorAll('[data-filter-region]');
  const cityFilterGroup = document.getElementById('city-filter-group');
  const cityButtonsContainer = document.getElementById('city-buttons');
  const emptyState = document.getElementById('empty-state');

  let currentStatus = 'all';
  let currentRegion = 'all';
  let currentCity = 'all';

  function createSubButton(label, value, isActive) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'filter-btn filter-btn-sub' + (isActive ? ' active' : '');
    btn.textContent = label;
    btn.addEventListener('click', () => {
      currentCity = value;
      renderCityButtons();
      applyFilters();
    });
    return btn;
  }

  function renderCityButtons() {
    // 選「全部地區」時抓取全站現有縣市；選特定大區域時只抓取該區域現有的縣市
    const targetCards =
      currentRegion === 'all'
        ? cards
        : cards.filter((card) => card.dataset.region === currentRegion);

    const cities = [
      ...new Set(
        targetCards
          .map((card) => card.dataset.city)
          .filter(Boolean)
      ),
    ];

    // 若目前選擇的區域沒有任何已收錄店家，強制隱藏整排細分縣市
    if (cities.length === 0) {
      cityFilterGroup.hidden = true;
      cityFilterGroup.style.display = 'none';
      cityButtonsContainer.innerHTML = '';
      currentCity = 'all';
      return;
    }

    cityFilterGroup.hidden = false;
    cityFilterGroup.style.display = '';
    cityButtonsContainer.innerHTML = '';
    cityButtonsContainer.appendChild(
      createSubButton('全部縣市', 'all', currentCity === 'all')
    );

    cities.forEach((city) => {
      cityButtonsContainer.appendChild(
        createSubButton(city, city, currentCity === city)
      );
    });
  }

  function applyFilters() {
    let visibleCount = 0;

    cards.forEach((card) => {
      const matchStatus =
        currentStatus === 'all' || card.dataset.status === currentStatus;
      const matchRegion =
        currentRegion === 'all' || card.dataset.region === currentRegion;
      const matchCity =
        currentCity === 'all' || card.dataset.city === currentCity;

      if (matchStatus && matchRegion && matchCity) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    emptyState.hidden = visibleCount > 0;
  }

  statusButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      statusButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentStatus = btn.dataset.filterStatus;
      applyFilters();
    });
  });

  regionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      regionButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentRegion = btn.dataset.filterRegion;
      currentCity = 'all';
      renderCityButtons();
      applyFilters();
    });
  });

  // 網頁載入時預設為「全部地區」，立即顯示全站現有縣市按鈕
  renderCityButtons();
  applyFilters();
});
