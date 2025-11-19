
// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 节流函数
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


function updateScrollProgress() {
  const scrollProgress = document.getElementById('scrollProgress');
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = scrollPercent + '%';
}

// 使用节流优化滚动性能
window.addEventListener('scroll', throttle(updateScrollProgress, 50));


const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// 点击导航链接后关闭菜单
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// 点击页面其他区域关闭菜单
document.addEventListener('click', (e) => {
  if (!e.target.closest('.resume-nav')) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  }
});

// 滚动时导航栏添加阴影效果
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  } else {
    navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
  }
});

const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// 从本地存储加载主题设置
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
  
  
  themeToggle.style.transform = 'rotate(360deg)';
  setTimeout(() => {
    themeToggle.style.transform = 'rotate(0deg)';
  }, 300);
});

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector('i');
  if (theme === 'dark') {
    icon.className = 'fas fa-sun';
  } else {
    icon.className = 'fas fa-moon';
  }
}

// 为所有项目头部添加点击事件
document.querySelectorAll('.project-header').forEach(header => {
  header.addEventListener('click', function() {
    const projectItem = this.closest('.project-item');
    
    // 切换展开状态
    projectItem.classList.toggle('expanded');
    
    // 添加展开/折叠动画效果
    const content = projectItem.querySelector('.project-content');
    if (projectItem.classList.contains('expanded')) {
      // 展开
      content.style.maxHeight = content.scrollHeight + 'px';
    } else {
      // 折叠
      content.style.maxHeight = '0';
    }
  });
});

const filterTags = document.querySelectorAll('.filter-tag');
const projectItems = document.querySelectorAll('.project-item');

filterTags.forEach(tag => {
  tag.addEventListener('click', function() {
    // 更新激活状态
    filterTags.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    
    const filter = this.getAttribute('data-filter');
    
    // 筛选项目
    projectItems.forEach(item => {
      const tech = item.getAttribute('data-tech');
      
      if (filter === 'all' || tech.includes(filter)) {
        item.classList.remove('hidden');
        // 添加淡入动画
        item.style.animation = 'fadeInUp 0.5s forwards';
      } else {
        item.classList.add('hidden');
      }
    });
  });
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const navHeight = document.querySelector('.resume-nav').offsetHeight;
      let targetPosition;
      
      // 检查目标元素是否在侧边栏中
      const isInSidebar = targetElement.closest('.resume-sidebar');
      
      if (isInSidebar) {
        // 对于侧边栏元素，滚动到侧边栏的开始位置（页面顶部）
        targetPosition = 0;
      } else {
        // 对于主内容区元素，滚动到元素位置减去导航栏高度
        targetPosition = targetElement.offsetTop - navHeight - 20;
      }
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // 关闭移动端菜单
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });
});


// Intersection Observer API 
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// 观察所有内容区块
document.querySelectorAll('.content-section').forEach(section => {
  observer.observe(section);
});


const skillsSection = document.querySelector('#skills');
let skillsAnimated = false;

const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !skillsAnimated) {
      animateSkills();
      skillsAnimated = true;
    }
  });
}, { threshold: 0.5 });

if (skillsSection) {
  skillsObserver.observe(skillsSection);
}

function animateSkills() {
  const progressBars = document.querySelectorAll('.progress');
  progressBars.forEach((bar, index) => {
    const width = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => {
      bar.style.width = width;
    }, index * 200);
  });
}


window.addEventListener('beforeprint', () => {
  // 打印前展开所有项目
  document.querySelectorAll('.project-item').forEach(item => {
    item.classList.add('expanded');
    const content = item.querySelector('.project-content');
    content.style.maxHeight = 'none';
  });
});

window.addEventListener('afterprint', () => {
  // 打印后恢复原状
  document.querySelectorAll('.project-item').forEach(item => {
    if (!item.classList.contains('expanded')) {
      const content = item.querySelector('.project-content');
      content.style.maxHeight = '0';
    }
  });
});


document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + P 打印
  if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
    e.preventDefault();
    window.print();
  }

  if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
    e.preventDefault();
    themeToggle.click();
  }
  

  if (e.key === 'Escape') {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  }
});


window.addEventListener('DOMContentLoaded', () => {

  
  // 初始化滚动进度
  updateScrollProgress();
  
  // 添加页面加载动画
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s';
    document.body.style.opacity = '1';
  }, 100);
});
// 监控页面性能
if ('performance' in window) {
  window.addEventListener('load', () => {
    const perfData = performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`📊 页面加载时间: ${pageLoadTime}ms`);
  });
}


// 为所有可点击元素添加涟漪效果
function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.classList.add('ripple');
  
  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  
  const existingRipple = button.querySelector('.ripple');
  if (existingRipple) {
    existingRipple.remove();
  }
  
  button.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 600);
}


document.querySelectorAll('button, .filter-tag').forEach(button => {
  button.addEventListener('click', createRipple);
});

// 添加涟漪效果样式
const style = document.createElement('style');
style.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);


// 懒加载图片
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}


window.addEventListener('error', (e) => {
  console.error('❌ 页面错误:', e.message);
});


// 按三次 Shift 键启用调试模式
let shiftPressCount = 0;
let shiftPressTimer;

document.addEventListener('keydown', (e) => {
  if (e.key === 'Shift') {
    shiftPressCount++;
    clearTimeout(shiftPressTimer);
    
    if (shiftPressCount === 3) {
      console.log('🔧 调试模式已启用');
      console.log('主题:', html.getAttribute('data-theme'));
      console.log('视口宽度:', window.innerWidth);
      console.log('滚动位置:', window.scrollY);
      shiftPressCount = 0;
    }
    
    shiftPressTimer = setTimeout(() => {
      shiftPressCount = 0;
    }, 1000);
  }
});

// 保存滚动位置
window.addEventListener('scroll', debounce(() => {
  sessionStorage.setItem('scrollPosition', window.scrollY);
}, 500));

// 恢复滚动位置
window.addEventListener('load', () => {
  const savedPosition = sessionStorage.getItem('scrollPosition');
  if (savedPosition) {
    setTimeout(() => {
      window.scrollTo({
        top: parseInt(savedPosition),
        behavior: 'smooth'
      });
    }, 100);
  }
});

window.addEventListener('online', () => {
  console.log('🌐 网络连接已恢复');
});

window.addEventListener('offline', () => {
  console.log('📡 网络连接已断开');
});

console.log('✅ 所有交互功能已加载完成！');
