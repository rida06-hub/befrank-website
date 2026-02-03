<!-- Subscription Management Section -->
<div class="report-section" id="subscriptionManagement">
    <div class="section-header">
        <h2><i class="fas fa-crown"></i> Subscription Management</h2>
        <div class="subscription-badge student" id="currentPlan">Free Plan</div>
    </div>
    
    <div class="subscription-info">
        <div class="subscription-card">
            <div class="subscription-header">
                <h4>Current Plan</h4>
                <div class="subscription-status active">Active</div>
            </div>
            <div class="subscription-details">
                <div class="plan-name" id="planName">Frank Basic</div>
                <div class="plan-features">
                    <div><i class="fas fa-check"></i> Basic Budgeting</div>
                    <div><i class="fas fa-check"></i> Expense Tracking</div>
                    <div><i class="fas fa-check"></i> Bill Reminders</div>
                    <div id="premiumFeature1"><i class="fas fa-lock"></i> Bill Splitting</div>
                    <div id="premiumFeature2"><i class="fas fa-lock"></i> Card Chooser</div>
                </div>
                <div class="plan-actions">
                    <button class="cta-btn secondary" onclick="showUpgradeOptions()">
                        <i class="fas fa-rocket"></i> Upgrade Plan
                    </button>
                    <button class="cta-btn" onclick="manageSubscription()">
                        <i class="fas fa-cog"></i> Manage
                    </button>
                </div>
            </div>
        </div>
        
        <div class="billing-card">
            <div class="billing-header">
                <h4>Billing Information</h4>
                <i class="fas fa-receipt"></i>
            </div>
            <div class="billing-details">
                <div class="billing-row">
                    <span>Next Billing Date:</span>
                    <span id="nextBillingDate">-</span>
                </div>
                <div class="billing-row">
                    <span>Payment Method:</span>
                    <span id="paymentMethod">Not set</span>
                </div>
                <div class="billing-row">
                    <span>Billing History:</span>
                    <button class="text-btn" onclick="viewBillingHistory()">View</button>
                </div>
            </div>
            <div class="billing-actions">
                <button class="action-btn" onclick="updatePaymentMethod()">
                    <i class="fas fa-credit-card"></i> Update Payment
                </button>
                <button class="action-btn" onclick="downloadInvoice()">
                    <i class="fas fa-download"></i> Download Invoice
                </button>
            </div>
        </div>
    </div>
</div>