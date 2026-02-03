// ==================== WITTY FRANK AI RESPONSES ====================
const frankWittyResponses = {
    "nsf": "Aha! NSF means 'Non-Sufficient Funds' - when your bank account has more month left than money! Wallah, even banks get moody sometimes. Try keeping a small cushion, habibi - like keeping an extra ghutra for windy days!",
    "ach": "ACH DEBIT is like when your Etisalat bill politely helps itself to your account! Automatic bank transfer - think of it as your money taking a direct flight from your account to the biller. Convenient, but watch those boarding passes!",
    "credit": "Our 'Financial Readiness Indicator' is like a fitness tracker for your money habits! Real credit scores? That's the Emirates Credit Bureau's territory - they're the official referees. We're just your friendly coach on the sidelines!",
    "scam": "Ya salam! OTPs are like your financial underwear - never share them! Legit companies ask you to enter, not tell. Remember: If it's too good to be true, it's probably a desert mirage!",
    "loan": "Loans are serious business, like committing to a year of camel rides! Always read the fine print - APR isn't just three random letters. And only borrow what you can repay while still affording karak tea!",
    "budget": "Simple budget recipe: 50% needs (food, shelter, Wi-Fi), 30% wants (shawarma runs, new ghutras), 20% savings (for emergencies and future adventures). Easy peasy lemon squeezy!",
    "save": "Masha'Allah! Even saving AED 50 weekly is like collecting sand grains - soon you'll have a beach! That's AED 2,600 yearly - enough for Eid shopping and still have change for dates!",
    "bill": "Smart thinking! Bills are like uninvited guests - they keep coming back. I can help spot the ones overstaying their welcome (looking at you, forgotten gym membership!).",
    "investment": "Start small, like planting a date palm! Even AED 100 monthly in a savings account grows over time. Compound interest is your best friend - it works while you sleep!",
    "insurance": "Insurance is like wearing a seatbelt in a luxury car - better to have it and not need it than need it and not have it! Especially in the UAE's fast lane!",
    "tax": "Here's a sweet UAE fact: No personal income tax! It's like getting a discount on your entire salary. But do watch for VAT on purchases - 5% adds up like sand in shoes!",
    "student": "Student loans? Read terms like you're studying for finals! Check APR, repayment period, and penalties. Pro tip: Borrow only what you need - future you will send thank you notes!",
    "emergency": "Emergency fund = 3-6 months of expenses. Think of it as your financial safety net for when life throws a sandstorm your way! Start with one month's cushion first.",
    "debt": "Debt snowball method: Pay smallest debts first for quick wins - it's psychological magic! Avalanche method: Attack high-interest debts to save money. Choose your weapon wisely!",
    "retirement": "Start retirement saving early! Compound interest is like a camel - slow but steady, and eventually it carries you across the desert of time!",
    "uae": "In the UAE, banks offer student accounts with zero balance requirements! Look for ones that don't charge fees - because why pay for the privilege of having money? Compare before choosing!",
    "crypto": "Cryptocurrency in UAE? Regulated and growing! But remember: It's more volatile than Dubai weather - sunny one minute, sandstorm the next. Only invest what you can afford to watch do the rollercoaster!",
    "shopping": "Online shopping tips: Wait 24 hours before buying (desert cools the impulse!), use price trackers, and always check return policies. Remember: A deal isn't a deal if you don't need it!",
    "travel": "Travel hacking: Book flights on Tuesday, use student discounts, and always have travel insurance. Pro tip: Off-season travel saves money and avoids crowds - more space for your ghutra!",
    "default": "Marhaba! I'm Frank, your financial sensei in a business suit! Ask me anything about money - I speak finance, Emirati slang, and common sense. Khalas with confusion, let's get financially fabulous!"
};

const frankWittySuggestions = [
    "What does 'NSF fee' mean?",
    "Explain ACH debit in simple terms",
    "How can I start saving as a student?",
    "What's the difference between credit score and your readiness indicator?",
    "How to spot financial scams in UAE?",
    "Budgeting tips for students with limited income",
    "Emergency fund - how much do I really need?",
    "Debt repayment: Snowball vs Avalanche method",
    "Best student bank accounts in UAE",
    "How does VAT work in the UAE?",
    "Cryptocurrency regulations in UAE",
    "Online shopping safety tips"
];

const frankPersonality = {
    greetings: [
        "Marhaba! Frank here, ready to demystify your finances!",
        "Ahlan wa sahlan! Your financial clarity journey starts now!",
        "Salaam! Let's make your money behave like a well-trained falcon!",
        "Welcome back! Ready to tackle financial mysteries together?"
    ],
    encouragements: [
        "Masha'Allah! Great question!",
        "Wallah, that's a smart thing to ask!",
        "Excellent thinking! Let me break this down...",
        "Aha! You're asking the right questions!"
    ],
    signoffs: [
        "Remember: Financial wisdom is the new cool!",
        "Khalas with confusion, you've got this!",
        "Stay financially fabulous, habibi!",
        "Your money, your rules - make them good ones!"
    ],
    emojis: ["💰", "🧮", "📊", "💡", "🎯", "🛡️", "🚀", "🏆"]
};

function getWittyFrankResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Add personality to response
    const greeting = frankPersonality.greetings[Math.floor(Math.random() * frankPersonality.greetings.length)];
    const encouragement = frankPersonality.encouragements[Math.floor(Math.random() * frankPersonality.encouragements.length)];
    const signoff = frankPersonality.signoffs[Math.floor(Math.random() * frankPersonality.signoffs.length)];
    const emoji = frankPersonality.emojis[Math.floor(Math.random() * frankPersonality.emojis.length)];
    
    // Check for specific keywords
    for (const [key, response] of Object.entries(frankWittyResponses)) {
        if (lowerMessage.includes(key)) {
            return `${encouragement}\n\n${response}\n\n${signoff} ${emoji}`;
        }
    }
    
    // Check for question patterns with witty responses
    if (lowerMessage.includes('what is') || lowerMessage.includes('what\'s') || lowerMessage.includes('explain')) {
        if (lowerMessage.includes('interest') || lowerMessage.includes('apr')) {
            return `${encouragement}\n\nInterest is what banks charge for borrowing money - it's like rent for using their funds! APR includes all costs, so it's the true price tag. Lower APR = less rent = more money for shawarma! ${emoji}\n\n${signoff}`;
        }
        if (lowerMessage.includes('investment') || lowerMessage.includes('stock')) {
            return `${encouragement}\n\nInvesting is like planting a money tree! Start with low-cost index funds - they're like a buffet of stocks. Remember: Time in the market beats timing the market! ${emoji}\n\n${signoff}`;
        }
        if (lowerMessage.includes('credit card')) {
            return `${encouragement}\n\nCredit cards are like financial power tools - useful but dangerous if mishandled! Use for convenience, pay in full monthly, and enjoy rewards responsibly. ${emoji}\n\n${signoff}`;
        }
    }
    
    if (lowerMessage.includes('how to') || lowerMessage.includes('how do i')) {
        if (lowerMessage.includes('save') || lowerMessage.includes('budget')) {
            return `${encouragement}\n\nTrack expenses first - knowledge is power! Then cut the small stuff: daily karak tea adds up like sand dunes! Try the 50/30/20 rule and automate savings. ${emoji}\n\n${signoff}`;
        }
        if (lowerMessage.includes('invest') || lowerMessage.includes('grow money')) {
            return `${encouragement}\n\nStart with a savings account for emergency fund, then explore UAE's investment options. Diversify like a camel caravan - don't put all dates in one basket! ${emoji}\n\n${signoff}`;
        }
        if (lowerMessage.includes('get loan') || lowerMessage.includes('borrow')) {
            return `${encouragement}\n\nFirst, check your readiness indicator (educational only!). Then shop around - banks compete like falcons! Read all terms, check APR, and ensure repayments fit your budget. ${emoji}\n\n${signoff}`;
        }
    }
    
    if (lowerMessage.includes('best') || lowerMessage.includes('recommend')) {
        if (lowerMessage.includes('bank') || lowerMessage.includes('account')) {
            return `${encouragement}\n\nFor students: Look for zero balance, no fee accounts! Emirates NBD Liv, ADCB Hayak, and Mashreq Neo offer great student options. Compare like you're choosing between shawarma joints! ${emoji}\n\n${signoff}`;
        }
        if (lowerMessage.includes('card') || lowerserviceProvider('credit card')) {
            return `${encouragement}\n\nFor students: Cards with low fees and reward points! But remember: A credit card isn't free money - it's tomorrow's money visiting today! Use wisely. ${emoji}\n\n${signoff}`;
        }
    }
    
    if (lowerMessage.includes('uae') || lowerMessage.includes('emirates') || lowerMessage.includes('dubai')) {
        if (lowerMessage.includes('bank') || lowerMessage.includes('finance')) {
            return `${encouragement}\n\nUAE banking is world-class! Student accounts often have special perks. Always check Central Bank UAE regulations for protection. And remember: If it sounds too good to be true in the land of luxury... it probably is! ${emoji}\n\n${signoff}`;
        }
    }
    
    // Default witty response
    return `${greeting}\n\n${frankWittyResponses.default}\n\n${signoff} ${emoji}`;
}

function loadWittySuggestions() {
    const suggestionList = document.getElementById('frankSuggestions');
    if (!suggestionList) return;
    
    suggestionList.innerHTML = '';
    frankWittySuggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.innerHTML = `
            <i class="fas fa-lightbulb"></i>
            <span>${suggestion}</span>
            <i class="fas fa-chevron-right" style="margin-left: auto; opacity: 0.5; font-size: 0.8rem;"></i>
        `;
        li.onclick = () => {
            document.getElementById('frankChatInput').value = suggestion;
            sendFrankMessage();
            li.style.background = 'rgba(42, 157, 143, 0.1)';
            setTimeout(() => li.style.background = '', 1000);
        };
        suggestionList.appendChild(li);
    });
}

function sendFrankMessage() {
    const input = document.getElementById('frankChatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message with typing indicator
    addFrankMessage(message, 'user');
    
    // Show Frank is typing
    showTypingIndicator();
    
    // Get witty response after delay
    setTimeout(() => {
        hideTypingIndicator();
        const response = getWittyFrankResponse(message);
        addFrankMessage(response, 'frank');
        
        // Occasionally add a follow-up question
        if (Math.random() > 0.7) {
            setTimeout(() => {
                addFollowUpQuestion(message);
            }, 1000);
        }
    }, 1000 + Math.random() * 1500); // Simulate thinking time
    
    input.value = '';
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('frankChatMessages');
    if (!chatMessages) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message frank typing';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="message-header">
            <strong>Frank</strong>
            <span>typing...</span>
        </div>
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function addFollowUpQuestion(originalMessage) {
    const followUps = {
        'budget': "Want me to help you create a personalized budget?",
        'save': "Would you like some specific savings challenges?",
        'debt': "Need help creating a debt repayment plan?",
        'investment': "Interested in learning about beginner-friendly investment options?",
        'scam': "Want to try our scam identification training?",
        'loan': "Need guidance on comparing loan offers?"
    };
    
    let followUp = null;
    const lowerMessage = originalMessage.toLowerCase();
    
    for (const [key, question] of Object.entries(followUps)) {
        if (lowerMessage.includes(key)) {
            followUp = question;
            break;
        }
    }
    
    if (followUp && Math.random() > 0.5) {
        setTimeout(() => {
            addFrankMessage(`${followUp} (Just ask!)`, 'frank');
        }, 2000);
    }
}

function addFrankMessage(text, sender = 'frank') {
    const chatMessages = document.getElementById('frankChatMessages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0');
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <strong>${sender === 'frank' ? 'Frank' : 'You'}</strong>
            <span>${timeString}</span>
        </div>
        <div class="message-content">${text.replace(/\n/g, '<br>')}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add animation
    messageDiv.style.animation = 'fadeInUp 0.3s ease-out';
}

// Initialize Witty Frank AI
document.addEventListener('DOMContentLoaded', function() {
    // Load witty suggestions
    loadWittySuggestions();
    
    // Add welcome message if on Frank AI page
    if (document.getElementById('frankChatMessages')) {
        setTimeout(() => {
            const welcome = frankPersonality.greetings[0] + "\n\n" + 
                          "I'm Frank, your financial advisor with a dash of Emirati charm! " +
                          "Ask me anything about money, banking, or financial terms. " +
                          "I speak finance, slang, and common sense!\n\n" +
                          "Pro tip: Try asking about 'NSF fees' or 'how to start saving'! " + 
                          frankPersonality.emojis[0];
            addFrankMessage(welcome, 'frank');
        }, 1000);
    }
    
    // Enter key for chat input
    const chatInput = document.getElementById('frankChatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendFrankMessage();
            }
        });
        
        // Focus on input
        chatInput.focus();
    }
    
    // Add typing animation CSS
    const typingCSS = `
    .typing-dots {
        display: flex;
        gap: 4px;
        margin-top: 5px;
    }
    
    .typing-dots span {
        width: 8px;
        height: 8px;
        background: var(--dune-oasis);
        border-radius: 50%;
        animation: typingBounce 1.4s infinite ease-in-out;
    }
    
    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes typingBounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
    }
    
    .message.frank {
        animation: slideInLeft 0.3s ease-out;
    }
    
    .message.user {
        animation: slideInRight 0.3s ease-out;
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .message-content {
        line-height: 1.6;
    }
    
    .message.frank .message-content {
        background: rgba(42, 157, 143, 0.05);
        padding: 0.8rem;
        border-radius: 0 12px 12px 12px;
        margin-top: 0.5rem;
        border-left: 3px solid var(--dune-oasis);
    }
    `;
    
    const style = document.createElement('style');
    style.textContent = typingCSS;
    document.head.appendChild(style);
});