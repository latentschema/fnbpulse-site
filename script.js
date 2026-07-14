/**
 * ==========================================================================
 * fnbPulse JavaScript - Premium Interactive Core
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. HEADER SCROLL & MOBILE NAVIGATION
  // ==========================================
  const header = document.querySelector('.header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Change header styling on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Toggle mobile navigation menu
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Close mobile navigation when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Coming Soon modal (Log In links are not wired up yet)
  const comingSoonModal = document.getElementById('coming-soon-modal');
  const comingSoonClose = document.getElementById('coming-soon-close');
  const loginLinks = document.querySelectorAll('.login-link, .nav-link[href="https://app.fnbpulse.com"]');

  function openComingSoonModal() {
    comingSoonModal.classList.add('active');
    comingSoonModal.setAttribute('aria-hidden', 'false');
  }

  function closeComingSoonModal() {
    comingSoonModal.classList.remove('active');
    comingSoonModal.setAttribute('aria-hidden', 'true');
  }

  loginLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openComingSoonModal();
    });
  });

  if (comingSoonClose) {
    comingSoonClose.addEventListener('click', closeComingSoonModal);
  }

  if (comingSoonModal) {
    comingSoonModal.addEventListener('click', (e) => {
      if (e.target === comingSoonModal) {
        closeComingSoonModal();
      }
    });
  }


  // ==========================================
  // 2. INTERACTIVE PRODUCT SHOWCASE (TABS)
  // ==========================================
  const sidebarBtns = document.querySelectorAll('.sidebar-btn');
  const workspaceTabs = document.querySelectorAll('.workspace-tab');

  sidebarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons & tabs
      sidebarBtns.forEach(b => b.classList.remove('active'));
      workspaceTabs.forEach(t => t.classList.remove('active'));

      // Add active state to current button
      btn.classList.add('active');

      // Get target tab id and show it
      const tabTarget = btn.getAttribute('data-tab');
      const targetElement = document.getElementById(`tab-${tabTarget}`);
      if (targetElement) {
        targetElement.classList.add('active');
      }
    });
  });


  // ==========================================
  // 3. AI ADVISOR CHAT MODULE
  // ==========================================
  const chatMessages = document.getElementById('chat-messages');
  const chatUserInput = document.getElementById('chat-user-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const promptChips = document.querySelectorAll('.prompt-chip');

  // Realistic answers to pre-defined user questions
  const aiResponses = {
    'why did my food cost spike?': `I detected a **13.8% spike** in poultry unit pricing from your Soho supplier, **London Foods Ltd** (Fresh Chicken Breast increased from £5.40/kg to £6.15/kg).

**Recommendation:**
- Request a billing audit. Under your contract agreement, chicken is capped at **£5.50/kg**.
- Sourcing from alternate supplier (Vendor B) would preserve your **72% margin**.
- *Estimated annual recovery potential:* **£4,200**`,

    'which menu items are underpriced?': `Your **Ribeye Steak** is currently priced at **£24.50**, generating a **38% margin** (target: 45%). 

**Recommendation:**
- Since sales volume is exceptionally high (1,200 steaks sold monthly), raising the price to **£26.00** will not impact demand but will increase your gross profit by **£1,800/month**.
- Your **Vegan Cheese Board** is also a margin-sink (21% margin). Consider replacing the supplier or dropping the item.`,

    'find waste opportunities from yesterday.': `Yesterday's food waste spike was centered in your prep department. 

**Observations:**
- **32kg of Fresh Sourdough** was discarded at closing (value: **£96**).
- **Clover POS data** shows bread basket requests dropped by **42%** after 8 PM.

**Action Plan:**
- Adjust prep par levels down by **35%** after 6:00 PM for sourdough baking.
- *Estimated weekly savings:* **£250**`
  };

  // Helper: Append a message to the chat container
  function appendMessage(sender, text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isUser ? 'user-msg' : 'system-msg'}`;
    
    // Convert basic double asterisks to bold tag for rich rendering
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    msgDiv.innerHTML = `
      <div class="msg-sender">${sender}</div>
      <div class="msg-content">${formattedText}</div>
    `;
    
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Handle sending a user message
  function handleSendMessage(customText = '') {
    const text = customText || chatUserInput.value.trim();
    if (!text) return;

    // Send User Message
    appendMessage('You', text, true);
    if (!customText) chatUserInput.value = '';

    // Show AI typing simulation
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message system-msg';
    typingDiv.innerHTML = `<div class="msg-content"><em>AI is calculating...</em></div>`;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Generate responsive reply
    setTimeout(() => {
      // Remove typing text
      typingDiv.remove();
      
      const lowerText = text.toLowerCase().trim();
      let reply = '';
      
      if (aiResponses[lowerText]) {
        reply = aiResponses[lowerText];
      } else {
        reply = `I've analyzed your question about **"${text}"**. 

Based on current Clover POS logs and inventory invoicing trends:
- Sales for related categories are holding stable.
- Sourcing costs are currently within target thresholds.
- We recommend linking additional invoice directories via Clover POS to see more refined invoice details.`;
      }
      
      appendMessage('fnbPulse 360 AI Advisor', reply, false);
    }, 1200);
  }

  // Click on prompt chip fills and sends
  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const question = chip.getAttribute('data-question');
      handleSendMessage(question);
    });
  });

  // Clicking Send or pressing Enter
  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', () => handleSendMessage());
  }
  if (chatUserInput) {
    chatUserInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    });
  }


  // ==========================================
  // 4. INTERACTIVE ROI CALCULATOR
  // ==========================================
  const revenueSlider = document.getElementById('monthly-revenue');
  const foodCostSlider = document.getElementById('food-cost-pct');
  const revenueValDisplay = document.getElementById('revenue-val');
  const foodCostValDisplay = document.getElementById('food-cost-val');

  const calcTotalSaved = document.getElementById('calc-total-saved');
  const calcWaste = document.getElementById('calc-waste');
  const calcSupplier = document.getElementById('calc-supplier');
  const calcMenu = document.getElementById('calc-menu');

  // Helper: Format numbers to GBP currency style
  function formatCurrency(num) {
    return '£' + Math.round(num).toLocaleString('en-GB');
  }

  // Calculate ROI outcomes based on slider values
  function updateROICalculations() {
    const revenue = parseFloat(revenueSlider.value);
    const foodCostPct = parseFloat(foodCostSlider.value) / 100;

    // Benchmarks:
    // 1. Waste savings = 1.8% of Revenue
    // 2. Supplier savings = 2.4% of Food Spend (Revenue * Food Cost %)
    // 3. Menu optimisation upside = 1.7% of Revenue
    const wasteSavings = revenue * 0.018;
    const foodSpend = revenue * foodCostPct;
    const supplierSavings = foodSpend * 0.024;
    const menuSavings = revenue * 0.017;
    const totalSavings = wasteSavings + supplierSavings + menuSavings;

    // Update labels in real-time
    revenueValDisplay.textContent = formatCurrency(revenue);
    foodCostValDisplay.textContent = `${Math.round(foodCostPct * 100)}%`;

    // Update calculations output
    calcTotalSaved.textContent = formatCurrency(totalSavings);
    calcWaste.textContent = `${formatCurrency(wasteSavings)} /mo`;
    calcSupplier.textContent = `${formatCurrency(supplierSavings)} /mo`;
    calcMenu.textContent = `${formatCurrency(menuSavings)} /mo`;
  }

  if (revenueSlider && foodCostSlider) {
    revenueSlider.addEventListener('input', updateROICalculations);
    foodCostSlider.addEventListener('input', updateROICalculations);
    updateROICalculations(); // initial run
  }


  // ==========================================
  // 5. INTERACTIVE MODAL (FREE PROFIT HEALTH CHECK)
  // ==========================================
  const openModalBtns = document.querySelectorAll('.open-check-modal');
  const modalOverlay = document.getElementById('check-modal');
  const closeModalBtn = document.getElementById('modal-close');
  const form1 = document.getElementById('health-form-1');
  const form2 = document.getElementById('health-form-2');
  const restartModalBtn = document.getElementById('restart-modal-btn');
  const claimReportBtn = document.getElementById('claim-report-btn');

  const stepPane1 = document.getElementById('step-pane-1');
  const stepPane2 = document.getElementById('step-pane-2');
  const stepPane3 = document.getElementById('step-pane-3');

  const prog1 = document.getElementById('prog-1');
  const prog2 = document.getElementById('prog-2');
  const prog3 = document.getElementById('prog-3');

  const reportResName = document.getElementById('report-res-name');
  const reportSavingsAmount = document.getElementById('report-savings-amount');
  const reportNarrativeText = document.getElementById('report-narrative-text');

  // Open modal
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modalOverlay.classList.add('active');
      modalOverlay.setAttribute('aria-hidden', 'false');
      resetModalState();
    });
  });

  // Close modal
  function closeModal() {
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Close on backdrop click
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // Reset modal step states back to Step 1
  function resetModalState() {
    stepPane1.classList.add('active');
    stepPane2.classList.remove('active');
    stepPane3.classList.remove('active');

    prog1.className = 'progress-step active';
    prog2.className = 'progress-step';
    prog3.className = 'progress-step';
  }

  // Form Step 1: Restaurant Name Submitted
  if (form1) {
    form1.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Save name for later
      const restName = document.getElementById('restaurant-name').value;
      localStorage.setItem('fnb_rest_name', restName);

      // Transition visual step bar
      prog1.className = 'progress-step completed';
      prog2.className = 'progress-step active';

      // Transition slide panels
      stepPane1.classList.remove('active');
      stepPane2.classList.add('active');
    });
  }

  // Form Step 2: Integrations Selected & Draft Report Generated
  if (form2) {
    form2.addEventListener('submit', (e) => {
      e.preventDefault();

      const restName = localStorage.getItem('fnb_rest_name') || 'Your Restaurant';
      const city = document.getElementById('restaurant-city').value || 'London';

      // Capture currently active inputs from the ROI sliders to make report contextual
      const currentRevenue = parseFloat(revenueSlider.value);
      const foodCostPct = parseFloat(foodCostSlider.value) / 100;
      
      // Calculate customized potential savings
      const wasteSavings = currentRevenue * 0.018;
      const foodSpend = currentRevenue * foodCostPct;
      const supplierSavings = foodSpend * 0.024;
      const menuSavings = currentRevenue * 0.017;
      const totalSavings = wasteSavings + supplierSavings + menuSavings;

      // Populate Step 3 Report Panel with custom values
      if (reportResName) reportResName.textContent = restName;
      if (reportSavingsAmount) reportSavingsAmount.textContent = formatCurrency(totalSavings);
      
      if (reportNarrativeText) {
        reportNarrativeText.innerHTML = `Based on standard restaurant benchmarks in <strong>${city}</strong>, restaurants connected to Clover & Xero with monthly revenues around <strong>${formatCurrency(currentRevenue)}</strong> suffer from unrecognized leaks. 
        <br><br>
        By integrating with fnbPulse 360, we estimate you can reclaim <strong>${formatCurrency(wasteSavings)}</strong> from prep waste, <strong>${formatCurrency(supplierSavings)}</strong> from vendor invoice discrepancies, and <strong>${formatCurrency(menuSavings)}</strong> by adjusting underpriced dishes.`;
      }

      // Transition visual steps
      prog2.className = 'progress-step completed';
      prog3.className = 'progress-step active completed';

      // Transition panels
      stepPane2.classList.remove('active');
      stepPane3.classList.add('active');
    });
  }

  // Back button on Step 2
  const backTo1 = document.getElementById('back-to-1');
  if (backTo1) {
    backTo1.addEventListener('click', () => {
      prog1.className = 'progress-step active';
      prog2.className = 'progress-step';
      stepPane2.classList.remove('active');
      stepPane1.classList.add('active');
    });
  }

  // Restart Check inside results page
  if (restartModalBtn) {
    restartModalBtn.addEventListener('click', () => {
      resetModalState();
    });
  }

  // Final Action button on results
  if (claimReportBtn) {
    claimReportBtn.addEventListener('click', () => {
      alert("Demo integration successful! Redirecting to secure sandbox verification portal...");
      closeModal();
    });
  }

});

// ==========================================
// 6. GLOBAL ACTION HELPER: RESOLVING ALERTS
// ==========================================
window.resolveAlert = function(alertId, annualValue) {
  const alertElement = document.getElementById(alertId);
  if (!alertElement) return;

  // Visual success feedback
  alertElement.classList.add('resolved');
  
  // Transform the button into a "Resolved ✓" state
  const actionBtn = alertElement.querySelector('.btn-action-resolve');
  if (actionBtn) {
    actionBtn.textContent = 'Resolved ✓';
    actionBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    actionBtn.style.color = 'var(--text-muted)';
    actionBtn.style.cursor = 'default';
    actionBtn.disabled = true;
  }

  // Briefly notify user of recovered capital
  const formattedSaving = '£' + annualValue.toLocaleString('en-GB');
  const detailsContainer = alertElement.querySelector('.alert-details');
  const alertToast = document.createElement('div');
  alertToast.style.fontSize = '12px';
  alertToast.style.color = 'var(--accent)';
  alertToast.style.marginTop = '10px';
  alertToast.style.fontWeight = '700';
  alertToast.innerHTML = `★ SUCCESS: Recaptured ${formattedSaving} in annual profit leaks!`;
  
  detailsContainer.appendChild(alertToast);
};
