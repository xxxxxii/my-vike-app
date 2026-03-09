<template>
  <main class="home-page">
    <!-- Hero 区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-badge">🚀 Vike + Vue</div>
        <h1 class="hero-title">
          欢迎来到<br />
          <span class="highlight">我的技术博客</span>
        </h1>
        <p class="hero-desc">
          探索前端技术世界，分享开发心得与最佳实践。
          基于 Vike + Vue 构建，静态生成带来极速体验。
        </p>
        <div class="hero-actions">
          <a href="/blog" class="btn-primary">
            <span class="btn-icon">📚</span>
            浏览文章
          </a>
          <a href="/todo" class="btn-secondary">
            <span class="btn-icon">✓</span>
            待办应用
          </a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="code-card">
          <div class="code-header">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <pre class="code-content"><code><span class="keyword">import</span> { <span class="func">createApp</span> } <span class="keyword">from</span> <span class="string">'vue'</span>;
<span class="keyword">import</span> { <span class="func">vike</span> } <span class="keyword">from</span> <span class="string">'vike'</span>;

<span class="keyword">const</span> app = <span class="func">createApp</span>(App);
app.<span class="func">use</span>(vike);</code></pre>
        </div>
      </div>
    </section>

    <!-- 特性卡片 -->
    <section class="features-section">
      <h2 class="section-title">✨ 网站特性</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>闪电加载</h3>
          <p>静态生成 (SSG) + 预渲染，首页毫秒级响应，享受飞一般的访问体验。</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📝</div>
          <h3>Markdown 写作</h3>
          <p>使用 Markdown 轻松编写文章，支持代码高亮、目录自动生成。</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💬</div>
          <h3>评论互动</h3>
          <p>集成 Giscus 评论系统，基于 GitHub Discussions 实现优雅互动。</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3>完美适配</h3>
          <p>响应式设计，完美兼容桌面端与移动端，随时随地浏览无障碍。</p>
        </div>
      </div>
    </section>

    <!-- 快速导航 -->
    <section class="quick-links-section">
      <h2 class="section-title">🔗 快速导航</h2>
      <div class="quick-links">
        <a href="/blog" class="quick-link-card">
          <span class="link-icon">📚</span>
          <div class="link-content">
            <span class="link-title">技术博客</span>
            <span class="link-desc">浏览最新技术文章</span>
          </div>
          <span class="link-arrow">→</span>
        </a>
        <a href="/todo" class="quick-link-card">
          <span class="link-icon">📝</span>
          <div class="link-content">
            <span class="link-title">待办事项</span>
            <span class="link-desc">体验 Vue 交互组件</span>
          </div>
          <span class="link-arrow">→</span>
        </a>
        <a href="/star-wars" class="quick-link-card">
          <span class="link-icon">🎬</span>
          <div class="link-content">
            <span class="link-title">星球大战</span>
            <span class="link-desc">SSR 数据获取示例</span>
          </div>
          <span class="link-arrow">→</span>
        </a>
      </div>
    </section>

    <!-- 关于 -->
    <section class="about-section">
      <div class="about-card">
        <h2 class="section-title">ℹ️ 关于本站</h2>
        <p>
          这是一个基于 <strong>Vike + Vite + Vue</strong> 构建的现代化博客模版。
          展示了如何利用最新的前端技术构建高性能 Web 应用。
        </p>
        <ul class="about-features">
          <li>✅ 静态生成 (SSG) - 构建时预渲染所有页面</li>
          <li>✅ 服务端渲染 (SSR) - 支持动态内容</li>
          <li>✅ Markdown 博客 - 轻松写作，自动生成目录</li>
          <li>✅ 客户端交互 - Vue 组件按需加载</li>
        </ul>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.25rem;
}

/* Hero 区域 */
.hero-section {
  display: flex;
  align-items: center;
  gap: 3rem;
  padding: 3rem 0;
  min-height: 400px;
}

.hero-content {
  flex: 1;
}

.hero-badge {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 20px;
  margin-bottom: 1.25rem;
}

.hero-title {
  font-size: 2.8rem;
  font-weight: 800;
  line-height: 1.15;
  margin: 0 0 1.25rem;
  color: var(--color-text, #1f2937);
  letter-spacing: -1px;
}

.hero-title .highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: 1.1rem;
  color: var(--color-text-muted, #6b7280);
  line-height: 1.7;
  margin: 0 0 1.75rem;
  max-width: 520px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.btn-secondary {
  background: #fff;
  color: var(--color-text, #374151);
  border: 2px solid var(--color-border, #e5e7eb);
}

.btn-secondary:hover {
  border-color: var(--color-primary, #667eea);
  color: var(--color-primary, #667eea);
}

.btn-icon {
  font-size: 1rem;
}

/* 代码卡片 */
.hero-visual {
  flex: 1;
  display: flex;
  justify-content: center;
}

.code-card {
  background: #1e293b;
  border-radius: 12px;
  padding: 1.25rem;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.code-header {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.red { background: #ef4444; }
.dot.yellow { background: #eab308; }
.dot.green { background: #22c55e; }

.code-content {
  margin: 0;
  font-family: "SF Mono", Monaco, Consolas, monospace;
  font-size: 0.8rem;
  line-height: 1.7;
  color: #e2e8f0;
  overflow-x: auto;
}

.code-content .keyword { color: #c084fc; }
.code-content .func { color: #60a5fa; }
.code-content .string { color: #34d399; }

/* 通用区块标题 */
.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1.5rem;
  color: var(--color-text, #1f2937);
}

/* 特性卡片 */
.features-section {
  padding: 2rem 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;
}

.feature-card {
  background: #fff;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border-color: var(--color-primary, #667eea);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.feature-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--color-text, #1f2937);
}

.feature-card p {
  font-size: 0.9rem;
  color: var(--color-text-muted, #6b7280);
  margin: 0;
  line-height: 1.6;
}

/* 快速导航 */
.quick-links-section {
  padding: 2rem 0;
}

.quick-links {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.quick-link-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: #fff;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.quick-link-card:hover {
  border-color: var(--color-primary, #667eea);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.link-icon {
  font-size: 1.75rem;
}

.link-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.link-title {
  font-weight: 600;
  color: var(--color-text, #1f2937);
  font-size: 1rem;
}

.link-desc {
  font-size: 0.85rem;
  color: var(--color-text-muted, #9ca3af);
}

.link-arrow {
  font-size: 1.25rem;
  color: var(--color-text-muted, #d1d5db);
  transition: color 0.2s ease;
}

.quick-link-card:hover .link-arrow {
  color: var(--color-primary, #667eea);
}

/* 关于 */
.about-section {
  padding: 2rem 0 3rem;
}

.about-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--color-border, #e2e8f0);
}

.about-card p {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--color-text, #475569);
  margin: 0 0 1.25rem;
}

.about-card strong {
  color: var(--color-primary, #667eea);
}

.about-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.about-features li {
  font-size: 0.9rem;
  color: var(--color-text, #475569);
}

/* 响应式 */
@media (max-width: 900px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 2rem 0;
  }

  .hero-desc {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-visual {
    display: none;
  }

  .hero-title {
    font-size: 2.2rem;
  }
}

@media (max-width: 600px) {
  .home-page {
    padding: 1.5rem 1rem;
  }

  .hero-title {
    font-size: 1.85rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .about-card {
    padding: 1.5rem;
  }

  .about-features {
    grid-template-columns: 1fr;
  }
}
</style>
