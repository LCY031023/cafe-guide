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
    if (currentRegion === 'all') {
      cityFilterGroup.hidden = true;
      currentCity = 'all';
      return;
    }

    const cities = [
      ...new Set(
        cards
          .filter((card) => card.dataset.region === currentRegion)
          .map((card) => card.dataset.city)
          .filter(Boolean)
      ),
    ];

    if (cities.length === 0) {
      cityFilterGroup.hidden = true;
      currentCity = 'all';
      return;
    }

    cityFilterGroup.hidden = false;
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

  applyFilters();
});