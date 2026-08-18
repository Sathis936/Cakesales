const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const AUTH_KEY = 'sweetcraftAuth';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initRTL();
    initNavbar();
    updateAuthNavigation();
    initMobileMenu();
    initFAQ();
    initFilters();
    initBlogFilters();
    initScheduleTabs();
    initServiceTabs();
    initCountdown();
    initForms();
    initDashboard();
});

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    
    $$('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', toggleTheme);
        updateThemeIcon(btn);
    });
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
    $$('.theme-toggle').forEach(updateThemeIcon);
}

function toggleTheme() {
    const isDark = document.body.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
}

function updateThemeIcon(btn) {
    const isDark = document.body.classList.contains('dark');
    btn.innerHTML = isDark 
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
}

function initRTL() {
    const savedRTL = localStorage.getItem('rtl') === 'true';
    applyRTL(savedRTL);
    
    $$('.rtl-toggle').forEach(btn => {
        btn.addEventListener('click', toggleRTL);
        updateRTLIcon(btn);
    });
}

function applyRTL(isRTL) {
    if (isRTL) {
        document.body.classList.add('rtl');
    } else {
        document.body.classList.remove('rtl');
    }
    localStorage.setItem('rtl', isRTL);
    $$('.rtl-toggle').forEach(updateRTLIcon);
}

function toggleRTL() {
    const isRTL = document.body.classList.contains('rtl');
    applyRTL(!isRTL);
}

function updateRTLIcon(btn) {
    const isRTL = document.body.classList.contains('rtl');
    btn.innerHTML = isRTL
        ? '<i class="fas fa-align-left"></i>'
        : '<i class="fas fa-align-right"></i>';
}

function initNavbar() {
    const navbar = $('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function isUserLoggedIn() {
    return localStorage.getItem(AUTH_KEY) === 'true';
}

function setUserLoggedIn(isLoggedIn) {
    localStorage.setItem(AUTH_KEY, isLoggedIn ? 'true' : 'false');
}

function logoutUser(event) {
    if (event) {
        event.preventDefault();
    }
    setUserLoggedIn(false);
    showToast('Logged out successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 500);
}

function updateAuthNavigation() {
    const navActions = document.querySelectorAll('.nav-actions');

    navActions.forEach((container) => {
        const legacyAuth = container.querySelectorAll('a[href="login.html"], a[href="register.html"], a[data-auth-role], button[data-auth-role]');
        legacyAuth.forEach((item) => item.remove());

        const authGroup = document.createElement('div');
        authGroup.className = 'auth-nav-actions';
        authGroup.style.display = 'flex';
        authGroup.style.alignItems = 'center';
        authGroup.style.gap = '0.75rem';

        if (isUserLoggedIn()) {
            const dashboardLink = document.createElement('a');
            dashboardLink.href = 'admin-dashboard.html';
            dashboardLink.className = 'btn btn-outline';
            dashboardLink.textContent = 'Dashboard';
            dashboardLink.style.padding = '0.625rem 1.25rem';
            dashboardLink.style.fontSize = '0.875rem';

            const logoutBtn = document.createElement('button');
            logoutBtn.type = 'button';
            logoutBtn.className = 'btn btn-primary';
            logoutBtn.textContent = 'Logout';
            logoutBtn.style.padding = '0.625rem 1.25rem';
            logoutBtn.style.fontSize = '0.875rem';
            logoutBtn.addEventListener('click', logoutUser);

            authGroup.appendChild(dashboardLink);
            authGroup.appendChild(logoutBtn);
        } else {
            const loginLink = document.createElement('a');
            loginLink.href = 'login.html';
            loginLink.className = 'btn btn-primary';
            loginLink.textContent = 'Login';
            loginLink.style.padding = '0.625rem 1.25rem';
            loginLink.style.fontSize = '0.875rem';

            const signInLink = document.createElement('a');
            signInLink.href = 'register.html';
            signInLink.className = 'btn btn-outline';
            signInLink.textContent = 'Sign In';
            signInLink.style.padding = '0.625rem 1.25rem';
            signInLink.style.fontSize = '0.875rem';

            authGroup.appendChild(loginLink);
            authGroup.appendChild(signInLink);
        }

        const mobileToggle = container.querySelector('.mobile-toggle');
        if (mobileToggle) {
            container.insertBefore(authGroup, mobileToggle);
        } else {
            container.appendChild(authGroup);
        }
    });

    const mobileMenuNav = document.querySelector('.mobile-menu-nav');
    if (mobileMenuNav) {
        const legacyMobileLinks = mobileMenuNav.querySelectorAll('a[href="login.html"], a[href="register.html"], li[data-auth-mobile]');
        legacyMobileLinks.forEach((item) => item.remove());

        if (isUserLoggedIn()) {
            const dashboardItem = document.createElement('li');
            dashboardItem.setAttribute('data-auth-mobile', 'true');
            const dashboardLink = document.createElement('a');
            dashboardLink.href = 'admin-dashboard.html';
            dashboardLink.textContent = 'Dashboard';
            dashboardItem.appendChild(dashboardLink);

            const logoutItem = document.createElement('li');
            logoutItem.setAttribute('data-auth-mobile', 'true');
            const logoutLink = document.createElement('a');
            logoutLink.href = 'login.html';
            logoutLink.textContent = 'Logout';
            logoutLink.addEventListener('click', logoutUser);
            logoutItem.appendChild(logoutLink);

            mobileMenuNav.appendChild(dashboardItem);
            mobileMenuNav.appendChild(logoutItem);
        } else {
            const loginItem = document.createElement('li');
            loginItem.setAttribute('data-auth-mobile', 'true');
            const loginLink = document.createElement('a');
            loginLink.href = 'login.html';
            loginLink.textContent = 'Login';
            loginItem.appendChild(loginLink);

            const signInItem = document.createElement('li');
            signInItem.setAttribute('data-auth-mobile', 'true');
            const signInLink = document.createElement('a');
            signInLink.href = 'register.html';
            signInLink.textContent = 'Sign In';
            signInItem.appendChild(signInLink);

            mobileMenuNav.appendChild(loginItem);
            mobileMenuNav.appendChild(signInItem);
        }
    }

    const path = window.location.pathname.split('/').pop();
    if ((path === 'login.html' || path === 'register.html') && isUserLoggedIn()) {
        window.location.href = 'index.html';
    }
}

function initMobileMenu() {
    const mobileToggle = $('.mobile-toggle');
    const mobileMenu = $('.mobile-menu');
    const overlay = $('.overlay');
    const closeBtn = $('.mobile-menu-close');
    
    if (!mobileToggle || !mobileMenu) return;
    
    const openMenu = () => {
        mobileMenu.classList.add('open');
        if (overlay) overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    };
    
    const closeMenu = () => {
        mobileMenu.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
        document.body.style.overflow = '';
    };
    
    mobileToggle.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);
    
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

function initFAQ() {
    $$('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = question.nextElementSibling;
            const isOpen = question.classList.contains('active');
            
            $$('.faq-question').forEach(q => {
                q.classList.remove('active');
            });
            $$('.faq-answer').forEach(a => {
                a.classList.remove('open');
            });
            
            if (!isOpen) {
                question.classList.add('active');
                answer.classList.add('open');
            }
        });
    });
}

function initFilters() {
    const filterTabs = $$('.filter-tab');
    const searchInput = $('.search-box input');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const level = tab.dataset.level;
            const items = $$('.schedule-item');
            if (items.length) {
                items.forEach(item => {
                    if (level === 'all' || item.dataset.level === level) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            } else {
                showToast(`Filter: ${tab.textContent.trim()}`);
            }
        });
    });
    
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = e.target.value.toLowerCase().trim();
                const items = $$('.schedule-item');
                if (items.length && query) {
                    items.forEach(item => {
                        const text = item.textContent.toLowerCase();
                        item.style.display = text.includes(query) ? '' : 'none';
                    });
                } else if (items.length && !query) {
                    items.forEach(item => item.style.display = '');
                } else if (query.length > 2) {
                    showToast(`Searching for: ${e.target.value}`);
                }
            }, 400);
        });
    }
    
    const sidebarSearch = $('.sidebar-search input');
    if (sidebarSearch) {
        sidebarSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.value) {
                showToast(`Searching articles: ${e.target.value}`);
            }
        });
    }
}

function initBlogFilters() {
    const blogTabs = $$('.blog-filter-tab');
    const blogCards = $$('.blog-card');
    const blogSearch = $('.blog-search-input');
    const blogSearchBtn = $('.blog-search-btn');

    if (!blogTabs.length && !blogCards.length) return;

    function applyBlogFilters() {
        const activeTab = document.querySelector('.blog-filter-tab.active');
        const category = activeTab ? (activeTab.dataset.category || 'all') : 'all';
        const query = (blogSearch && blogSearch.value || '').toLowerCase().trim();

        blogCards.forEach(card => {
            const cardCategory = card.dataset.category || 'all';
            const text = card.textContent.toLowerCase();
            const matchesCategory = category === 'all' || cardCategory === category;
            const matchesQuery = !query || text.includes(query);
            card.style.display = matchesCategory && matchesQuery ? '' : 'none';
        });
    }

    blogTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            blogTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            applyBlogFilters();
        });
    });

    if (blogSearch) {
        blogSearch.addEventListener('input', applyBlogFilters);
        blogSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                applyBlogFilters();
            }
        });
    }

    if (blogSearchBtn) {
        blogSearchBtn.addEventListener('click', applyBlogFilters);
    }
}

function initScheduleTabs() {
    let activeDay = 'all';
    let activeWeek = 'all';

    function applyFilters() {
        $$('.schedule-item').forEach(item => {
            const itemDay = item.dataset.day;
            const itemWeek = item.dataset.week;
            const dayMatch = (activeDay === 'all' || itemDay === activeDay);
            const weekMatch = (activeWeek === 'all' || itemWeek === activeWeek);
            item.style.display = (dayMatch && weekMatch) ? '' : 'none';
        });
    }

    $$('.schedule-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabsGroup = tab.closest('.schedule-tabs');
            if (tabsGroup) {
                tabsGroup.querySelectorAll('.schedule-tab').forEach(t => t.classList.remove('active'));
            }
            tab.classList.add('active');

            if (tab.dataset.day !== undefined) {
                activeDay = tab.dataset.day;
            }
            if (tab.dataset.week !== undefined) {
                activeWeek = tab.dataset.week;
            }
            applyFilters();
        });
    });
}

function initServiceTabs() {
    $$('.service-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            const container = tab.closest('.service-details-tabs, body');

            if (!container) return;

            const groupRoot = tab.closest('.service-details-tabs');
            if (groupRoot) {
                groupRoot.querySelectorAll('.service-tab').forEach(t => t.classList.remove('active'));
            } else {
                $$('.service-tab').forEach(t => t.classList.remove('active'));
            }
            tab.classList.add('active');

            $$('.tab-panel').forEach(panel => {
                panel.classList.remove('active');
            });

            const target = document.getElementById(tabId);
            if (target) {
                target.classList.add('active');
            }
        });
    });
}

function initCountdown() {
    const countdown = $('.countdown');
    if (!countdown) return;
    
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 45);
    
    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const items = $$('.countdown-number');
        if (items.length >= 4) {
            items[0].textContent = String(days).padStart(2, '0');
            items[1].textContent = String(hours).padStart(2, '0');
            items[2].textContent = String(minutes).padStart(2, '0');
            items[3].textContent = String(seconds).padStart(2, '0');
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function initForms() {
    $$('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formId = form.id || 'form';
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                btn.disabled = true;
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    handleFormSubmit(formId, form);
                }, 1500);
            } else {
                handleFormSubmit(formId, form);
            }
        });
    });

    $$('.chat-send-btn').forEach(btn => {
        btn.addEventListener('click', () => sendChatMessage(btn));
    });
    
    $$('.chat-input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage(input.closest('.chat-input-area').querySelector('.chat-send-btn'));
            }
        });
    });
}

function handleFormSubmit(formId, form) {
    switch(formId) {
        case 'loginForm':
            setUserLoggedIn(true);
            showToast('Login successful! Redirecting...', 'success');
            setTimeout(() => window.location.href = 'index.html', 1500);
            break;
        case 'registerForm':
            setUserLoggedIn(true);
            showToast('Account created successfully! Redirecting...', 'success');
            setTimeout(() => window.location.href = 'index.html', 1500);
            break;
        case 'contactForm':
            showToast('Message sent! We will get back to you soon.', 'success');
            form.reset();
            break;
        case 'subscribeForm':
            showToast('Subscribed successfully!', 'success');
            form.reset();
            break;
        case 'comingSoonForm':
            showToast('Thank you! We will notify you when we launch.', 'success');
            form.reset();
            break;
        case 'enrollForm':
            showToast('Enquiry submitted! We will contact you shortly.', 'success');
            form.reset();
            break;
        default:
            showToast('Form submitted successfully!', 'success');
            if (form && form.reset) form.reset();
    }
}

function sendChatMessage(button) {
    const area = button ? button.closest('.chat-input-area') : null;
    const input = area ? area.querySelector('.chat-input') : $('.chat-input');
    const messagesContainer = area ? area.closest('.messages-chat').querySelector('.chat-messages') : $('.chat-messages');
    if (!input || !messagesContainer || !input.value.trim()) return;
    
    const message = input.value.trim();
    
    const sentMessage = createChatMessage(message, true);
    messagesContainer.appendChild(sentMessage);
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    setTimeout(() => {
        const replies = [
            'Thank you for your message! I will get back to you shortly.',
            'Great question! Let me check that for you.',
            "I'm here to help! What else would you like to know?",
            'That sounds wonderful! Let me provide more details.',
            'Absolutely! Would you like to schedule a visit?'
        ];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        const receivedMessage = createChatMessage(reply, false);
        messagesContainer.appendChild(receivedMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1200);
}

function createChatMessage(text, isSent) {
    const wrapper = document.createElement('div');
    wrapper.className = `chat-message ${isSent ? 'sent' : 'received'}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    wrapper.innerHTML = `
        <div class="chat-bubble">
            <div class="chat-text">${text}</div>
            <div class="chat-time">${timeStr}</div>
        </div>
    `;
    return wrapper;
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check' : type === 'error' ? 'fa-times' : 'fa-info-circle';
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div>
            <strong>${type === 'success' ? 'Success!' : type === 'error' ? 'Error!' : 'Info'}</strong>
            <div style="font-size: 0.85rem; opacity: 0.85;">${message}</div>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

function initDashboard() {
    initMessageList();
    initPagination();
    initChartActions();
    initSidebarToggle();
    initDashboardMenu();
    initDashboardActions();
    initDashboardSearch();
    initSettingsForm();
}

function initDashboardMenu() {
    const sidebarLinks = document.querySelectorAll('.dashboard-menu a[data-section]');
    const dashboardOverview = document.getElementById('dashboardOverview');
    const sections = document.querySelectorAll('.dashboard-section');

    if (!sidebarLinks.length || !sections.length) {
        return;
    }

    const showSection = (sectionName) => {
        sidebarLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === sectionName);
        });

        if (dashboardOverview) {
            dashboardOverview.style.display = sectionName === 'dashboard' ? '' : 'none';
        }

        sections.forEach((section) => {
            const isVisible = section.dataset.section === sectionName;
            section.hidden = !isVisible;
        });
    };

    sidebarLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            showSection(link.dataset.section);
        });
    });

    showSection('dashboard');
}

function initMessageList() {
    $$('.message-item').forEach(item => {
        item.addEventListener('click', () => {
            const layout = item.closest('.messages-layout');
            layout.querySelectorAll('.message-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            item.classList.remove('unread');

            const sender = item.querySelector('.message-sender').textContent;
            const initials = item.querySelector('.message-avatar').textContent;
            const preview = item.querySelector('.message-preview').textContent;
            const chatUser = layout.querySelector('.chat-user-info h4');
            const chatAvatar = layout.querySelector('.chat-user .message-avatar');
            const chatMessages = layout.querySelector('.chat-messages');
            if (chatUser) chatUser.textContent = sender;
            if (chatAvatar) chatAvatar.textContent = initials;
            if (chatMessages) chatMessages.innerHTML = `<div class="chat-message received"><div class="chat-bubble"><div class="chat-text">${preview}</div><div class="chat-time">Just now</div></div></div>`;
        });
    });
}

function initPagination() {
    $$('.pagination button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.disabled) return;
            const page = btn.textContent.trim();
            if (page === '‹' || page === '›') return;
            
            $$('.pagination button').forEach(b => b.classList.remove('active'));
            if (!isNaN(page)) {
                btn.classList.add('active');
                showToast(`Page ${page}`);
            }
        });
    });
}

function initChartActions() {
    $$('.chart-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.closest('.chart-actions');
            if (group) {
                group.querySelectorAll('.chart-action-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const values = { Week: [28, 34, 42, 56, 68, 76, 84], Month: [44, 58, 35, 66, 72, 55, 90], Year: [36, 48, 62, 54, 78, 86, 96] }[btn.textContent.trim()];
                group.closest('.chart-card').querySelectorAll('.chart-bar').forEach((bar, index) => {
                    bar.style.height = `${values[index]}%`;
                    bar.dataset.value = values[index];
                });
            }
        });
    });
}

function initSidebarToggle() {
    const sidebarToggle = $('#sidebarToggle');
    const sidebar = $('.dashboard-sidebar');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
}

function initDashboardActions() {
    $$('[data-dashboard-action]').forEach(control => {
        control.addEventListener('click', (event) => {
            event.preventDefault();
            const action = control.dataset.dashboardAction;
            if (action === 'orders' || action === 'messages' || action === 'settings') {
                const menuLink = document.querySelector(`.dashboard-menu a[data-section="${action}"]`);
                if (menuLink) menuLink.click();
            } else if (action === 'notifications') {
                showToast('You are all caught up — no new notifications.', 'info');
                const badge = control.querySelector('.header-badge');
                if (badge) badge.remove();
            } else {
                quickAction(action);
            }
        });
    });
}

function initDashboardSearch() {
    $$('[data-dashboard-search]').forEach(input => {
        input.addEventListener('input', () => {
            const query = input.value.trim().toLowerCase();
            if (!query) return;
            const matchingSection = Array.from(document.querySelectorAll('.dashboard-section')).find(section => section.textContent.toLowerCase().includes(query));
            const menuLink = matchingSection && document.querySelector(`.dashboard-menu a[data-section="${matchingSection.dataset.section}"]`);
            if (menuLink) menuLink.click();
        });
    });

    $$('[data-message-search]').forEach(input => {
        input.addEventListener('input', () => {
            const query = input.value.trim().toLowerCase();
            input.closest('.messages-list').querySelectorAll('.message-item').forEach(item => {
                item.hidden = Boolean(query) && !item.textContent.toLowerCase().includes(query);
            });
        });
    });
}

function initSettingsForm() {
    const form = $('#settingsForm');
    if (!form) return;
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const inputs = form.querySelectorAll('input');
        const studioName = inputs[0].value.trim();
        if (!studioName) {
            showToast('Studio name is required.', 'error');
            return;
        }
        localStorage.setItem('sweetcraftSettings', JSON.stringify({ studioName, notifications: form.querySelector('select').value, workingHours: inputs[1].value.trim() }));
        showToast('Settings saved successfully.', 'success');
    });
}

function enrollCourse(courseName) {
    showToast(`Enrolling in ${courseName}...`, 'info');
    setTimeout(() => {
        showToast(`Successfully enrolled in ${courseName}!`, 'success');
    }, 1000);
}

function buyVoucher(value) {
    showToast(`Adding ${value} voucher to cart...`, 'info');
    setTimeout(() => {
        showToast(`${value} voucher added to cart!`, 'success');
    }, 1000);
}

function selectPlan(planName) {
    showToast(`Selecting ${planName} plan...`, 'info');
    setTimeout(() => {
        showToast(`${planName} plan selected!`, 'success');
    }, 1000);
}

function viewBlog(title) {
    const slug = String(title || 'blog')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'blog';

    localStorage.setItem('sweetcraftBlogSlug', slug);
    showToast(`Opening: ${title}`, 'info');
    setTimeout(() => {
        window.location.href = `blog-details.html?slug=${encodeURIComponent(slug)}`;
    }, 500);
}

function viewService(service) {
    showToast(`Opening ${service} details...`, 'info');
    setTimeout(() => {
        window.location.href = 'service-details.html';
    }, 500);
}

function viewGallery(item) {
    showToast(`Viewing: ${item}`, 'info');
}

function scheduleEnroll(batch) {
    showToast(`Enrolling in ${batch} batch...`, 'info');
    setTimeout(() => {
        showToast(`Enrolled in ${batch}! Contact form sent.`, 'success');
    }, 1000);
}

function deleteItem(itemType, itemName, event) {
    if (confirm(`Are you sure you want to delete this ${itemType}?`)) {
        showToast(`${itemName} deleted!`, 'success');
        const target = event && event.target ? event.target : null;
        const row = target ? target.closest('tr') : document.querySelector('tr[data-item="' + itemName + '"]');
        if (row) {
            row.style.transition = 'all 0.3s';
            row.style.opacity = '0';
            setTimeout(() => row.remove(), 300);
        }
    }
}

function editItem(itemType, itemName) {
    showToast(`Editing ${itemType}: ${itemName}`, 'info');
}

function viewItem(itemType, itemName) {
    const existing = $('.item-modal');
    if (existing) existing.remove();
    const modal = document.createElement('div');
    modal.className = 'item-modal';
    modal.innerHTML = `<div class="item-modal-card" role="dialog" aria-modal="true" aria-label="${itemType} details"><button class="item-modal-close" type="button" aria-label="Close">&times;</button><p class="section-tag">${itemType}</p><h2>${itemName}</h2><p>This is the selected ${itemType.toLowerCase()} record in the SweetCraft dashboard.</p><button class="btn btn-primary item-modal-close" type="button">Close</button></div>`;
    modal.querySelectorAll('.item-modal-close').forEach(button => button.addEventListener('click', () => modal.remove()));
    modal.addEventListener('click', event => { if (event.target === modal) modal.remove(); });
    document.body.appendChild(modal);
}

function quickAction(action) {
    switch(action) {
        case 'add-user':
            showToast('Opening add user form...', 'info');
            break;
        case 'export':
            downloadDashboardFile('sweetcraft-dashboard-data.csv', 'Customer,Course,Amount,Status\nSarah Lee,French Pastry Essentials,499,Completed\nDaniel Brown,Wedding Cake Mastery,799,Processing\nMeera Nair,Artisan Bread Workshop,349,Pending\n', 'text/csv');
            showToast('Dashboard data exported.', 'success');
            break;
        case 'settings':
            const settingsLink = document.querySelector('.dashboard-menu a[data-section="settings"]');
            if (settingsLink) settingsLink.click();
            break;
        case 'report':
            downloadDashboardFile('sweetcraft-performance-report.txt', 'SweetCraft Performance Report\n\nTotal users: 12.4K\nOrders: 4,286\nRevenue: ₹68.2K\nMessages: 1,324\n', 'text/plain');
            showToast('Performance report generated.', 'success');
            break;
        default:
            showToast(`Action: ${action}`, 'info');
    }
}

function downloadDashboardFile(filename, content, type) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([content], { type }));
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', () => {
    let scrollBtn = $('#scrollToTop');
    if (!scrollBtn) {
        scrollBtn = document.createElement('button');
        scrollBtn.id = 'scrollToTop';
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 2rem;
            left: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: linear-gradient(135deg, #D2691E, #FF6B6B);
            color: white;
            font-size: 1.25rem;
            cursor: pointer;
            z-index: 999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(210, 105, 30, 0.4);
        `;
        scrollBtn.addEventListener('click', scrollToTop);
        document.body.appendChild(scrollBtn);
    }
    
    if (window.scrollY > 300) {
        scrollBtn.style.opacity = '1';
        scrollBtn.style.visibility = 'visible';
    } else {
        scrollBtn.style.opacity = '0';
        scrollBtn.style.visibility = 'hidden';
    }
    
    if (document.body.classList.contains('rtl')) {
        scrollBtn.style.left = 'auto';
        scrollBtn.style.right = '2rem';
    }
});
