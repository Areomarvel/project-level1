
const fetchInfo = () => {
    if (!localStorage.currentUser) {
        window.location.href = 'login.html';
    } else {
        setTimeout(() => {
            document.getElementById('loader').style.display = 'none';
            document.getElementById('apped').style.display = 'block';
        }, 1000);
    }
}
let state = {
  nairaBalance: 1000.00,
  stashBalance: 1000.00,
  balanceMasked: false,
  partnerEmail: '',
  savingsPlans: [
    { name: "Emergency Fund", saved: 150000, target: 500000, type: "regular", duration: 12, rate: 11 },
    { name: "New Laptop Goal", saved: 450000, target: 800000, type: "halal", duration: 6, rate: 12 }
  ],
  investments: [
    { fundName: "Nigerian Equity Fund", yield: 18.5, balance: 0.00, category: "Aggressive", risk: "high" },
    { fundName: "Eurobond Dollar Fund", yield: 8.2, balance: 0.00, category: "Conservative", risk: "low" },
    { fundName: "Halal Investment Fund", yield: 12.4, balance: 0.00, category: "Moderate", risk: "med" }
  ]
};
// LocalStorage Hydration
function loadState() {
  const savedState = localStorage.getItem('cowrywise_state');
  if (savedState) {
    try {
      state = JSON.parse(savedState);
    } catch (e) {
      console.error('Failed to parse localStorage state', e);
    }
  }
}
function saveState() {
  localStorage.setItem('cowrywise_state', JSON.stringify(state));
  updateUI();
}
// Formatting Helpers
function formatMoney(amount) {
  return amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
// UI Updating Function
function updateUI() {
  // Update spending Naira balance representation
  const balanceValEl = document.getElementById('valNairaBalance');
  const cardEl = document.getElementById('mainBalanceCard');
  
  if (state.balanceMasked) {
    cardEl.classList.add('masked');
  } else {
    cardEl.classList.remove('masked');
    if (balanceValEl) {
      const parts = formatMoney(state.nairaBalance).split('.');
      balanceValEl.textContent = parts[0];
      const centsEl = cardEl.querySelector('.balance-cents');
      if (centsEl) centsEl.textContent = '.' + parts[1];
    }
  }
  // Update total savings count & amounts
  const totalSavings = state.savingsPlans.reduce((sum, plan) => sum + plan.saved, 0);
  const totalSavingsEl = document.getElementById('valTotalSavings');
  if (totalSavingsEl) totalSavingsEl.textContent = `₦ ${formatMoney(totalSavings)}`;
  
  const activePlansCountEl = document.getElementById('valActivePlansCount');
  if (activePlansCountEl) activePlansCountEl.textContent = state.savingsPlans.length;
  // Update Stash Page indicators
  const stashBalanceEl = document.getElementById('valStashBalance');
  if (stashBalanceEl) stashBalanceEl.textContent = `₦ ${formatMoney(state.stashBalance)}`;
  // Update Portfolio Sub-navigation View
  const netWorth = state.nairaBalance + state.stashBalance + totalSavings;
  const portfolioNetWorthEl = document.getElementById('valPortfolioNetWorth');
  if (portfolioNetWorthEl) portfolioNetWorthEl.textContent = `₦ ${formatMoney(netWorth)}`;
  const portfolioSavingsEl = document.getElementById('valPortfolioSavings');
  if (portfolioSavingsEl) portfolioSavingsEl.textContent = `₦ ${formatMoney(totalSavings)}`;
  const portfolioStashEl = document.getElementById('valPortfolioStash');
  if (portfolioStashEl) portfolioStashEl.textContent = `₦ ${state.stashBalance.toLocaleString('en-NG', {minimumFractionDigits: 2})}`;
  // Update Portfolio conic chart percentages
  const pctSavings = netWorth > 0 ? Math.round((totalSavings / netWorth) * 100) : 0;
  const pctStash = netWorth > 0 ? Math.round((state.stashBalance / netWorth) * 100) : 100;
  const pctInvestments = 0; // Currently mock investment value is 0 or can be calculated
  const pctSavingsEl = document.getElementById('pctSavings');
  if (pctSavingsEl) pctSavingsEl.textContent = `(${pctSavings}%)`;
  const pctStashEl = document.getElementById('pctStash');
  if (pctStashEl) pctStashEl.textContent = `(${pctStash}%)`;
  const conicChartEl = document.getElementById('portfolioConicChart');
  if (conicChartEl) {
    conicChartEl.style.background = `conic-gradient(
      var(--primary) 0% ${pctSavings}%, 
      var(--accent-orange) ${pctSavings}% ${pctSavings + pctInvestments}%, 
      var(--accent-green) ${pctSavings + pctInvestments}% 100%
    )`;
  }
  // Render Savings plans grid
  renderSavingsPlans();
}
// Navigation Router Setup
function initRouter() {
  const navItems = document.querySelectorAll('.nav-item');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  const views = document.querySelectorAll('.dashboard-view');
  const titleEl = document.querySelector('.page-title');
  function switchView(tabId) {
    // Hide all views, display matching
    views.forEach(view => {
      view.classList.remove('active');
    });
    const targetView = document.getElementById(`view-${tabId}`);
    if (targetView) targetView.classList.add('active');
    // Update active nav anchors
    navItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    mobileNavItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    // Update Page Header Titles
    const titleMap = {
      home: "Account Overview",
      save: "Savings Center",
      invest: "Investments",
      nest: "Nest Joint Savings",
      payment: "Payments & Transfers",
      stash: "Cash Stash",
      learn: "Learn Finance",
      referral: "Refer & Earn"
    };
    if (titleEl) titleEl.textContent = titleMap[tabId] || "Overview";
    // Close drawer on mobile
    const sidebar = document.getElementById('sidebarMenu');
    if (sidebar) sidebar.classList.remove('mobile-open');
    
    // Smooth scroll page to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Add click listeners
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const tabId = item.getAttribute('data-tab');
      switchView(tabId);
    });
  });
  mobileNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = item.getAttribute('data-tab');
      switchView(tabId);
    });
  });
  // Handle mobile menu toggle button click
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const sidebar = document.getElementById('sidebarMenu');
  if (menuToggleBtn && sidebar) {
    menuToggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
  }
  // Handle Home view sub-navigation toggles
  const subHomeBtn = document.getElementById('subHomeBtn');
  const subPortfolioBtn = document.getElementById('subPortfolioBtn');
  const homeTab = document.getElementById('nested-home-tab');
  const portfolioTab = document.getElementById('nested-portfolio-tab');
  if (subHomeBtn && subPortfolioBtn && homeTab && portfolioTab) {
    subHomeBtn.addEventListener('click', () => {
      subHomeBtn.classList.add('active');
      subPortfolioBtn.classList.remove('active');
      homeTab.style.display = 'block';
      portfolioTab.style.display = 'none';
    });
    subPortfolioBtn.addEventListener('click', () => {
      subPortfolioBtn.classList.add('active');
      subHomeBtn.classList.remove('active');
      homeTab.style.display = 'none';
      portfolioTab.style.display = 'block';
    });
  }
}
// Add Cash Interactions
function initAddCash() {
  // Preset buttons logic
  const presetBtns = document.querySelectorAll('.preset-btn[data-amt]');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const amt = parseFloat(btn.getAttribute('data-amt'));
      state.nairaBalance += amt;
      alert(`Success! ₦${formatMoney(amt)} added to Naira Balance.`);
      saveState();
    });
  });
  // Modal confirm logic
  const confirmBtn = document.getElementById('confirmAddCashBtn');
  const amtInput = document.getElementById('acAmount');
  const sourceSelect = document.getElementById('acSource');
  const modal = document.getElementById('addCashModal');
  const openModalBtn = document.getElementById('openAddCashBtn');
  if (openModalBtn && modal) {
    openModalBtn.addEventListener('click', () => {
      amtInput.value = '';
      modal.showModal();
    });
  }
  if (confirmBtn && modal && amtInput) {
    confirmBtn.addEventListener('click', () => {
      const amt = parseFloat(amtInput.value);
      if (isNaN(amt) || amt <= 0) {
        alert('Please enter a valid amount.');
        return;
      }
      
      const source = sourceSelect.value;
      if (source === 'stash') {
        if (state.stashBalance < amt) {
          alert('Insufficient funds in Stash.');
          return;
        }
        state.stashBalance -= amt;
      }
      
      state.nairaBalance += amt;
      modal.close();
      alert(`Success! Added ₦${formatMoney(amt)} from ${source === 'stash' ? 'Stash' : 'funding source'}.`);
      saveState();
    });
  }
  // Banner CTA triggers Add Cash Modal
  const salaryBtn = document.getElementById('salaryTopUpBtn');
  if (salaryBtn && modal) {
    salaryBtn.addEventListener('click', () => {
      amtInput.value = '';
      modal.showModal();
    });
  }
  
  // Banner Grow Wealth navigates to Save view
  const growBtn = document.getElementById('growWealthBtn');
  if (growBtn) {
    growBtn.addEventListener('click', () => {
      const saveNavItem = document.querySelector('.nav-item[data-tab="save"]');
      if (saveNavItem) saveNavItem.click();
    });
  }
}
// Privacy Toggles
function initPrivacy() {
  const toggleBtn = document.getElementById('toggleBalanceBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      state.balanceMasked = !state.balanceMasked;
      saveState();
    });
  }
}
// Savings Goal Rendering and Operations
function renderSavingsPlans() {
  const grid = document.getElementById('savingsPlansGrid');
  if (!grid) return;
  
  grid.innerHTML = '';
  
  state.savingsPlans.forEach((plan, index) => {
    const percent = Math.min(Math.round((plan.saved / plan.target) * 100), 100);
    const planCardHtml = `
      <div class="plan-card ${plan.type === 'halal' ? 'halal' : ''}">
        <div class="plan-card-header">
          <div class="plan-title-wrapper">
            <div class="plan-icon ${plan.type === 'halal' ? 'halal' : ''}">
              ${plan.type === 'halal' ? '🕌' : '🛡️'}
            </div>
            <div>
              <span class="plan-name">${plan.name}</span>
              <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">Rate: ${plan.rate}% p.a.</div>
            </div>
          </div>
          <span class="plan-badge">${plan.type}</span>
        </div>
        
        <div class="plan-progress-container">
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${percent}%;"></div>
          </div>
          <div class="progress-info">
            <span>Saved: ₦${formatMoney(plan.saved)}</span>
            <span>Target: ₦${formatMoney(plan.target)}</span>
          </div>
        </div>
        
        <div class="plan-card-footer">
          <div class="plan-amount">
            <h4>${percent}%</h4>
            <span>Progress</span>
          </div>
          <button class="action-btn secondary-btn" style="padding: 6px 16px; font-size:13px;" onclick="openFundModal('${plan.name}', ${index})">Top Up</button>
        </div>
      </div>
    `;
    grid.insertAdjacentHTML('beforeend', planCardHtml);
  });
}
// Global modal opener for funding savings plans
window.openFundModal = function(planName, index) {
  const modal = document.getElementById('fundPlanModal');
  const fpPlanName = document.getElementById('fpPlanName');
  const fpPlanIndex = document.getElementById('fpPlanIndex');
  const fpAmount = document.getElementById('fpAmount');
  if (modal && fpPlanName && fpPlanIndex) {
    fpPlanName.value = planName;
    fpPlanIndex.value = index;
    fpAmount.value = '';
    modal.showModal();
  }
};
function initSavingsOps() {
  // Create Plan logic
  const openCreateBtn = document.getElementById('openCreatePlanBtn');
  const createModal = document.getElementById('createPlanModal');
  const confirmCreateBtn = document.getElementById('confirmCreatePlanBtn');
  
  if (openCreateBtn && createModal) {
    openCreateBtn.addEventListener('click', () => {
      document.getElementById('cpName').value = '';
      document.getElementById('cpTarget').value = '';
      createModal.showModal();
    });
  }
  if (confirmCreateBtn && createModal) {
    confirmCreateBtn.addEventListener('click', () => {
      const name = document.getElementById('cpName').value.trim();
      const target = parseFloat(document.getElementById('cpTarget').value);
      const type = document.getElementById('cpType').value;
      const duration = parseInt(document.getElementById('cpDuration').value);
      
      if (!name) {
        alert('Please enter a goal name.');
        return;
      }
      if (isNaN(target) || target <= 0) {
        alert('Please enter a valid target amount.');
        return;
      }
      
      const interestRate = type === 'halal' ? 12 : 11;
      const newPlan = {
        name: name,
        saved: 0,
        target: target,
        type: type,
        duration: duration,
        rate: interestRate
      };
      state.savingsPlans.push(newPlan);
      createModal.close();
      alert(`Savings goal "${name}" created successfully!`);
      saveState();
    });
  }
  // Fund savings plan confirmation logic
  const confirmFundBtn = document.getElementById('confirmFundPlanBtn');
  const fundModal = document.getElementById('fundPlanModal');
  
  if (confirmFundBtn && fundModal) {
    confirmFundBtn.addEventListener('click', () => {
      const planIdx = parseInt(document.getElementById('fpPlanIndex').value);
      const amt = parseFloat(document.getElementById('fpAmount').value);
      const source = document.getElementById('fpSource').value;
      if (isNaN(amt) || amt <= 0) {
        alert('Please enter a valid amount to save.');
        return;
      }
      if (source === 'wallet') {
        if (state.nairaBalance < amt) {
          alert('Insufficient funds in Naira Balance wallet.');
          return;
        }
        state.nairaBalance -= amt;
      } else if (source === 'stash') {
        if (state.stashBalance < amt) {
          alert('Insufficient funds in Cash Stash.');
          return;
        }
        state.stashBalance -= amt;
      }
      // Add to plan balance
      state.savingsPlans[planIdx].saved += amt;
      fundModal.close();
      alert(`Successfully saved ₦${formatMoney(amt)} to "${state.savingsPlans[planIdx].name}"!`);
      saveState();
    });
  }
}
// Investment Calculator & Mutual Funds Renderer
function renderMutualFunds() {
  const container = document.getElementById('mutualFundsContainer');
  if (!container) return;
  container.innerHTML = '';
  state.investments.forEach((fund) => {
    const isNegative = fund.yield < 0;
    const fundHtml = `
      <div class="fund-item">
        <div class="fund-details">
          <div class="fund-badge-icon ${fund.risk}">
            ${fund.risk === 'high' ? '🔥' : fund.risk === 'med' ? '🌿' : '🏦'}
          </div>
          <div>
            <div class="fund-title">${fund.fundName}</div>
            <div class="fund-category">${fund.category} · Risk level</div>
          </div>
        </div>
        
        <div class="fund-rates">
          <div class="fund-yield ${isNegative ? 'negative' : ''}">
            ${isNegative ? '' : '+'}${fund.yield}%
          </div>
          <div class="fund-yield-label">1 Yr Return</div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', fundHtml);
  });
}
function initInvestmentCalculator() {
  const simAmount = document.getElementById('simAmount');
  const simYears = document.getElementById('simYears');
  const riskBtns = document.querySelectorAll('.risk-btn');
  const valProjection = document.getElementById('valProjection');
  
  let currentRisk = 'low';
  function updateCalculator() {
    if (!simAmount || !simYears || !valProjection) return;
    const principal = parseFloat(simAmount.value);
    if (isNaN(principal) || principal <= 0) {
      valProjection.textContent = '₦ 0.00';
      return;
    }
    const years = parseInt(simYears.value);
    
    // Low risk: 8%, Med risk: 12%, High risk: 18%
    const rateMap = { low: 0.08, med: 0.12, high: 0.18 };
    const rate = rateMap[currentRisk];
    // Compound Interest formula: A = P(1 + r)^t
    const futureValue = principal * Math.pow(1 + rate, years);
    valProjection.textContent = `₦ ${formatMoney(futureValue)}`;
    // Draw growth SVG sparkline
    drawSparkline(principal, futureValue, years);
  }
  // Draw simulated growth curve
  function drawSparkline(start, end, years) {
    const path = document.querySelector('.sparkline-path');
    const area = document.querySelector('.sparkline-area');
    if (!path || !area) return;
    const steps = 10;
    const rate = (end - start) / start;
    let points = [];
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const val = start * (1 + (rate * Math.pow(progress, 1.8))); // Curve the growth slightly
      const x = progress * 300;
      
      // Scale value to fit 100px height. 10px buffer top & bottom.
      const y = 90 - ((val - start) / (end - start)) * 80;
      points.push(`${x},${y}`);
    }
    const pathData = `M ${points.join(' L ')}`;
    path.setAttribute('d', pathData);
    const areaData = `${pathData} L 300,100 L 0,100 Z`;
    area.setAttribute('d', areaData);
  }
  // Wire event triggers
  if (simAmount) simAmount.addEventListener('input', updateCalculator);
  if (simYears) simYears.addEventListener('change', updateCalculator);
  
  riskBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      riskBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentRisk = btn.getAttribute('data-risk');
      updateCalculator();
    });
  });
  // Run initial calculator render
  updateCalculator();
}
// Payment Forms Switching and Transaction Execution
function initPayments() {
  const cards = document.querySelectorAll('.payment-option-card');
  const forms = document.querySelectorAll('.payment-form');
  const successScreen = document.getElementById('paymentSuccessScreen');
  const successMsgText = document.getElementById('successMsgText');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      
      const formId = card.getAttribute('data-payform');
      
      forms.forEach(f => f.classList.remove('active'));
      if (successScreen) successScreen.style.display = 'none';
      
      const targetForm = document.getElementById(`form-${formId}`);
      if (targetForm) targetForm.classList.add('active');
    });
  });
  // Reset checkout forms
  const resetBtn = document.getElementById('paymentResetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (successScreen) successScreen.style.display = 'none';
      
      // Active current form again
      const activeCard = document.querySelector('.payment-option-card.active');
      if (activeCard) {
        const formId = activeCard.getAttribute('data-payform');
        const form = document.getElementById(`form-${formId}`);
        if (form) {
          form.reset();
          form.classList.add('active');
        }
      }
    });
  }
  // Handle transfers submission
  const bankBtn = document.getElementById('submitBankTransferBtn');
  if (bankBtn) {
    bankBtn.addEventListener('click', () => {
      const amt = parseFloat(document.getElementById('btAmount').value);
      const acc = document.getElementById('btAccountNo').value.trim();
      const bank = document.getElementById('btBank').value;
      if (acc.length < 10 || isNaN(parseInt(acc))) {
        alert('Please enter a valid 10-digit account number.');
        return;
      }
      if (isNaN(amt) || amt < 100) {
        alert('Minimum transfer amount is ₦100.');
        return;
      }
      if (state.nairaBalance < amt) {
        alert('Insufficient wallet balance to perform transfer.');
        return;
      }
      state.nairaBalance -= amt;
      showSuccessScreen(`₦${formatMoney(amt)} successfully transferred to ${acc} (${bank}).`);
      saveState();
    });
  }
  // Handle bills payment submission
  const billBtn = document.getElementById('submitBillPayBtn');
  if (billBtn) {
    billBtn.addEventListener('click', () => {
      const category = document.getElementById('billCategory').value;
      const custId = document.getElementById('billCustomerNo').value.trim();
      const amt = parseFloat(document.getElementById('billAmount').value);
      if (!custId) {
        alert('Please enter your Customer/Smartcard ID.');
        return;
      }
      if (isNaN(amt) || amt <= 0) {
        alert('Please enter a valid payment amount.');
        return;
      }
      if (state.nairaBalance < amt) {
        alert('Insufficient balance to pay bill.');
        return;
      }
      state.nairaBalance -= amt;
      showSuccessScreen(`Utility payment of ₦${formatMoney(amt)} for ${category} (${custId}) was successful.`);
      saveState();
    });
  }
  // Handle airtime purchase submission
  const airtimeBtn = document.getElementById('submitAirtimeBtn');
  if (airtimeBtn) {
    airtimeBtn.addEventListener('click', () => {
      const network = document.getElementById('airNetwork').value;
      const phone = document.getElementById('airPhone').value.trim();
      const amt = parseFloat(document.getElementById('airAmount').value);
      if (phone.length < 10) {
        alert('Please enter a valid phone number.');
        return;
      }
      if (isNaN(amt) || amt < 50) {
        alert('Minimum airtime recharge amount is ₦50.');
        return;
      }
      if (state.nairaBalance < amt) {
        alert('Insufficient balance to purchase airtime.');
        return;
      }
      state.nairaBalance -= amt;
      showSuccessScreen(`Recharge of ₦${formatMoney(amt)} on ${phone} (${network}) succeeded.`);
      saveState();
    });
  }
  function showSuccessScreen(msg) {
    forms.forEach(f => f.classList.remove('active'));
    if (successScreen && successMsgText) {
      successMsgText.textContent = msg;
      successScreen.style.display = 'block';
    }
  }
}
// Cash Stash Action listeners
function initStashOps() {
  const moveBtn = document.getElementById('stashMoveWalletBtn');
  const fundBtn = document.getElementById('stashFundPlanBtn');
  const withdrawBtn = document.getElementById('stashWithdrawBtn');
  if (moveBtn) {
    moveBtn.addEventListener('click', () => {
      const amountStr = prompt(`Enter amount to move to Naira Balance Wallet (Available: ₦${formatMoney(state.stashBalance)}):`);
      if (amountStr === null) return;
      const amt = parseFloat(amountStr);
      if (isNaN(amt) || amt <= 0) {
        alert('Please enter a valid amount.');
        return;
      }
      if (state.stashBalance < amt) {
        alert('Insufficient stash balance.');
        return;
      }
      state.stashBalance -= amt;
      state.nairaBalance += amt;
      alert(`Success! Moved ₦${formatMoney(amt)} to Naira balance wallet.`);
      saveState();
    });
  }
  if (fundBtn) {
    fundBtn.addEventListener('click', () => {
      // Redirects to Save View tab
      const saveTabBtn = document.querySelector('.nav-item[data-tab="save"]');
      if (saveTabBtn) saveTabBtn.click();
    });
  }
  if (withdrawBtn) {
    withdrawBtn.addEventListener('click', () => {
      const amountStr = prompt(`Enter amount to withdraw to your bank account (Available: ₦${formatMoney(state.stashBalance)}):`);
      if (amountStr === null) return;
      const amt = parseFloat(amountStr);
      if (isNaN(amt) || amt <= 0) {
        alert('Please enter a valid amount.');
        return;
      }
      if (state.stashBalance < amt) {
        alert('Insufficient stash balance.');
        return;
      }
      state.stashBalance -= amt;
      alert(`Success! Withdrawal of ₦${formatMoney(amt)} has been queued to your bank account.`);
      saveState();
    });
  }
}
// Onboarding Nest Partner Joint
function initNestJoint() {
  const inviteBtn = document.getElementById('nestInviteBtn');
  const emailInput = document.getElementById('nestPartnerEmail');
  const inviteBox = document.getElementById('nestInviteBox');
  const linkedBox = document.getElementById('nestLinkedBox');
  const partnerEmailSpan = document.getElementById('partnerEmailSpan');
  if (inviteBtn && emailInput && inviteBox && linkedBox && partnerEmailSpan) {
    inviteBtn.addEventListener('click', () => {
      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!email || !emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      state.partnerEmail = email;
      partnerEmailSpan.textContent = email;
      inviteBox.style.display = 'none';
      linkedBox.style.display = 'block';
      
      alert(`Onboarding Success! Linked joint partner account: ${email}`);
      saveState();
    });
    // Hydrate joint partner UI on load if exists
    if (state.partnerEmail) {
      partnerEmailSpan.textContent = state.partnerEmail;
      inviteBox.style.display = 'none';
      linkedBox.style.display = 'block';
    }
  }
}
// Financial Literacy Quiz System
function initQuiz() {
  const options = document.querySelectorAll('.quiz-option-btn');
  const feedback = document.getElementById('quizFeedback');
  options.forEach(option => {
    option.addEventListener('click', () => {
      // Clear previous classes
      options.forEach(opt => {
        opt.classList.remove('correct', 'wrong');
        opt.disabled = true;
      });
      const isCorrect = option.getAttribute('data-correct') === 'true';
      if (isCorrect) {
        option.classList.add('correct');
        if (feedback) {
          feedback.style.color = 'var(--accent-green)';
          feedback.textContent = 'Correct! Mutual funds provide instant diversification and professional oversight, lowering risk for beginners.';
          feedback.style.display = 'block';
        }
      } else {
        option.classList.add('wrong');
        
        // Find correct option to highlight
        const correctOpt = Array.from(options).find(o => o.getAttribute('data-correct') === 'true');
        if (correctOpt) correctOpt.classList.add('correct');
        if (feedback) {
          feedback.style.color = 'var(--accent-red)';
          feedback.textContent = 'Incorrect. The primary benefit of mutual funds is diversification and professional management.';
          feedback.style.display = 'block';
        }
      }
    });
  });
}
// Referral Clipboard System
function initReferral() {
  const copyBtn = document.getElementById('copyRefCodeBtn');
  const codeText = document.getElementById('refCodeText');
  if (copyBtn && codeText) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeText.textContent).then(() => {
        copyBtn.classList.add('copied');
        copyBtn.textContent = 'Copied!';
        
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.textContent = 'Copy Code';
        }, 1500);
      }).catch(err => {
        console.error('Failed to copy to clipboard', err);
      });
    });
  }
}
// Accessible Modals Light-Dismiss Backdrop clicks check
function initModalsFallback() {
  const modals = document.querySelectorAll('dialog');
  
  modals.forEach(dialog => {
    // Declarative closedby="any" handles Esc key and dismisses in supported browsers.
    // Check prototype for closedBy to apply JS fallback for older/unsupported browsers (e.g. Safari).
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (!isDialogContent) {
          dialog.close();
        }
      });
    }
  });
}
// Entrypoint Setup
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initRouter();
  initAddCash();
  initPrivacy();
  initSavingsOps();
  renderMutualFunds();
  initInvestmentCalculator();
  initPayments();
  initStashOps();
  initNestJoint();
  initQuiz();
  initReferral();
  initModalsFallback();
  
  // First update calls
  updateUI();
});

//Onload Code
window.addEventListener('DOMContentLoaded', () => {

    fetchInfo();

});
