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
    btn.textContent = isRTL ? 'LTR' : 'RTL';
    if (isRTL) {
        btn.classList.add('active');
        btn.setAttribute('title', 'Switch to LTR');
    } else {
        btn.classList.remove('active');
        btn.setAttribute('title', 'Switch to RTL');
    }
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
    const loggedIn = isUserLoggedIn();
    const navActionsContainers = document.querySelectorAll('.nav-actions');

    navActionsContainers.forEach((container) => {
        // Remove any loose auth buttons/links directly under .nav-actions
        const strayAuth = container.querySelectorAll(':scope > a[href*="login"], :scope > a[href*="register"], :scope > button[data-auth-role], :scope > a[data-auth-role]');
        strayAuth.forEach((item) => item.remove());

        // Find or consolidate .auth-nav-actions container
        const allAuthGroups = container.querySelectorAll('.auth-nav-actions');
        let authGroup = allAuthGroups[0];
        if (allAuthGroups.length > 1) {
            for (let i = 1; i < allAuthGroups.length; i++) {
                allAuthGroups[i].remove();
            }
        }

        if (!authGroup) {
            authGroup = document.createElement('div');
            authGroup.className = 'auth-nav-actions';
            authGroup.setAttribute('data-auth-container', 'true');
            const mobileToggle = container.querySelector('.mobile-toggle');
            if (mobileToggle) {
                container.insertBefore(authGroup, mobileToggle);
            } else {
                container.appendChild(authGroup);
            }
        }

        authGroup.style.display = 'flex';
        authGroup.style.alignItems = 'center';
        authGroup.style.gap = '0.75rem';

        // Clear existing content inside authGroup to prevent duplicates
        authGroup.innerHTML = '';

        if (loggedIn) {
            const logoutBtn = document.createElement('button');
            logoutBtn.type = 'button';
            logoutBtn.className = 'btn btn-primary';
            logoutBtn.textContent = 'Logout';
            logoutBtn.style.padding = '0.625rem 1.25rem';
            logoutBtn.style.fontSize = '0.875rem';
            logoutBtn.setAttribute('data-auth-role', 'logout');
            logoutBtn.addEventListener('click', logoutUser);

            authGroup.appendChild(logoutBtn);
        } else {
            const loginLink = document.createElement('a');
            loginLink.href = 'login.html';
            loginLink.className = 'btn btn-primary';
            loginLink.textContent = 'Login';
            loginLink.style.padding = '0.625rem 1.5rem';
            loginLink.style.fontSize = '0.875rem';
            loginLink.setAttribute('data-auth-role', 'login');

            authGroup.appendChild(loginLink);
        }
    });

    const mobileMenuNav = document.querySelector('.mobile-menu-nav');
    if (mobileMenuNav) {
        // Remove all previous mobile auth list items cleanly
        const existingAuthItems = mobileMenuNav.querySelectorAll('.mobile-auth-item, [data-auth-mobile]');
        if (existingAuthItems.length > 0) {
            existingAuthItems.forEach((item) => item.remove());
        }

        // Also clean up any loose un-tagged auth links
        mobileMenuNav.querySelectorAll('a[href*="login"], a[href*="register"]').forEach((link) => {
            const parentLi = link.closest('li');
            if (parentLi && parentLi.parentElement === mobileMenuNav) {
                parentLi.remove();
            } else {
                link.remove();
            }
        });

        if (loggedIn) {
            const logoutItem = document.createElement('li');
            logoutItem.className = 'mobile-auth-item';
            logoutItem.setAttribute('data-auth-mobile', 'true');
            const logoutLink = document.createElement('a');
            logoutLink.href = '#';
            logoutLink.textContent = 'Logout';
            logoutLink.addEventListener('click', logoutUser);
            logoutItem.appendChild(logoutLink);

            mobileMenuNav.appendChild(logoutItem);
        } else {
            const loginItem = document.createElement('li');
            loginItem.className = 'mobile-auth-item';
            loginItem.setAttribute('data-auth-mobile', 'true');
            const loginLink = document.createElement('a');
            loginLink.href = 'login.html';
            loginLink.textContent = 'Login / Register';
            loginItem.appendChild(loginLink);

            mobileMenuNav.appendChild(loginItem);
        }
    }

    const rawPath = window.location.pathname.replace(/\/$/, '').split('/').pop() || '';
    const cleanPath = rawPath.replace(/\.html$/, '').toLowerCase();
    if ((cleanPath === 'login' || cleanPath === 'register') && loggedIn) {
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
