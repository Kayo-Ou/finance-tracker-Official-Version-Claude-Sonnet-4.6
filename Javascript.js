// 公共常量和工具函数
const gridColor = 'rgba(0,0,0,0.06)';
const tickColor = '#a0aec0';
const MILLISECONDS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25;

// 公共辅助函数
function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

function currencyWithSign(value, currency = '$') {
  const abs = Math.abs(value).toLocaleString('en-US', { maximumFractionDigits: 2 });
  const sign = value >= 0 ? '+' : '-';
  return `${currency}${sign}${abs}`;
}

function percentWithSign(value) {
  const sign = value >= 0 ? '+' : '-';
  return `${sign}${Math.abs(value).toFixed(2)}%`;
}

function parseInputValue(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function formatPercentLabel(name, value, sum) {
  if (!sum) return `${name} 0%`;
  return `${name} ${Math.round((value / sum) * 100)}%`;
}

/**
 * Normalize any supported date label into YYYY-MM-DD for chart display.
 * Returns the original input string unchanged when parsing fails.
 */
function formatFullDate(dateLabel) {
  const raw = String(dateLabel || '').trim();
  if (!raw) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const date = new Date(raw);
  if (isNaN(date.getTime())) return raw;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Detect year transition points from ordered date labels.
 * Labels should be chronological and parseable by formatFullDate.
 * Returns [{ index, year }] entries for the first item of each year.
 */
function detectYearChanges(labels) {
  const yearPoints = [];
  let currentYear = null;

  labels.forEach((label, index) => {
    const normalized = formatFullDate(label);
    const matchedYear = normalized.match(/^(\d{4})/);
    const year = matchedYear ? Number(matchedYear[1]) : NaN;
    if (!Number.isFinite(year)) return;

    if (year !== currentYear) {
      yearPoints.push({ index, year });
      currentYear = year;
    }
  });

  return yearPoints;
}

function axisConfig() {
  return {
    x: {
      grid: { color: gridColor, drawBorder: false },
      ticks: { color: tickColor, font: { size: 11 } }
    },
    y: {
      grid: { color: gridColor, drawBorder: false },
      ticks: {
        color: tickColor,
        font: { size: 11 },
        callback: v => '¥' + v.toLocaleString()
      }
    }
  };
}

// 通用导航处理
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const links = {
        'Real-time Dashboard': 'Dashboard.html',
        'Asset record': 'asset-record.html',
        'All-weather portfolio': 'all-weather-portfolio.html'
      };
      const text = item.textContent.trim();
      if (links[text]) window.location.href = links[text];
    });
  });
}

// 通用头像处理
function setupAvatar() {
  const savedAvatar = localStorage.getItem('userAvatar');
  if (savedAvatar) {
    document.getElementById('avatarDefault').style.display = 'none';
    const img = document.getElementById('avatarImg');
    img.src = savedAvatar;
    img.style.display = 'block';
  }

  const avatarInput = document.getElementById('avatarInput');
  if (avatarInput) {
    avatarInput.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        document.getElementById('avatarDefault').style.display = 'none';
        const img = document.getElementById('avatarImg');
        img.src = e.target.result;
        img.style.display = 'block';
        localStorage.setItem('userAvatar', e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }
}

// 通用垂直线插件
const hoverVerticalLinePlugin = {
  id: 'hoverVerticalLine',
  afterDatasetsDraw(chart, _args, pluginOptions) {
    if (!pluginOptions?.enabled) return;
    const activeElements = chart.tooltip?.getActiveElements?.() || [];
    if (!activeElements.length || !chart.chartArea) return;

    const x = activeElements[0].element.x;
    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = pluginOptions.color || 'rgba(123, 141, 176, 0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, chartArea.top);
    ctx.lineTo(x, chartArea.bottom);
    ctx.stroke();
    ctx.restore();
  }
};

// 通用年份分割线插件
const momYearSeparatorsPlugin = {
  id: 'momYearSeparators',
  afterDatasetsDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    const xScale = scales.x;
    const yearPoints = chart.options.plugins?.momYearSeparators?.yearPoints || [];
    if (!chartArea || !xScale || !yearPoints.length) return;

    ctx.save();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.fillStyle = '#4a5568';
    ctx.lineWidth = 1;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.font = '600 11px Segoe UI, sans-serif';

    yearPoints.forEach(point => {
      const currentX = xScale.getPixelForValue(point.index);
      const previousX = point.index > 0 ? xScale.getPixelForValue(point.index - 1) : currentX;
      const separatorX = point.index === 0 ? chartArea.left : (currentX + previousX) / 2;

      ctx.beginPath();
      ctx.moveTo(separatorX, chartArea.top);
      ctx.lineTo(separatorX, chartArea.bottom);
      ctx.stroke();

      ctx.fillText(String(point.year), separatorX, chartArea.top - 6);
    });

    ctx.restore();
  }
};

// All-Weather Portfolio 相关的公共函数
const allWeatherPortfolioData = {
  pingan: {
    accountName: '平安账户',
    avatarBg: '#fde8e8',
    avatarStroke: '#e07b7b',
    actualAssets: [
      { label: '沪深300', color: '#4fd1c5' },
      { label: '标普500', color: '#a0aec0' },
      { label: '中证1000', color: '#63b3ed' },
      { label: '中证500', color: '#1a3a6b' },
      { label: '纳指100', color: '#7c3aed' },
      { label: '现金', color: '#68d391' },
      { label: '黄金', color: '#f6e05e' },
      { label: '德国DAX', color: '#9f7aea' },
      { label: '越南市场', color: '#fc8181' },
      { label: '债卷基金', color: '#90cdf4' }
    ],
    targetAssets: [
      { label: '沪深300', color: '#4fd1c5', ratio: 15 },
      { label: '标普500', color: '#a0aec0', ratio: 15 },
      { label: '中证1000', color: '#63b3ed', ratio: 5 },
      { label: '中证500', color: '#1a3a6b', ratio: 10 },
      { label: '纳指100', color: '#7c3aed', ratio: 15 },
      { label: '现金', color: '#68d391', ratio: 5 },
      { label: '黄金', color: '#f6e05e', ratio: 5 },
      { label: '德国DAX', color: '#9f7aea', ratio: 5 },
      { label: '越南市场', color: '#fc8181', ratio: 5 },
      { label: '债卷基金', color: '#90cdf4', ratio: 20 }
    ]
  },
  snowball: {
    accountName: '雪球账户',
    avatarBg: '#dbeafe',
    avatarStroke: '#3b82f6',
    actualAssets: [
      { label: '螺丝钉金钉宝', color: '#1a3a6b' },
      { label: '标普500', color: '#a0aec0' },
      { label: '纳指100', color: '#63b3ed' },
      { label: '现金', color: '#68d391' },
      { label: '黄金', color: '#f6e05e' },
      { label: '越南市场', color: '#fc8181' },
      { label: '德国DAX', color: '#9f7aea' },
      { label: '债卷基金', color: '#90cdf4' }
    ],
    targetAssets: [
      { label: '螺丝钉金钉宝', color: '#1a3a6b', ratio: 30 },
      { label: '标普500', color: '#a0aec0', ratio: 15 },
      { label: '纳指100', color: '#63b3ed', ratio: 15 },
      { label: '现金', color: '#68d391', ratio: 5 },
      { label: '黄金', color: '#f6e05e', ratio: 5 },
      { label: '越南市场', color: '#fc8181', ratio: 5 },
      { label: '德国DAX', color: '#9f7aea', ratio: 5 },
      { label: '债卷基金', color: '#90cdf4', ratio: 20 }
    ]
  }
};

const STORAGE_KEY = 'portfolioRecords';
const FORM_DRAFTS = {};
const CHART_DEFAULT_DATA = [100];
const CHART_DEFAULT_COLOR = ['#edf2f7'];

let actualChart = null;
let targetChart = null;
let portfolioRecords = [];

function makeDonut(id, data, colors) {
  if (typeof Chart === 'undefined') return;
  const ctx = document.getElementById(id);
  if (id === 'actualRatioChart' && actualChart) actualChart.destroy();
  if (id === 'targetRatioChart' && targetChart) targetChart.destroy();

  const hasData = data.some(value => value > 0);
  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: hasData ? data : CHART_DEFAULT_DATA,
        backgroundColor: hasData ? colors : CHART_DEFAULT_COLOR,
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => hasData ? `${ctx.parsed.toFixed(2)}%` : 'No data'
          }
        }
      }
    }
  });

  if (id === 'actualRatioChart') actualChart = chart;
  if (id === 'targetRatioChart') targetChart = chart;
}

function renderLegend(id, legends) {
  document.getElementById(id).innerHTML = legends.map(l => `
    <div class="legend-item">
      <span class="legend-dot" style="background:${l.color}"></span>${l.label}
    </div>
  `).join('');
}

function renderAdjTable(rows) {
  document.getElementById('adjTableBody').innerHTML = rows.map(r => `
    <tr>
      <td>${r.no}</td>
      <td>${r.name}</td>
      <td class="${r.pos ? 'ratio-pos' : 'ratio-neg'}">${r.val}</td>
      <td class="${r.pos ? 'ratio-pos' : 'ratio-neg'}">${r.ratio}</td>
    </tr>
  `).join('');
}

function loadRecords() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse portfolio records:', error);
    return [];
  }
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolioRecords));
}

function updateDraftFromForm(tabKey) {
  const form = document.getElementById('addRecordForm');
  if (!form || !allWeatherPortfolioData[tabKey]) return;
  const draft = FORM_DRAFTS[tabKey] || {};
  allWeatherPortfolioData[tabKey].actualAssets.forEach(asset => {
    const input = form.querySelector(`input[data-asset="${asset.label}"]`);
    if (input) draft[asset.label] = input.value;
  });
  const dateInput = form.querySelector('#recordDate');
  if (dateInput) draft.date = dateInput.value;
  FORM_DRAFTS[tabKey] = draft;
}

function computeActualRatio(tabKey, details) {
  const assets = allWeatherPortfolioData[tabKey].actualAssets;
  const total = assets.reduce((sum, asset) => sum + (details[asset.label] || 0), 0);
  if (total <= 0) return assets.map(() => 0);
  return assets.map(asset => ((details[asset.label] || 0) / total) * 100);
}

function computeAdjustmentRows(tabKey, details) {
  const total = Object.values(details).reduce((sum, value) => sum + value, 0);
  return allWeatherPortfolioData[tabKey].targetAssets.map((asset, index) => {
    const currentValue = details[asset.label] || 0;
    const targetValue = (asset.ratio / 100) * total;
    const adjustValue = targetValue - currentValue;
    const ratioValue = currentValue === 0 ? null : (adjustValue / currentValue) * 100;
    return {
      no: `${String(index + 1).padStart(2, '0')}.`,
      name: asset.label,
      val: currencyWithSign(adjustValue),
      ratio: ratioValue === null ? '—' : percentWithSign(ratioValue),
      pos: adjustValue >= 0
    };
  });
}

function getLatestRecordForTab(tabKey) {
  return portfolioRecords.find(record => record.account === tabKey) || null;
}

function getDetailsFromDraft(tabKey) {
  const draft = FORM_DRAFTS[tabKey] || {};
  return allWeatherPortfolioData[tabKey].actualAssets.reduce((acc, asset) => {
    acc[asset.label] = parseInputValue(draft[asset.label]);
    return acc;
  }, {});
}

function renderList() {
  const list = document.getElementById('recordList');
  list.innerHTML = '';

  portfolioRecords
    .filter(record => record.account === activeTab)
    .forEach(record => {
      const accountConfig = allWeatherPortfolioData[record.account];
      if (!accountConfig) return;
      const item = document.createElement('div');
      item.className = 'record-item';
      item.innerHTML = `
      <div class="record-avatar" style="background:${accountConfig.avatarBg}">
        <svg viewBox="0 0 24 24" fill="none" stroke="${accountConfig.avatarStroke}" stroke-width="2">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
      </div>
      <div class="record-info">
        <div class="record-name">${accountConfig.accountName}</div>
        <div class="record-sub">current value</div>
      </div>
      <div class="record-values">
        <div class="record-amount">¥${Number(record.totalValue || 0).toLocaleString('zh-CN', { maximumFractionDigits: 2 })}</div>
        <div class="record-date">${record.date || getTodayDate()}</div>
      </div>
      <button class="btn-delete">Delete</button>
      `;
      item.querySelector('.btn-delete').addEventListener('click', () => {
        portfolioRecords = portfolioRecords.filter(entry => entry.id !== record.id);
        saveRecords();
        renderList();
        if (record.account === activeTab) {
          updateView(activeTab);
        }
      });
      list.appendChild(item);
    });
}

function renderForm(tabKey) {
  const form = document.getElementById('addRecordForm');
  const config = allWeatherPortfolioData[tabKey];
  const draft = FORM_DRAFTS[tabKey] || {};
  if (!draft.date) {
    draft.date = getTodayDate();
    FORM_DRAFTS[tabKey] = draft;
  }

  form.innerHTML = `
    <div class="input-group">
      <label>Date</label>
      <input type="date" id="recordDate" value="${draft.date}" />
    </div>
    ${config.actualAssets.map(asset => `
      <div class="input-group">
        <label>${asset.label}</label>
        <input
          type="number"
          min="0"
          step="0.01"
          data-asset="${asset.label}"
          placeholder="0.00"
          value="${draft[asset.label] || ''}"
        />
      </div>
    `).join('')}
    <button class="btn" type="submit">ADD</button>
  `;

  form.querySelectorAll('input[data-asset]').forEach(input => {
    input.addEventListener('input', () => updateDraftFromForm(tabKey));
  });
  form.querySelector('#recordDate').addEventListener('change', () => updateDraftFromForm(tabKey));
  form.onsubmit = event => {
    event.preventDefault();
    addRecord(tabKey);
  };
}

function addRecord(tabKey) {
  const form = document.getElementById('addRecordForm');
  const config = allWeatherPortfolioData[tabKey];
  const details = {};

  config.actualAssets.forEach(asset => {
    const input = form.querySelector(`input[data-asset="${asset.label}"]`);
    details[asset.label] = parseInputValue(input ? input.value : 0);
  });

  const dateSelect = form.querySelector('#recordDate');
  const totalValue = Object.values(details).reduce((sum, value) => sum + value, 0);
  const record = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    account: tabKey,
    date: dateSelect ? dateSelect.value : getTodayDate(),
    totalValue,
    details
  };

  portfolioRecords.unshift(record);
  saveRecords();

  FORM_DRAFTS[tabKey] = { date: getTodayDate() };
  renderForm(tabKey);
  updateView(tabKey);
  renderList();
}

function updateView(tabKey) {
  const config = allWeatherPortfolioData[tabKey];
  const latestRecord = getLatestRecordForTab(tabKey);
  const details = latestRecord ? latestRecord.details : getDetailsFromDraft(tabKey);
  const actualData = computeActualRatio(tabKey, details);
  const adjustmentRows = computeAdjustmentRows(tabKey, details);

  renderLegend('actualLegend', config.actualAssets);
  renderLegend('targetLegend', config.targetAssets);
  makeDonut('actualRatioChart', actualData, config.actualAssets.map(item => item.color));
  makeDonut('targetRatioChart', config.targetAssets.map(item => item.ratio), config.targetAssets.map(item => item.color));
  renderAdjTable(adjustmentRows);
}

function switchTab(tabKey) {
  updateDraftFromForm(activeTab);
  activeTab = tabKey;
  const nextDraft = FORM_DRAFTS[tabKey] || {};
  nextDraft.date = getTodayDate();
  FORM_DRAFTS[tabKey] = nextDraft;
  renderForm(tabKey);
  updateView(tabKey);
  renderList();
}

// Asset Record 页面的公共函数
function setupTabSwitching() {
  const tabTables = {
    'Total account value': 'table-total',
    'Fund market value': 'table-fund',
    'Stock value': 'table-stock',
    'Accounting stats': 'table-accounting'
  };

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // 隐藏所有表格
      ['table-total', 'table-fund', 'table-stock', 'table-accounting'].forEach(id => {
        document.getElementById(id).style.display = 'none';
      });

      // 显示对应表格
      const targetId = tabTables[tab.textContent.trim()];
      if (targetId) document.getElementById(targetId).style.display = 'table';
    });
  });
}

function bindDelete(tbodyId) {
  document.querySelectorAll(`#${tbodyId} .btn-delete`).forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      const row = btn.closest('tr');
      row.style.transition = 'opacity 0.3s';
      row.style.opacity = '0';
      setTimeout(() => {
        records.splice(idx, 1);
        localStorage.setItem('assetRecords', JSON.stringify(records));
        renderAll();
      }, 300);
    });
  });
}

function renderAll() {
  // Total account value
  const tbody = document.getElementById('recordTableBody');
  tbody.innerHTML = '';
  records.slice().reverse().forEach((r, i) => {
    const originalIndex = records.length - 1 - i;
    const tr = document.createElement('tr');
    tr.innerHTML = `
    <td>${String(i + 1).padStart(2, '0')}.</td>
    <td>${r.date}</td>
    <td>${r.pinganBank}</td>
    <td>${r.pinganSec}</td>
    <td>${r.alipay}</td>
    <td>${r.agriBank}</td>
    <td><button class="btn-delete" data-index="${originalIndex}">Delete</button></td>
  `;
    tbody.appendChild(tr);
  });
  bindDelete('recordTableBody');

  // Fund market value
  const fundBody = document.getElementById('fundTableBody');
  fundBody.innerHTML = '';
  records.slice().reverse().forEach((r, i) => {
    const originalIndex = records.length - 1 - i;
    const tr = document.createElement('tr');
    tr.innerHTML = `
    <td>${String(i + 1).padStart(2, '0')}.</td>
    <td>${r.date}</td>
    <td>${r.pinganBankFund}</td>
    <td>${r.pinganSecFund}</td>
    <td>${r.alipayFund}</td>
    <td>${r.xueqiuFund}</td>
    <td><button class="btn-delete" data-index="${originalIndex}">Delete</button></td>
  `;
    fundBody.appendChild(tr);
  });
  bindDelete('fundTableBody');

  // Stock value
  const stockBody = document.getElementById('stockTableBody');
  stockBody.innerHTML = '';
  records.slice().reverse().forEach((r, i) => {
    const originalIndex = records.length - 1 - i;
    const tr = document.createElement('tr');
    tr.innerHTML = `
    <td>${String(i + 1).padStart(2, '0')}.</td>
    <td>${r.date}</td>
    <td>${r.sfStock}</td>
    <td><button class="btn-delete" data-index="${originalIndex}">Delete</button></td>
  `;
    stockBody.appendChild(tr);
  });
  bindDelete('stockTableBody');

  // Accounting stats
  const accountingBody = document.getElementById('accountingTableBody');
  accountingBody.innerHTML = '';
  records.slice().reverse().forEach((r, i) => {
    const originalIndex = records.length - 1 - i;
    const pb = parseFloat(r.pinganBank) || 0;
    const ps = parseFloat(r.pinganSec) || 0;
    const ali = parseFloat(r.alipay) || 0;
    const agri = parseFloat(r.agriBank) || 0;
    const pbf = parseFloat(r.pinganBankFund) || 0;
    const psf = parseFloat(r.pinganSecFund) || 0;
    const alif = parseFloat(r.alipayFund) || 0;
    const sf = parseFloat(r.sfStock) || 0;

    const cashFlow = (pb - pbf) + (ps - psf - sf) + (ali - alif) + agri;
    const xqf = parseFloat(r.xueqiuFund) || 0;
    const fund = pbf + psf + alif + xqf;
    const stock = sf;
    const total = cashFlow + fund + stock;

    const tr = document.createElement('tr');
    tr.innerHTML = `
<td>${String(i + 1).padStart(2, '0')}.</td>
<td>${r.date}</td>
<td>${cashFlow.toFixed(2)}</td>
<td>${fund.toFixed(2)}</td>
<td>${stock.toFixed(2)}</td>
<td>${total.toFixed(2)}</td>
<td><button class="btn-delete" data-index="${originalIndex}">Delete</button></td>
`;
    accountingBody.appendChild(tr);
  });
  bindDelete('accountingTableBody');
}

// 初始化函数
function initializePage() {
  setupNavigation();
  setupAvatar();
}

// 在DOM加载完成后执行初始化
document.addEventListener('DOMContentLoaded', initializePage);