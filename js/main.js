// ==================== APPLICATION STATE ====================
let currentUser = null;
let expenses = [];
let subscriptions = [];
let currentStep = 1;
let totalSteps = 4;
let userData = {};

// ==================== PAGE MANAGEMENT ====================
function showPage(pageId) {
    // Update active page
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    
    // Update navigation
    updateNavigation(pageId);
    
    // Update user info
    updateUserInfo();
    
    // Load page-specific data
    loadPageData(pageId);
}

function updateNavigation(pageId) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${pageId}` || 
            link.onclick?.toString().includes(pageId)) {
            link.classList.add('active');
        }
    });
}

function updateUserInfo() {
    if (currentUser) {
        const name = currentUser.name;
        const avatar = name.charAt(0).toUpperCase();
        
        // Update all user info elements
        document.querySelectorAll('.user-name').forEach(el => {
            el.textContent = name;
        });
        
        document.querySelectorAll('.user-avatar').forEach(el => {
            el.textContent = avatar;
        });
        
        if (document.getElementById('greetingName')) {
            document.getElementById('greetingName').textContent = name;
        }
    }
}

function loadPageData(pageId) {
    switch(pageId) {
        case 'dashboardPage':
            loadDashboardData();
            break;
        case 'expensePage':
            loadExpenses();
            break;
        case 'subscriptionPage':
            loadSubscriptions();
            break;
        case 'creditScorePage':
            animateScore();
            break;
        case 'frankAIPage':
            loadFrankSuggestions();
            break;
    }
}

// ==================== ONBOARDING ====================
function startOnboarding() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('onboardingModal').classList.add('active');
    currentStep = 1;
    updateStep();
}

function updateStep() {
    document.querySelectorAll('.onboarding-step').forEach(step => {
        step.classList.remove('active');
    });
    
    document.getElementById(`step${currentStep}`).classList.add('active');
    
    document.querySelectorAll('.step-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index + 1 === currentStep);
    });
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.disabled = currentStep === 1;
    if (nextBtn) nextBtn.innerHTML = currentStep === totalSteps ? 'Complete Setup' : 'Next';
}

function nextStep() {
    if (!validateStep(currentStep)) return;
    
    if (currentStep < totalSteps) {
        currentStep++;
        updateStep();
    } else {
        completeOnboarding();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStep();
    }
}

function validateStep(step) {
    switch(step) {
        case 2:
            const consent1 = document.getElementById('consent1');
            if (consent1 && !consent1.checked) {
                showAlert('You must consent to basic data processing to use BeFrank.');
                return false;
            }
            return true;
            
        case 3:
            const consent4 = document.getElementById('consent4');
            const consent5 = document.getElementById('consent5');
            if ((consent4 && !consent4.checked) || (consent5 && !consent5.checked)) {
                showAlert('You must acknowledge the AI classification risks and educational purpose.');
                return false;
            }
            return true;
            
        case 4:
            const name = document.getElementById('userNameInput')?.value.trim();
            const email = document.getElementById('userEmailInput')?.value.trim();
            const password = document.getElementById('userPasswordInput')?.value.trim();
            
            if (!name || !email || !password) {
                showAlert('Please fill in all account details.');
                return false;
            }
            
            if (!validateEmail(email)) {
                showAlert('Please enter a valid email address.');
                return false;
            }
            
            userData = {
                name: name,
                email: email,
                preferences: {
                    telecomData: document.getElementById('consent3')?.checked || false,
                    bankData: document.getElementById('consent2')?.checked || false
                }
            };
            return true;
            
        default:
            return true;
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function completeOnboarding() {
    // Save user data
    localStorage.setItem('beFrankUser', JSON.stringify(userData));
    localStorage.setItem('beFrankExpenses', JSON.stringify([]));
    localStorage.setItem('beFrankSubscriptions', JSON.stringify([]));
    
    // Initialize current user
    currentUser = userData;
    
    // Close onboarding
    document.getElementById('onboardingModal')?.classList.remove('active');
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}

// ==================== DASHBOARD ====================
function loadDashboardData() {
    expenses = JSON.parse(localStorage.getItem('beFrankExpenses')) || [];
    subscriptions = JSON.parse(localStorage.getItem('beFrankSubscriptions')) || [];
    
    // Update counts
    const expenseCount = document.getElementById('expenseCount');
    const subscriptionCount = document.getElementById('subscriptionCount');
    
    if (expenseCount) {
        expenseCount.textContent = `${expenses.length} Expenses`;
    }
    
    if (subscriptionCount) {
        const activeSubs = subscriptions.filter(s => s.active).length;
        subscriptionCount.textContent = `${activeSubs} Found`;
    }
    
    // Calculate monthly spending
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlySpending = expenses.reduce((total, expense) => {
        const expenseDate = new Date(expense.date);
        if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
            return total + expense.amount;
        }
        return total;
    }, 0);
    
    // Find top category
    const categoryTotals = {};
    expenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    let topCategory = '-';
    let maxAmount = 0;
    for (const [category, amount] of Object.entries(categoryTotals)) {
        if (amount > maxAmount) {
            maxAmount = amount;
            topCategory = category;
        }
    }
    
    // Update insights
    const monthlySpendingEl = document.getElementById('monthlySpending');
    const topCategoryEl = document.getElementById('topCategory');
    const savingsRateEl = document.getElementById('savingsRate');
    const billSavingsEl = document.getElementById('billSavings');
    
    if (monthlySpendingEl) monthlySpendingEl.textContent = `AED ${monthlySpending.toFixed(2)}`;
    if (topCategoryEl) topCategoryEl.textContent = topCategory;
    if (savingsRateEl) savingsRateEl.textContent = '15%'; // Placeholder
    if (billSavingsEl) billSavingsEl.textContent = 'AED 0'; // Placeholder
}

// ==================== EXPENSE TRACKING ====================
function loadExpenses() {
    expenses = JSON.parse(localStorage.getItem('beFrankExpenses')) || [];
    const expenseList = document.getElementById('expenseList');
    const totalExpenses = document.getElementById('totalExpenses');
    const totalExpenseAmount = document.getElementById('totalExpenseAmount');
    const monthlyExpenseAmount = document.getElementById('monthlyExpenseAmount');
    
    if (!expenseList) return;
    
    if (totalExpenses) totalExpenses.textContent = `${expenses.length} Expenses`;
    
    if (expenses.length === 0) {
        expenseList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-receipt"></i>
                <h3>No expenses added yet</h3>
                <p>Add your first expense to start tracking!</p>
            </div>
        `;
        if (totalExpenseAmount) totalExpenseAmount.textContent = 'AED 0';
        if (monthlyExpenseAmount) monthlyExpenseAmount.textContent = 'AED 0';
        return;
    }
    
    expenseList.innerHTML = '';
    let total = 0;
    let monthlyTotal = 0;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(expense => {
        const expenseDate = new Date(expense.date);
        if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
            monthlyTotal += expense.amount;
        }
        total += expense.amount;
        
        const expenseItem = document.createElement('div');
        expenseItem.className = 'expense-item';
        expenseItem.innerHTML = `
            <div class="expense-info">
                <div>
                    <span class="expense-amount">AED ${expense.amount.toFixed(2)}</span>
                    <span class="expense-category" onclick="editExpenseCategory(${expense.id})">${expense.category}</span>
                </div>
                <div class="expense-description">${expense.description}</div>
                <div class="expense-meta">
                    ${expenseDate.toLocaleDateString()} • AI Suggested: ${expense.aiCategory}
                </div>
            </div>
            <div class="expense-actions">
                <button class="action-btn edit" onclick="editExpense(${expense.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteExpense(${expense.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        expenseList.appendChild(expenseItem);
    });
    
    if (totalExpenseAmount) totalExpenseAmount.textContent = `AED ${total.toFixed(2)}`;
    if (monthlyExpenseAmount) monthlyExpenseAmount.textContent = `AED ${monthlyTotal.toFixed(2)}`;
}

function saveExpense() {
    const desc = document.getElementById('expenseDescription')?.value.trim();
    const amount = parseFloat(document.getElementById('expenseAmount')?.value);
    const category = document.getElementById('expenseCategory')?.value;
    const date = document.getElementById('expenseDate')?.value || new Date().toISOString().split('T')[0];
    
    if (!desc || isNaN(amount) || amount <= 0) {
        showAlert('Please enter a valid description and amount.', 'error');
        return;
    }
    
    const aiCategory = getAICategory(desc);
    const finalCategory = category || aiCategory;
    
    const expense = {
        id: Date.now(),
        description: desc,
        amount: amount,
        category: finalCategory,
        aiCategory: aiCategory,
        date: date,
        active: true
    };
    
    expenses.push(expense);
    localStorage.setItem('beFrankExpenses', JSON.stringify(expenses));
    
    // Clear form
    document.getElementById('expenseDescription').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseCategory').value = '';
    document.getElementById('expenseDate').value = '';
    
    // Show success message
    showAlert(`Expense added! AI suggested: ${aiCategory}. You can change it if needed.`, 'success');
    
    // Reload expenses
    loadExpenses();
    
    // Update dashboard
    loadDashboardData();
}

function getAICategory(description) {
    const desc = description.toLowerCase();
    const categories = {
        Food: ['starbucks', 'coffee', 'restaurant', 'food', 'cafe', 'meal', 'dining', 'lunch', 'dinner'],
        Transport: ['uber', 'careem', 'taxi', 'transport', 'bus', 'metro', 'fuel', 'petrol', 'parking'],
        Shopping: ['amazon', 'noon', 'shopping', 'mall', 'store', 'market', 'clothes', 'fashion', 'electronics'],
        Entertainment: ['netflix', 'starzplay', 'movie', 'cinema', 'game', 'concert', 'music', 'theater', 'sports'],
        Bills: ['etisalat', 'du', 'bill', 'dewa', 'empower', 'utility', 'internet', 'mobile', 'electricity'],
        Education: ['book', 'course', 'university', 'education', 'stationery', 'tuition', 'textbook', 'workshop'],
        Healthcare: ['hospital', 'doctor', 'medicine', 'pharmacy', 'clinic', 'dental', 'medical', 'checkup']
    };
    
    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => desc.includes(keyword))) {
            return category;
        }
    }
    
    return 'Other';
}

function editExpenseCategory(id) {
    const expense = expenses.find(e => e.id === id);
    if (!expense) return;
    
    const newCategory = prompt('Enter new category (AI suggested: ' + expense.aiCategory + '):', expense.category);
    if (newCategory && newCategory !== expense.category) {
        expense.category = newCategory;
        localStorage.setItem('beFrankExpenses', JSON.stringify(expenses));
        loadExpenses();
        showAlert('Category updated! Remember: You have final control over categorization.', 'success');
    }
}

function editExpense(id) {
    const expense = expenses.find(e => e.id === id);
    if (!expense) return;
    
    const newAmount = prompt('Edit amount (AED):', expense.amount);
    if (newAmount && !isNaN(newAmount)) {
        expense.amount = parseFloat(newAmount);
        localStorage.setItem('beFrankExpenses', JSON.stringify(expenses));
        loadExpenses();
        showAlert('Expense amount updated!', 'success');
    }
}

function deleteExpense(id) {
    if (confirm('Delete this expense? This action cannot be undone.')) {
        expenses = expenses.filter(e => e.id !== id);
        localStorage.setItem('beFrankExpenses', JSON.stringify(expenses));
        loadExpenses();
        
        // Update dashboard
        loadDashboardData();
        
        showAlert('Expense deleted! PDPL compliance: Data removed from our records.', 'success');
    }
}

// ==================== BILL SHAVING ====================
function loadBillShavingOptions() {
    const provider = document.getElementById('billProvider')?.value;
    const amount = parseFloat(document.getElementById('billAmountInput')?.value);
    const dueDate = document.getElementById('billDueDate')?.value;
    
    if (!provider || isNaN(amount) || amount <= 0) {
        showAlert('Please select a provider and enter a valid bill amount.', 'error');
        return;
    }
    
    const providerNames = {
        'etisalat': 'Etisalat Mobile Bill',
        'du': 'Du Mobile Bill',
        'dewa': 'DEWA Electricity Bill',
        'dewa_water': 'DEWA Water Bill',
        'empower': 'Empower Cooling Charges'
    };
    
    const billProviderName = document.getElementById('billProviderName');
    const displayBillAmount = document.getElementById('displayBillAmount');
    const displayDueDate = document.getElementById('displayDueDate');
    const shavingOptions = document.getElementById('shavingOptions');
    const billDisplaySection = document.getElementById('billDisplaySection');
    const noBillSelected = document.getElementById('noBillSelected');
    
    if (billProviderName) billProviderName.textContent = providerNames[provider] || 'Bill';
    if (displayBillAmount) displayBillAmount.textContent = `AED ${amount.toFixed(2)}`;
    if (displayDueDate) displayDueDate.textContent = dueDate || 'Not specified';
    
    if (shavingOptions) {
        shavingOptions.innerHTML = '';
        
        const options = [
            { icon: 'fas fa-ad', title: 'Watch 3 Short Ads', reduction: 15, time: '5 minutes' },
            { icon: 'fas fa-poll', title: 'Complete Survey', reduction: 25, time: '10 minutes' },
            { icon: 'fas fa-video', title: 'Watch Product Demo', reduction: 10, time: '3 minutes' },
            { icon: 'fas fa-gamepad', title: 'Play Mini Game', reduction: 8, time: '7 minutes' }
        ];
        
        options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'shaving-option';
            optionDiv.innerHTML = `
                <i class="${option.icon}"></i>
                <h4>${option.title}</h4>
                <p style="color: var(--dune-success); font-weight: 600;">Save AED ${option.reduction}</p>
                <p style="font-size: 0.9rem; color: var(--dune-dark); opacity: 0.7;">${option.time}</p>
                <button class="cta-btn secondary" style="margin-top: 0.5rem; width: 100%;" 
                        onclick="startBillShaving(${option.reduction}, '${option.title}')">
                    Start
                </button>
            `;
            shavingOptions.appendChild(optionDiv);
        });
    }
    
    if (billDisplaySection) billDisplaySection.style.display = 'block';
    if (noBillSelected) noBillSelected.style.display = 'none';
}

function startBillShaving(amount, method) {
    showAlert(`Starting: ${method}\n\nAfter completion, our partner will apply AED ${amount} credit to your bill.\n\nLegal: Partner executes the credit, not BeFrank. Check your next billing statement.`, 'success');
    
    // Simulate completion
    setTimeout(() => {
        showAlert(`Congratulations! You earned AED ${amount} bill credit.\n\nPartner will apply this to your next bill. Remember: This is partner-led only.`, 'success');
    }, 2000);
}

// ==================== SUBSCRIPTION STALKER ====================
function loadSubscriptions() {
    subscriptions = JSON.parse(localStorage.getItem('beFrankSubscriptions')) || [];
    const subscriptionList = document.getElementById('subscriptionList');
    const monthlySavings = document.getElementById('monthlySavings');
    const yearlySavings = document.getElementById('yearlySavings');
    const subscriptionCount = document.getElementById('subscriptionCount');
    
    if (!subscriptionList) return;
    
    if (subscriptions.length === 0) {
        subscriptionList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No Subscriptions Found</h3>
                <p>Click "Scan Now" to find your subscriptions</p>
            </div>
        `;
        if (monthlySavings) monthlySavings.textContent = 'AED 0';
        if (yearlySavings) yearlySavings.textContent = 'AED 0';
        if (subscriptionCount) subscriptionCount.textContent = '0';
        return;
    }
    
    subscriptionList.innerHTML = '';
    let monthlyTotal = 0;
    let activeCount = 0;
    
    subscriptions.sort((a, b) => b.amount - a.amount).forEach(sub => {
        if (sub.active) {
            monthlyTotal += sub.amount;
            activeCount++;
        }
        
        const subItem = document.createElement('div');
        subItem.className = 'subscription-item';
        subItem.innerHTML = `
            <div class="subscription-info">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <strong>${sub.name}</strong>
                    <span class="subscription-amount">AED ${sub.amount}/month</span>
                </div>
                <div style="font-size: 0.9rem; color: ${sub.active ? 'var(--dune-success)' : 'var(--dune-warning)'};">
                    ${sub.active ? 'Active' : 'Inactive'} • Next charge: ${sub.nextCharge}
                </div>
                <div style="font-size: 0.8rem; color: var(--dune-gold); margin-top: 0.3rem;">
                    Yearly: AED ${(sub.amount * 12).toFixed(2)}
                </div>
            </div>
            <div class="subscription-actions">
                <button class="action-btn ${sub.active ? 'delete' : 'edit'}" 
                        onclick="${sub.active ? `cancelSubscription(${sub.id})` : `reactivateSubscription(${sub.id})`}">
                    <i class="fas ${sub.active ? 'fa-ban' : 'fa-redo'}"></i>
                </button>
            </div>
        `;
        subscriptionList.appendChild(subItem);
    });
    
    if (monthlySavings) monthlySavings.textContent = `AED ${monthlyTotal.toFixed(2)}`;
    if (yearlySavings) yearlySavings.textContent = `AED ${(monthlyTotal * 12).toFixed(2)}`;
    if (subscriptionCount) subscriptionCount.textContent = activeCount;
}

function scanForSubscriptions() {
    // Simulate subscription discovery
    const discoveredSubs = [
        { id: 1, name: 'Netflix', amount: 55, active: true, nextCharge: '2024-02-15' },
        { id: 2, name: 'Starzplay', amount: 39, active: true, nextCharge: '2024-02-10' },
        { id: 3, name: 'Uber One', amount: 20, active: true, nextCharge: '2024-02-05' },
        { id: 4, name: 'Amazon Prime', amount: 16, active: true, nextCharge: '2024-02-20' },
        { id: 5, name: 'Adobe Creative Cloud', amount: 95, active: false, nextCharge: 'Expired' }
    ];
    
    subscriptions = discoveredSubs;
    localStorage.setItem('beFrankSubscriptions', JSON.stringify(subscriptions));
    
    loadSubscriptions();
    
    // Update dashboard
    loadDashboardData();
    
    showAlert(`Found ${discoveredSubs.length} subscriptions! ${discoveredSubs.filter(s => s.active).length} are active.`, 'success');
}

function cancelSubscription(id) {
    const subscription = subscriptions.find(s => s.id === id);
    if (!subscription) return;
    
    if (confirm(`Cancel ${subscription.name} subscription? You'll save AED ${subscription.amount}/month.`)) {
        subscription.active = false;
        subscription.nextCharge = 'Cancelled';
        localStorage.setItem('beFrankSubscriptions', JSON.stringify(subscriptions));
        loadSubscriptions();
        
        // Update dashboard
        loadDashboardData();
        
        showAlert(`${subscription.name} cancelled! For supported services, we provide cancellation confirmation.`, 'success');
    }
}

function reactivateSubscription(id) {
    const subscription = subscriptions.find(s => s.id === id);
    if (!subscription) return;
    
    if (confirm(`Reactivate ${subscription.name} for AED ${subscription.amount}/month?`)) {
        subscription.active = true;
        subscription.nextCharge = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        localStorage.setItem('beFrankSubscriptions', JSON.stringify(subscriptions));
        loadSubscriptions();
        showAlert(`${subscription.name} reactivated!`, 'success');
    }
}

// ==================== CREDIT SCORE ====================
function animateScore() {
    const progressCircle = document.querySelector('.score-circle-progress');
    if (!progressCircle) return;
    
    const progress = 72; // 7.2 out of 10
    const circumference = 565;
    const offset = circumference - (progress / 100 * circumference);
    
    setTimeout(() => {
        progressCircle.style.strokeDashoffset = offset;
    }, 500);
}

function editReadinessFactors() {
    const factors = [
        'Telecom Payments',
        'Academic Consistency',
        'App Engagement',
        'Expense Patterns',
        'Savings Rate',
        'Bill Payment History'
    ];
    
    const selected = prompt('Edit readiness factors (comma-separated):\n' + factors.join(', '), factors.slice(0, 4).join(', '));
    
    if (selected) {
        showAlert('Readiness factors updated! Remember: This is educational only, not a real credit score.', 'success');
    }
}

// ==================== UTILITIES ====================
function showAlert(message, type = 'error') {
    // Remove existing alerts
    document.querySelectorAll('.alert').forEach(alert => alert.remove());
    
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add to body
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}

function scrollToFeatures() {
    const featuresSection = document.getElementById('featuresSection');
    if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function showUserMenu() {
    const action = confirm('User Menu\n\n1. View PDPL Settings\n2. Delete My Data\n3. Logout\n\nCancel to close');
    if (action) {
        const choice = prompt('Enter choice (1-3):');
        switch(choice) {
            case '1':
                showPDPLInfo();
                break;
            case '2':
                deleteUserData();
                break;
            case '3':
                logout();
                break;
        }
    }
}

function showPDPLInfo() {
    alert('UAE PDPL Compliance:\n\n• Explicit consent obtained for all data processing\n• Right to access, edit, and delete data\n• Data stored for max 24 months\n• No data sharing without additional consent\n• Bank-level security encryption');
}

function deleteUserData() {
    if (confirm('Delete all your data? This cannot be undone.')) {
        localStorage.removeItem('beFrankUser');
        localStorage.removeItem('beFrankExpenses');
        localStorage.removeItem('beFrankSubscriptions');
        currentUser = null;
        showAlert('All data deleted. You will be logged out.', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

function logout() {
    showAlert('Logged out successfully.', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function showECBInfo() {
    alert('Emirates Credit Bureau (ECB)\n\n• Established by Federal Law No. 6 of 2010\n• Official credit authority in UAE\n• Banks required to use ECB for credit assessment\n• BeFrank readiness indicator is NOT an ECB score');
}

function showPartnerAgreements() {
    alert('Partner Agreements:\n\n• Bill shaving partners apply credits directly\n• No money handled by BeFrank\n• Partners are UAE-licensed entities\n• Separate terms apply for each partner');
}

function showFeature(featureName) {
    const features = {
        'savings': 'Saving Goals: Set targets with AI-guided assistance to help you achieve financial goals.',
        'bill-split': 'Bill Splitting (Premium): Split bills with roommates, track who owes what in real time.',
        'card-chooser': 'Card Chooser (Premium): AI suggests best card for each transaction with offer aggregation.',
        'net-worth': 'Net Worth Tracking: Calculate total assets minus liabilities with historical graphs.',
        'debt': 'Debt Repayment Planning (Premium): Plan debt payoff with Snowball or Avalanche methods.'
    };
    
    if (features[featureName]) {
        alert(`Feature: ${featureName.replace('-', ' ').toUpperCase()}\n\n${features[featureName]}\n\n${featureName.includes('premium') ? 'This is a premium feature available in Budget+ or Student+ plans.' : ''}`);
    }
}

function generateReport() {
    showAlert('Monthly report generated! Frank will discuss your financial insights with you.', 'success');
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    // Check for existing user
    const savedUser = localStorage.getItem('beFrankUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        expenses = JSON.parse(localStorage.getItem('beFrankExpenses')) || [];
        subscriptions = JSON.parse(localStorage.getItem('beFrankSubscriptions')) || [];
        updateUserInfo();
    }
    
    // Set default date for forms
    const today = new Date().toISOString().split('T')[0];
    const expenseDate = document.getElementById('expenseDate');
    const billDueDate = document.getElementById('billDueDate');
    
    if (expenseDate) expenseDate.value = today;
    if (billDueDate) billDueDate.value = today;
    
    // Add animation to cards
    document.querySelectorAll('.dashboard-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Initialize page data based on current page
    const currentPage = document.querySelector('.page.active');
    if (currentPage) {
        loadPageData(currentPage.id);
    }
});

// ==================== PREMIUM FEATURES MANAGEMENT ====================
let userSubscription = {
    plan: 'free', // 'free', 'student', 'wealth'
    trialEnd: null,
    features: {
        billSplitting: false,
        cardChooser: false,
        debtPlanning: false,
        scamTraining: false,
        bankMatching: false,
        budgetPlus: false
    }
};

function checkPremiumAccess(feature) {
    if (!userSubscription.features[feature]) {
        showAlert(`This feature requires ${userSubscription.plan === 'free' ? 'a premium subscription' : 'Frank Wealth plan'}.`, 'error');
        showUpgradeModal(feature);
        return false;
    }
    return true;
}

function showUpgradeModal(feature) {
    const featureNames = {
        'billSplitting': 'Bill Splitting',
        'cardChooser': 'Card Chooser',
        'debtPlanning': 'Debt Planning',
        'scamTraining': 'Scam Training',
        'bankMatching': 'Smart Bank Matching',
        'budgetPlus': 'Budget+ Features'
    };
    
    const modal = document.createElement('div');
    modal.className = 'upgrade-modal active';
    modal.innerHTML = `
        <div class="upgrade-container">
            <div class="upgrade-header">
                <h3><i class="fas fa-crown"></i> Upgrade Required</h3>
                <button class="close-upgrade" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="upgrade-content">
                <div class="upgrade-icon">
                    <i class="fas fa-lock"></i>
                </div>
                <h4>${featureNames[feature]} is a Premium Feature</h4>
                <p>Unlock this feature and more with our premium plans:</p>
                
                <div class="upgrade-options">
                    <div class="upgrade-option">
                        <h5>Frank+ Student</h5>
                        <div class="price">AED 19<span>/month</span></div>
                        <ul>
                            <li><i class="fas fa-check"></i> Bill Splitting</li>
                            <li><i class="fas fa-check"></i> AI Assistant</li>
                            <li><i class="fas fa-check"></i> Subscription Stalker</li>
                            <li><i class="fas fa-check"></i> Credit Readiness</li>
                        </ul>
                        <button class="upgrade-btn" onclick="upgradePlan('student')">
                            Upgrade Now
                        </button>
                    </div>
                    
                    <div class="upgrade-option featured">
                        <div class="popular-tag">Most Popular</div>
                        <h5>Frank Wealth</h5>
                        <div class="price">AED 29<span>/month</span></div>
                        <ul>
                            <li><i class="fas fa-check"></i> All Student+ Features</li>
                            <li><i class="fas fa-check"></i> ${featureNames[feature]}</li>
                            <li><i class="fas fa-check"></i> Scam Training</li>
                            <li><i class="fas fa-check"></i> Smart Bank Matching</li>
                        </ul>
                        <button class="upgrade-btn primary" onclick="upgradePlan('wealth')">
                            Get Frank Wealth
                        </button>
                    </div>
                </div>
                
                <div class="trial-offer">
                    <i class="fas fa-gift"></i>
                    <span>Start with 7-day free trial on any premium plan</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function upgradePlan(plan) {
    const planNames = {
        'student': 'Frank+ Student',
        'wealth': 'Frank Wealth'
    };
    
    const prices = {
        'student': 19,
        'wealth': 29
    };
    
    // Simulate payment processing
    showAlert(`Starting 7-day free trial for ${planNames[plan]}...`, 'success');
    
    // Update user subscription
    userSubscription.plan = plan;
    userSubscription.trialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    // Enable features based on plan
    if (plan === 'student') {
        userSubscription.features.billSplitting = true;
    } else if (plan === 'wealth') {
        userSubscription.features = {
            billSplitting: true,
            cardChooser: true,
            debtPlanning: true,
            scamTraining: true,
            bankMatching: true,
            budgetPlus: true
        };
    }
    
    // Save to localStorage
    localStorage.setItem('beFrankSubscription', JSON.stringify(userSubscription));
    
    // Remove upgrade modal
    document.querySelector('.upgrade-modal')?.remove();
    
    // Show success
    setTimeout(() => {
        showAlert(`Welcome to ${planNames[plan]}! Enjoy your 7-day free trial.`, 'success');
        // Reload dashboard to show premium features
        if (window.location.pathname.includes('dashboard')) {
            loadDashboardData();
        }
    }, 1500);
}

// ==================== BILL SPLITTING (PREMIUM) ====================
function createBillSplit(groupName, members, expenses) {
    if (!checkPremiumAccess('billSplitting')) return;
    
    const billSplit = {
        id: Date.now(),
        name: groupName,
        members: members,
        expenses: expenses,
        created: new Date().toISOString(),
        total: expenses.reduce((sum, exp) => sum + exp.amount, 0),
        status: 'active'
    };
    
    let billSplits = JSON.parse(localStorage.getItem('beFrankBillSplits')) || [];
    billSplits.push(billSplit);
    localStorage.setItem('beFrankBillSplits', JSON.stringify(billSplits));
    
    showAlert(`Bill split "${groupName}" created! Share the code with roommates: ${billSplit.id}`, 'success');
}

// ==================== CARD CHOOSER (PREMIUM) ====================
function suggestBestCard(amount, merchant, category) {
    if (!checkPremiumAccess('cardChooser')) return null;
    
    const userCards = JSON.parse(localStorage.getItem('beFrankCards')) || [];
    
    // Simulate AI analysis for best card
    let bestCard = null;
    let bestRewards = 0;
    
    userCards.forEach(card => {
        const rewards = calculateCardRewards(card, amount, merchant, category);
        if (rewards > bestRewards) {
            bestRewards = rewards;
            bestCard = card;
        }
    });
    
    return {
        card: bestCard,
        rewards: bestRewards,
        reason: `Best for ${category} purchases at ${merchant}`
    };
}

// ==================== DEBT PLANNING (PREMIUM) ====================
function createDebtPlan(debts, method = 'snowball') {
    if (!checkPremiumAccess('debtPlanning')) return null;
    
    const plan = {
        id: Date.now(),
        method: method,
        debts: debts.map(debt => ({
            ...debt,
            remaining: debt.amount
        })),
        created: new Date().toISOString(),
        monthlyPayment: 0,
        timeline: []
    };
    
    // Calculate payoff plan
    if (method === 'snowball') {
        plan.debts.sort((a, b) => a.amount - b.amount);
    } else {
        plan.debts.sort((a, b) => b.interest - a.interest);
    }
    
    localStorage.setItem('beFrankDebtPlan', JSON.stringify(plan));
    return plan;
}

// ==================== SMART BANK MATCHING (PREMIUM) ====================
function findMatchingLenders(readinessScore, requirements) {
    if (!checkPremiumAccess('bankMatching')) return [];
    
    // Simulate lender matching
    const lenders = [
        {
            name: 'Emirates NBD Student Loan',
            match: 85,
            amount: 'Up to AED 50,000',
            interest: '4.99%',
            requirements: 'Student ID, 6+ months in UAE',
            approvalTime: '24-48 hours'
        },
        {
            name: 'Mashreq EduFlex',
            match: 78,
            amount: 'Up to AED 75,000',
            interest: '5.25%',
            requirements: 'Admission letter, UAE resident',
            approvalTime: '3-5 days'
        },
        {
            name: 'ADCB Education Finance',
            match: 65,
            amount: 'Up to AED 100,000',
            interest: '4.75%',
            requirements: 'Good academic standing, co-signer',
            approvalTime: '5-7 days'
        }
    ];
    
    // Filter based on readiness score
    return lenders.filter(lender => lender.match <= readinessScore * 10);
}

// ==================== SCAM TRAINING (PREMIUM) ====================
function startScamTraining() {
    if (!checkPremiumAccess('scamTraining')) return;
    
    const scenarios = [
        {
            type: 'phishing',
            message: 'Urgent: Your bank account has been compromised. Click here to secure it: http://fake-bank-uae.com',
            question: 'Is this message legitimate?',
            answer: false,
            explanation: 'Legitimate banks never ask for sensitive info via SMS. Check sender number and never click suspicious links.'
        },
        {
            type: 'job_scam',
            message: 'Earn AED 5000 weekly working from home! Send AED 500 registration fee to get started.',
            question: 'Is this job offer legitimate?',
            answer: false,
            explanation: 'Legitimate jobs never ask for upfront fees. Research the company and check official websites.'
        },
        {
            type: 'otp_scam',
            message: 'We detected unusual activity. Please share the OTP sent to your phone to verify your identity.',
            question: 'Should you share the OTP?',
            answer: false,
            explanation: 'NEVER share OTPs with anyone! Banks never ask for OTPs via call or message.'
        }
    ];
    
    localStorage.setItem('beFrankScamTraining', JSON.stringify(scenarios));
    window.location.href = 'scam-training.html';
}

// ==================== BUDGET+ FEATURES ====================
function setCategoryBudget(category, monthlyLimit) {
    if (!checkPremiumAccess('budgetPlus')) return;
    
    const budgets = JSON.parse(localStorage.getItem('beFrankBudgets')) || {};
    budgets[category] = {
        limit: monthlyLimit,
        spent: 0,
        period: 'monthly',
        alerts: true
    };
    
    localStorage.setItem('beFrankBudgets', JSON.stringify(budgets));
    showAlert(`Budget set for ${category}: AED ${monthlyLimit}/month`, 'success');
}

function checkBudgetAlerts() {
    const budgets = JSON.parse(localStorage.getItem('beFrankBudgets')) || {};
    const expenses = JSON.parse(localStorage.getItem('beFrankExpenses')) || [];
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    Object.entries(budgets).forEach(([category, budget]) => {
        const monthlySpent = expenses.reduce((total, expense) => {
            const expenseDate = new Date(expense.date);
            if (expense.category === category && 
                expenseDate.getMonth() === currentMonth && 
                expenseDate.getFullYear() === currentYear) {
                return total + expense.amount;
            }
            return total;
        }, 0);
        
        const percentage = (monthlySpent / budget.limit) * 100;
        
        if (percentage >= 80 && percentage < 100) {
            showAlert(`Budget Alert: You've spent ${percentage.toFixed(0)}% of your ${category} budget (AED ${monthlySpent}/${budget.limit})`, 'warning');
        } else if (percentage >= 100) {
            showAlert(`Budget Exceeded: You've spent AED ${monthlySpent} on ${category}, exceeding your budget of AED ${budget.limit}`, 'error');
        }
    });
}

// ==================== NET WORTH TRACKING ====================
function calculateNetWorth() {
    const assets = JSON.parse(localStorage.getItem('beFrankAssets')) || [];
    const liabilities = JSON.parse(localStorage.getItem('beFrankLiabilities')) || [];
    
    const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
    const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount, 0);
    
    return {
        assets: totalAssets,
        liabilities: totalLiabilities,
        netWorth: totalAssets - totalLiabilities,
        date: new Date().toISOString()
    };
}

// ==================== SPENDING INSIGHTS ====================
function generateMonthlyInsights() {
    const expenses = JSON.parse(localStorage.getItem('beFrankExpenses')) || [];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && 
               expenseDate.getFullYear() === currentYear;
    });
    
    // Calculate insights
    const categorySpending = {};
    let totalSpent = 0;
    let largestExpense = { amount: 0 };
    
    monthlyExpenses.forEach(expense => {
        totalSpent += expense.amount;
        categorySpending[expense.category] = (categorySpending[expense.category] || 0) + expense.amount;
        
        if (expense.amount > largestExpense.amount) {
            largestExpense = expense;
        }
    });
    
    // Find top 3 categories
    const topCategories = Object.entries(categorySpending)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
    
    // Calculate daily average
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const avgDailySpend = totalSpent / daysInMonth;
    
    return {
        totalSpent,
        avgDailySpend: avgDailySpend.toFixed(2),
        topCategories,
        largestExpense,
        expenseCount: monthlyExpenses.length,
        insights: generateAIInsights(categorySpending, totalSpent)
    };
}

function generateAIInsights(categorySpending, totalSpent) {
    const insights = [];
    
    // Food spending insight
    if (categorySpending['Food'] && (categorySpending['Food'] / totalSpent) > 0.3) {
        insights.push({
            type: 'food',
            message: "You're spending a lot on food! Consider meal prepping or using student discounts.",
            savings: `Potential: AED ${Math.round(categorySpending['Food'] * 0.2)}/month`
        });
    }
    
    // Subscription insight
    if (categorySpending['Entertainment'] && categorySpending['Entertainment'] > 200) {
        insights.push({
            type: 'subscriptions',
            message: "Multiple streaming services? Check our Subscription Stalker for duplicates.",
            action: 'Review subscriptions'
        });
    }
    
    // Savings insight
    if (totalSpent > 0 && (categorySpending['Savings'] || 0) < totalSpent * 0.2) {
        insights.push({
            type: 'savings',
            message: "Try saving 20% of your income. Even AED 50 weekly = AED 2,600 yearly!",
            goal: '20% savings rate'
        });
    }
    
    return insights;
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    // Check for existing subscription
    const savedSubscription = localStorage.getItem('beFrankSubscription');
    if (savedSubscription) {
        userSubscription = JSON.parse(savedSubscription);
    }
    
    // Check for trial expiration
    if (userSubscription.trialEnd && new Date(userSubscription.trialEnd) < new Date()) {
        userSubscription.plan = 'free';
        userSubscription.features = {
            billSplitting: false,
            cardChooser: false,
            debtPlanning: false,
            scamTraining: false,
            bankMatching: false,
            budgetPlus: false
        };
        localStorage.setItem('beFrankSubscription', JSON.stringify(userSubscription));
        showAlert('Your free trial has ended. Upgrade to continue using premium features.', 'error');
    }
    
    // Check budget alerts on dashboard load
    if (window.location.pathname.includes('dashboard') && userSubscription.features.budgetPlus) {
        checkBudgetAlerts();
    }
    
    // Initialize premium features UI
    updatePremiumUI();
});

function updatePremiumUI() {
    // Update UI based on subscription
    document.querySelectorAll('.premium-feature').forEach(feature => {
        const featureType = feature.dataset.feature;
        if (featureType && !userSubscription.features[featureType]) {
            feature.style.opacity = '0.7';
            feature.style.cursor = 'pointer';
            feature.onclick = () => showUpgradeModal(featureType);
        }
    });
    
    // Update subscription status in header
    const subscriptionBadge = document.querySelector('.subscription-badge');
    if (subscriptionBadge) {
        subscriptionBadge.textContent = userSubscription.plan === 'free' ? 'Free Plan' : 
                                      userSubscription.plan === 'student' ? 'Student+' : 'Wealth';
        subscriptionBadge.className = `subscription-badge ${userSubscription.plan}`;
    }
}

// ==================== EXPORT/IMPORT DATA ====================
function exportUserData() {
    const data = {
        user: JSON.parse(localStorage.getItem('beFrankUser')),
        expenses: JSON.parse(localStorage.getItem('beFrankExpenses')),
        subscriptions: JSON.parse(localStorage.getItem('beFrankSubscriptions')),
        budgets: JSON.parse(localStorage.getItem('beFrankBudgets')),
        billSplits: JSON.parse(localStorage.getItem('beFrankBillSplits')),
        debtPlan: JSON.parse(localStorage.getItem('beFrankDebtPlan')),
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `befrank-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showAlert('All your data has been exported successfully!', 'success');
}

function importUserData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate data structure
            if (data.user && data.expenses) {
                if (confirm('Import will overwrite your current data. Continue?')) {
                    localStorage.setItem('beFrankUser', JSON.stringify(data.user));
                    localStorage.setItem('beFrankExpenses', JSON.stringify(data.expenses));
                    
                    if (data.subscriptions) {
                        localStorage.setItem('beFrankSubscriptions', JSON.stringify(data.subscriptions));
                    }
                    if (data.budgets) {
                        localStorage.setItem('beFrankBudgets', JSON.stringify(data.budgets));
                    }
                    
                    showAlert('Data imported successfully! Refreshing...', 'success');
                    setTimeout(() => location.reload(), 1500);
                }
            } else {
                showAlert('Invalid data file format.', 'error');
            }
        } catch (error) {
            showAlert('Error reading data file.', 'error');
        }
    };
    reader.readAsText(file);
}

// ==================== UTILITY FUNCTIONS ====================
function calculateCardRewards(card, amount, merchant, category) {
    // Simulated reward calculation
    let baseRewards = amount * 0.01; // 1% base
    
    // Category bonuses
    const categoryBonuses = {
        'Food': 0.03,
        'Travel': 0.02,
        'Shopping': 0.015,
        'Entertainment': 0.025
    };
    
    if (categoryBonuses[category]) {
        baseRewards += amount * categoryBonuses[category];
    }
    
    // Merchant-specific offers (simulated)
    const merchantOffers = {
        'starbucks': 0.05,
        'carrefour': 0.04,
        'noon': 0.03,
        'amazon': 0.025
    };
    
    for (const [key, bonus] of Object.entries(merchantOffers)) {
        if (merchant.toLowerCase().includes(key)) {
            baseRewards += amount * bonus;
            break;
        }
    }
    
    return Math.round(baseRewards);
}

// Add CSS for upgrade modal
const upgradeModalCSS = `
.upgrade-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    backdrop-filter: blur(5px);
}

.upgrade-modal.active {
    display: flex;
    animation: fadeIn 0.3s ease-out;
}

.upgrade-container {
    background: white;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.4s ease-out;
}

.upgrade-header {
    background: linear-gradient(45deg, var(--dune-gold), var(--dune-sunrise));
    color: white;
    padding: 1.5rem 2rem;
    border-radius: 20px 20px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.close-upgrade {
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    line-height: 1;
}

.upgrade-content {
    padding: 2rem;
}

.upgrade-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(45deg, var(--dune-gold), var(--dune-sunrise));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
}

.upgrade-icon i {
    color: white;
    font-size: 2rem;
}

.upgrade-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
}

.upgrade-option {
    background: var(--dune-light);
    border-radius: 15px;
    padding: 1.5rem;
    position: relative;
}

.upgrade-option.featured {
    background: linear-gradient(135deg, var(--dune-light), rgba(42, 157, 143, 0.1));
    border: 2px solid var(--dune-oasis);
}

.popular-tag {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--dune-oasis);
    color: white;
    padding: 0.3rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
}

.upgrade-btn {
    width: 100%;
    padding: 0.8rem;
    border: 2px solid var(--dune-sand);
    background: white;
    color: var(--dune-dark);
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    margin-top: 1rem;
}

.upgrade-btn:hover {
    background: var(--dune-sand);
}

.upgrade-btn.primary {
    background: var(--dune-oasis);
    color: white;
    border-color: var(--dune-oasis);
}

.upgrade-btn.primary:hover {
    background: #21867a;
}

.trial-offer {
    text-align: center;
    padding: 1rem;
    background: rgba(56, 176, 0, 0.1);
    border-radius: 8px;
    border: 1px solid var(--dune-success);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    margin-top: 1.5rem;
}

.trial-offer i {
    color: var(--dune-success);
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

// Inject upgrade modal CSS
const style = document.createElement('style');
style.textContent = upgradeModalCSS;
document.head.appendChild(style);