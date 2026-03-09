<template>
  <div id="page-container">
    <div id="page-content">
      <div>
        <slot />
      </div>
    </div>
  </div>
</template>

<style>
/* Page Transition Animation - 从右向左翻转效果 */

/* 页面离开时：从右向左翻转出去 */
body.page-transition #page-content {
  opacity: 0;
  transform: rotateY(-90deg) translateX(50px);
  transform-origin: left center;
}

/* 页面进入时：从左向右翻转进来 */
body.page-entered #page-content {
  opacity: 0;
  transform: rotateY(90deg) translateX(-50px);
  transform-origin: right center;
  animation: pageEnter 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes pageEnter {
  from {
    opacity: 0;
    transform: rotateY(90deg) translateX(-50px);
  }
  to {
    opacity: 1;
    transform: rotateY(0) translateX(0);
  }
}
</style>

<style scoped>
#page-container {
  width: 100%;
  overflow: hidden;
}

#page-content {
  opacity: 1;
  /* 从右向左翻转过渡效果 */
  transition: 
    opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  box-sizing: content-box;
  padding-bottom: 50px;
  min-height: 100vh;
  /* 添加透视效果增加立体感 */
  perspective: 1000px;
  transform-origin: left center;
  backface-visibility: hidden;
}
</style>
