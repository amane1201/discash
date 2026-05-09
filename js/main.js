/**
 * Vending Bot - Main JavaScript
 * Discord自販機BOT公式サイト
 * 
 * 機能:
 * - ローディング画面
 * - スクロールアニメーション
 * - ナビゲーション制御
 * - パーティクル生成
 * - マウス追従ライト
 * - カウントアップアニメーション
 * - Discordモックメッセージ
 * - FAQアコーディオン
 * - トースト通知
 * - スクロールプログレス
 */

// ============================================
// ローディング画面
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  
  setTimeout(() => {
    loader.classList.add('hidden');
    initAnimations();
  }, 800);
});

// ============================================
// 初期化
// ============================================
function initAnimations() {
  initScrollProgress();
  initNavbar();
  initScrollReveal();
  initParticles();
  initMouseLight();
  initCountUp();
  initDiscordMock();
  initMobileMenu();
  initOnlineCounter();
}

// ============================================
// スクロールプログレスバー
// ============================================
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });
}

// ============================================
// ナビゲーション制御
// ============================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    // スクロール位置でスタイル変更
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }, { passive: true });
}

// ============================================
// モバイルメニュー
// ============================================
function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('mobileMenu');
  
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
      
      // アニメーション付きでハンバーガーアイコンを変更
      const spans = toggle.querySelectorAll('span');
      if (menu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
    
    // メニューリンクをクリックで閉じる
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        const spans = toggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }
}

// ============================================
// スクロール表示アニメーション
// ============================================
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  reveals.forEach(el => revealObserver.observe(el));
}

// ============================================
// パーティクル生成
// ============================================
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  
  // モバイルではパーティクルを減らす
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const particleCount = isMobile ? 15 : 30;
  
  for (let i = 0; i < particleCount; i++) {
    createParticle(container);
  }
}

function createParticle(container) {
  const particle = document.createElement('div');
  particle.classList.add('particle');
  
  // ランダムな位置とサイズ
  const size = Math.random() * 4 + 2;
  const left = Math.random() * 100;
  const delay = Math.random() * 15;
  const duration = Math.random() * 10 + 15;
  
  // 色のバリエーション
  const colors = ['#00d4ff', '#00f0ff', '#8b5cf6', '#5865F2'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  particle.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${left}%;
    bottom: -10px;
    background: ${color};
    opacity: ${Math.random() * 0.5 + 0.2};
    animation-delay: ${delay}s;
    animation-duration: ${duration}s;
  `;
  
  container.appendChild(particle);
  
  // アニメーション終了後に削除して再生成
  setTimeout(() => {
    particle.remove();
    createParticle(container);
  }, (delay + duration) * 1000);
}

// ============================================
// マウス追従ライト
// ============================================
function initMouseLight() {
  const light = document.getElementById('mouseLight');
  if (!light) return;
  
  // モバイルでは無効化
  if (window.matchMedia('(max-width: 768px)').matches) {
    light.style.display = 'none';
    return;
  }
  
  let mouseX = 0;
  let mouseY = 0;
  let lightX = 0;
  let lightY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });
  
  function animateLight() {
    // 遅延追従（スムージング）
    lightX += (mouseX - lightX) * 0.1;
    lightY += (mouseY - lightY) * 0.1;
    
    light.style.left = `${lightX - 150}px`;
    light.style.top = `${lightY - 150}px`;
    
    requestAnimationFrame(animateLight);
  }
  
  animateLight();
}

// ============================================
// カウントアップアニメーション
// ============================================
function initCountUp() {
  const counters = document.querySelectorAll('[data-count]');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const countTo = parseFloat(target.getAttribute('data-count'));
        const duration = 2000; // 2秒
        const startTime = performance.now();
        
        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // イージング関数（easeOutQuart）
          const easeProgress = 1 - Math.pow(1 - progress, 4);
          const current = countTo * easeProgress;
          
          // 小数点以下の表示制御
          if (countTo % 1 === 0) {
            target.textContent = Math.floor(current).toLocaleString();
          } else {
            target.textContent = current.toFixed(1);
          }
          
          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            target.textContent = countTo.toLocaleString();
          }
        }
        
        requestAnimationFrame(updateCount);
        counterObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => counterObserver.observe(counter));
}

// ============================================
// Discordモックメッセージ
// ============================================
function initDiscordMock() {
  const container = document.getElementById('discordMessages');
  if (!container) return;
  
  const messages = [
    {
      username: 'VendingBot',
      tag: 'BOT',
      avatar: 'VB',
      color: '#00d4ff',
      content: '🎉 新しい取引が完了しました！',
      embed: {
        title: '購入情報',
        fields: [
          { name: '商品', value: 'Discord Nitro 1ヶ月' },
          { name: '金額', value: '¥500' }
        ]
      }
    },
    {
      username: 'User#1234',
      content: '!buy nitro-1month',
      time: '2分前'
    },
    {
      username: 'VendingBot',
      tag: 'BOT',
      avatar: 'VB',
      color: '#00d4ff',
      content: '✅ 商品をDMに送信しました！\n📦 在庫残り: 45個',
    }
  ];
  
  let currentIndex = 0;
  
  function showNextMessage() {
    if (currentIndex < messages.length) {
      const msg = messages[currentIndex];
      const msgEl = createDiscordMessage(msg);
      container.appendChild(msgEl);
      
      // アニメーション付きで表示
      msgEl.style.opacity = '0';
      msgEl.style.transform = 'translateY(20px)';
      
      requestAnimationFrame(() => {
        msgEl.style.transition = 'all 0.5s ease';
        msgEl.style.opacity = '1';
        msgEl.style.transform = 'translateY(0)';
      });
      
      currentIndex++;
      setTimeout(showNextMessage, 1500);
    }
  }
  
  // 初回表示を遅延
  setTimeout(showNextMessage, 1000);
}

function createDiscordMessage(msg) {
  const div = document.createElement('div');
  div.className = 'discord-message';
  
  const time = msg.time || 'たった今';
  
  let embedHtml = '';
  if (msg.embed) {
    const fieldsHtml = msg.embed.fields.map(field => `
      <div class="discord-embed-field-item">
        <div class="discord-embed-field-name">${field.name}</div>
        <div class="discord-embed-field-value">${field.value}</div>
      </div>
    `).join('');
    
    embedHtml = `
      <div class="discord-embed">
        <div class="discord-embed-title">${msg.embed.title}</div>
        <div class="discord-embed-field">${fieldsHtml}</div>
      </div>
    `;
  }
  
  const tagHtml = msg.tag ? `<span class="discord-bot-tag">${msg.tag}</span>` : '';
  const usernameColor = msg.color ? `style="color: ${msg.color}"` : '';
  
  div.innerHTML = `
    <div class="discord-avatar" style="background: ${msg.color || 'var(--color-discord)'}; color: white;">
      ${msg.avatar || 'U'}
    </div>
    <div class="discord-content">
      <div class="discord-author">
        <span class="discord-username" ${usernameColor}>${msg.username}</span>
        ${tagHtml}
        <span class="discord-time">${time}</span>
      </div>
      <div class="discord-text">${msg.content}</div>
      ${embedHtml}
    </div>
  `;
  
  return div;
}

// ============================================
// FAQアコーディオン
// ============================================
function toggleFaq(button) {
  const item = button.closest('.faq-item');
  const content = item.querySelector('.faq-content');
  const icon = button.querySelector('.faq-icon');
  
  // 他のアイテムを閉じる（オプション）
  // document.querySelectorAll('.faq-item').forEach(otherItem => {
  //   if (otherItem !== item && otherItem.classList.contains('active')) {
  //     otherItem.classList.remove('active');
  //     otherItem.querySelector('.faq-content').style.maxHeight = '0';
  //     otherItem.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
  //   }
  // });
  
  const isActive = item.classList.contains('active');
  
  if (isActive) {
    item.classList.remove('active');
    content.style.maxHeight = '0';
    icon.style.transform = 'rotate(0deg)';
  } else {
    item.classList.add('active');
    content.style.maxHeight = content.scrollHeight + 'px';
    icon.style.transform = 'rotate(180deg)';
  }
}

// ============================================
// トースト通知
// ============================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  
  const toast = document.createElement('div');
  
  const colors = {
    info: '#00d4ff',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  };
  
  const icons = {
    info: 'fa-info-circle',
    success: 'fa-check-circle',
    warning: 'fa-exclamation-triangle',
    error: 'fa-times-circle'
  };
  
  toast.style.cssText = `
    background: rgba(22, 22, 31, 0.95);
    border: 1px solid ${colors[type]}40;
    border-left: 4px solid ${colors[type]};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px ${colors[type]}20;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
    min-width: 300px;
    animation: toastSlideIn 0.3s ease forwards;
    backdrop-filter: blur(10px);
  `;
  
  toast.innerHTML = `
    <i class="fas ${icons[type]}" style="color: ${colors[type]}; font-size: 1.25rem;"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  // 自動削除
  setTimeout(() => {
    toast.style.animation = 'toastSlideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ============================================
// お問い合わせフォームハンドラ
// ============================================
function handleContactSubmit(event) {
  event.preventDefault();
  showToast('お問い合わせありがとうございます。サポートチームより連絡いたします。', 'success');
  event.target.reset();
}

// ============================================
// オンライン人数カウンター
// ============================================
function initOnlineCounter() {
  const counter = document.getElementById('onlineCount');
  if (!counter) return;
  
  let baseCount = 1234;
  
  // リアルタイム風の変動
  setInterval(() => {
    const change = Math.floor(Math.random() * 10) - 5;
    baseCount = Math.max(1000, Math.min(2000, baseCount + change));
    counter.textContent = baseCount.toLocaleString();
  }, 5000);
}

// ============================================
// スムーズスクロール（ポリフィル）
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// キーボードナビゲーション
// ============================================
document.addEventListener('keydown', (e) => {
  // ESCでモバイルメニューを閉じる
  if (e.key === 'Escape') {
    const menu = document.getElementById('mobileMenu');
    if (menu && menu.classList.contains('active')) {
      menu.classList.remove('active');
      const toggle = document.getElementById('mobileToggle');
      if (toggle) {
        const spans = toggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    }
  }
});

// ============================================
// パフォーマンス最適化：スクロールスロットリング
// ============================================
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// スクロールイベントのスロットリング適用
window.addEventListener('scroll', throttle(() => {
  // 必要に応じて追加のスクロール処理
}, 16)); // 60fps

// ============================================
// プリフェッチ（高速化）
// ============================================
if ('IntersectionObserver' in window) {
  const prefetchObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = entry.target.href;
        document.head.appendChild(link);
        prefetchObserver.unobserve(entry.target);
      }
    });
  });
  
  // ページ内リンクをプリフェッチ
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    prefetchObserver.observe(link);
  });
}

// ============================================
// コンソールブランディング
// ============================================
console.log(
  '%c〇〇 Vending Bot%c\nDiscord販売を自動化',
  'background: linear-gradient(135deg, #00d4ff 0%, #8b5cf6 100%); color: #0a0a0f; padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 16px;',
  'color: #00d4ff; font-size: 12px;'
);
