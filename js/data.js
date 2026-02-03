// ==================== DATA MANAGEMENT ====================
class DataManager {
    constructor() {
        this.user = null;
        this.expenses = [];
        this.subscriptions = [];
        this.budgets = [];
        this.savingGoals = [];
        this.loadAllData();
    }
    
    loadAllData() {
        this.user = JSON.parse(localStorage.getItem('beFrankUser')) || null;
        this.expenses = JSON.parse(localStorage.getItem('beFrankExpenses')) || [];
        this.subscriptions = JSON.parse(localStorage.getItem('beFrankSubscriptions')) || [];
        this.budgets = JSON.parse(localStorage.getItem('beFrankBudgets')) || [];
        this.savingGoals = JSON.parse(localStorage.getItem('beFrankSavingGoals')) || [];
    }
    
    saveAllData() {
        localStorage.setItem('beFrankUser', JSON.stringify(this.user));
        localStorage.setItem('beFrankExpenses', JSON.stringify(this.expenses));
        localStorage.setItem('beFrankSubscriptions', JSON.stringify(this.subscriptions));
        localStorage.setItem('beFrankBudgets', JSON.stringify(this.budgets));
        localStorage.setItem('beFrankSavingGoals', JSON.stringify(this.savingGoals));
    }
    
    // Expense Management
    addExpense(expense) {
        expense.id = Date.now();
        expense.date = expense.date || new Date().toISOString().split('T')[0];
        expense.aiCategory = this.suggestCategory(expense.description);
        expense.category = expense.category || expense.aiCategory;
        expense.active = true;
        
        this.expenses.push(expense);
        this.saveAllData();
        return expense;
    }
    
    updateExpense(id, updates) {
        const index = this.expenses.findIndex(e => e.id === id);
        if (index !== -1) {
            this.expenses[index] = { ...this.expenses[index], ...updates };
            this.saveAllData();
            return true;
        }
        return false;
    }
    
    deleteExpense(id) {
        this.expenses = this.expenses.filter(e => e.id !== id);
        this.saveAllData();
    }
    
    suggestCategory(description) {
        const desc = description.toLowerCase();
        const categories = {
            Food: ['starbucks', 'coffee', 'restaurant', 'food', 'cafe', 'meal', 'dining', 'lunch', 'dinner', 'breakfast', 'snack'],
            Transport: ['uber', 'careem', 'taxi', 'transport', 'bus', 'metro', 'fuel', 'petrol', 'parking', 'cab', 'ride'],
            Shopping: ['amazon', 'noon', 'shopping', 'mall', 'store', 'market', 'clothes', 'fashion', 'electronics', 'souq', 'brand'],
            Entertainment: ['netflix', 'starzplay', 'movie', 'cinema', 'game', 'concert', 'music', 'theater', 'sports', 'ticket'],
            Bills: ['etisalat', 'du', 'bill', 'dewa', 'empower', 'utility', 'internet', 'mobile', 'electricity', 'water'],
            Education: ['book', 'course', 'university', 'education', 'stationery', 'tuition', 'textbook', 'workshop', 'seminar'],
            Healthcare: ['hospital', 'doctor', 'medicine', 'pharmacy', 'clinic', 'dental', 'medical', 'checkup', 'prescription'],
            Travel: ['flight', 'hotel', 'travel', 'vacation', 'trip', 'airline', 'booking', 'reservation'],
            Personal: ['salon', 'barber', 'gym', 'fitness', 'beauty', 'spa', 'haircut']
        };
        
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => desc.includes(keyword))) {
                return category;
            }
        }
        
        return 'Other';
    }
    
    getExpenseSummary() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        let total = 0;
        let monthlyTotal = 0;
        const categoryTotals = {};
        
        this.expenses.forEach(expense => {
            const expenseDate = new Date(expense.date);
            total += expense.amount;
            
            if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
                monthlyTotal += expense.amount;
                categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
            }
        });
        
        // Find top category
        let topCategory = '-';
        let maxAmount = 0;
        for (const [category, amount] of Object.entries(categoryTotals)) {
            if (amount > maxAmount) {
                maxAmount = amount;
                topCategory = category;
            }
        }
        
        return {
            total: total,
            monthlyTotal: monthlyTotal,
            categoryTotals: categoryTotals,
            topCategory: topCategory,
            count: this.expenses.length
        };
    }
    
    // Subscription Management
    addSubscription(subscription) {
        subscription.id = Date.now();
        subscription.active = true;
        subscription.nextCharge = subscription.nextCharge || 
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        this.subscriptions.push(subscription);
        this.saveAllData();
        return subscription;
    }
    
    toggleSubscription(id) {
        const subscription = this.subscriptions.find(s => s.id === id);
        if (subscription) {
            subscription.active = !subscription.active;
            this.saveAllData();
            return subscription.active;
        }
        return false;
    }
    
    getSubscriptionSummary() {
        const activeSubs = this.subscriptions.filter(s => s.active);
        const monthlyTotal = activeSubs.reduce((sum, sub) => sum + sub.amount, 0);
        
        return {
            total: monthlyTotal,
            yearly: monthlyTotal * 12,
            count: activeSubs.length,
            subscriptions: this.subscriptions
        };
    }
    
    // Budget Management
    createBudget(category, limit) {
        const budget = {
            id: Date.now(),
            category: category,
            limit: limit,
            spent: 0,
            period: 'monthly',
            startDate: new Date().toISOString().split('T')[0]
        };
        
        this.budgets.push(budget);
        this.saveAllData();
        return budget;
    }
    
    updateBudgetSpending() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        // Reset spending for new month
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
        this.budgets.forEach(budget => {
            if (budget.startDate !== firstDayOfMonth) {
                budget.spent = 0;
                budget.startDate = firstDayOfMonth;
            }
        });
        
        // Calculate current spending
        this.expenses.forEach(expense => {
            const expenseDate = new Date(expense.date);
            if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
                const budget = this.budgets.find(b => b.category === expense.category);
                if (budget) {
                    budget.spent += expense.amount;
                }
            }
        });
        
        this.saveAllData();
    }
    
    getBudgetStatus() {
        this.updateBudgetSpending();
        
        return this.budgets.map(budget => ({
            ...budget,
            remaining: budget.limit - budget.spent,
            percentage: (budget.spent / budget.limit) * 100,
            status: budget.spent > budget.limit ? 'over' : budget.spent > budget.limit * 0.8 ? 'warning' : 'good'
        }));
    }
    
    // Saving Goals
    createSavingGoal(goal) {
        goal.id = Date.now();
        goal.saved = 0;
        goal.createdAt = new Date().toISOString().split('T')[0];
        goal.active = true;
        
        this.savingGoals.push(goal);
        this.saveAllData();
        return goal;
    }
    
    addToSavingGoal(id, amount) {
        const goal = this.savingGoals.find(g => g.id === id);
        if (goal) {
            goal.saved += amount;
            if (goal.saved >= goal.target) {
                goal.completed = true;
                goal.completedAt = new Date().toISOString().split('T')[0];
            }
            this.saveAllData();
            return goal;
        }
        return null;
    }
    
    getSavingGoalsProgress() {
        return this.savingGoals.map(goal => ({
            ...goal,
            progress: (goal.saved / goal.target) * 100,
            remaining: goal.target - goal.saved,
            dailyTarget: goal.deadline ? 
                (goal.target - goal.saved) / Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : 0
        }));
    }
    
    // Analytics
    getMonthlySpendingTrend(months = 6) {
        const trends = [];
        const now = new Date();
        
        for (let i = months - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            
            const monthExpenses = this.expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= monthStart && expenseDate <= monthEnd;
            });
            
            const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            
            trends.push({
                month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                total: total,
                expenses: monthExpenses.length
            });
        }
        
        return trends;
    }
    
    getCategoryBreakdown() {
        const breakdown = {};
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        this.expenses.forEach(expense => {
            const expenseDate = new Date(expense.date);
            if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
                breakdown[expense.category] = (breakdown[expense.category] || 0) + expense.amount;
            }
        });
        
        return Object.entries(breakdown)
            .map(([category, amount]) => ({ category, amount }))
            .sort((a, b) => b.amount - a.amount);
    }
    
    // Financial Health Score
    calculateFinancialHealth() {
        let score = 0;
        const maxScore = 100;
        
        // 1. Expense Diversity (20 points)
        const breakdown = this.getCategoryBreakdown();
        const uniqueCategories = breakdown.length;
        score += Math.min(uniqueCategories * 2, 20);
        
        // 2. Budget Adherence (30 points)
        const budgetStatus = this.getBudgetStatus();
        if (budgetStatus.length > 0) {
            const adherenceRate = budgetStatus.filter(b => b.status === 'good').length / budgetStatus.length;
            score += adherenceRate * 30;
        }
        
        // 3. Saving Rate (25 points)
        const monthlySpending = this.getExpenseSummary().monthlyTotal;
        // Assuming income placeholder - in real app, this would come from user input
        const estimatedIncome = monthlySpending * 1.5; // Placeholder
        const savingRate = Math.max(0, (estimatedIncome - monthlySpending) / estimatedIncome);
        score += savingRate * 25;
        
        // 4. Subscription Management (15 points)
        const subSummary = this.getSubscriptionSummary();
        const subscriptionEfficiency = Math.max(0, 1 - (subSummary.count / 10)); // More than 10 subs is inefficient
        score += subscriptionEfficiency * 15;
        
        // 5. App Engagement (10 points)
        // Placeholder - in real app, track user engagement
        score += 10;
        
        return Math.min(Math.round(score), 100);
    }
    
    // Data Export
    exportData(format = 'json') {
        const data = {
            user: this.user,
            expenses: this.expenses,
            subscriptions: this.subscriptions,
            budgets: this.budgets,
            savingGoals: this.savingGoals,
            exportedAt: new Date().toISOString()
        };
        
        if (format === 'json') {
            return JSON.stringify(data, null, 2);
        } else if (format === 'csv') {
            // Simplified CSV export - in real app, implement proper CSV generation
            return this.exportToCSV(data);
        }
        
        return null;
    }
    
    exportToCSV(data) {
        let csv = '';
        
        // Export expenses
        csv += 'Expenses\n';
        csv += 'Date,Description,Amount,Category,AI Category\n';
        data.expenses.forEach(expense => {
            csv += `${expense.date},"${expense.description}",${expense.amount},"${expense.category}","${expense.aiCategory}"\n`;
        });
        
        csv += '\nSubscriptions\n';
        csv += 'Name,Amount,Status,Next Charge\n';
        data.subscriptions.forEach(sub => {
            csv += `"${sub.name}",${sub.amount},${sub.active ? 'Active' : 'Inactive'},"${sub.nextCharge}"\n`;
        });
        
        return csv;
    }
    
    // Data Cleanup
    cleanupOldData(days = 730) { // Default 2 years
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        // Remove old expenses
        this.expenses = this.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= cutoffDate;
        });
        
        this.saveAllData();
    }
}

// Global instance
const dataManager = new DataManager();

// Helper functions for backward compatibility
function getAICategory(description) {
    return dataManager.suggestCategory(description);
}

function getExpenseSummary() {
    return dataManager.getExpenseSummary();
}

function getSubscriptionSummary() {
    return dataManager.getSubscriptionSummary();
}