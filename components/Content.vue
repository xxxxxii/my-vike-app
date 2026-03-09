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
/* Page Transition Animation */
body.page-transition #page-content {
  opacity: 0;
}
</style>

<style scoped>
#page-container {
  width: 100%;
}

#page-content {
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
  width: 100%;
  box-sizing: content-box;
  padding-bottom: 50px;
  min-height: 100vh;
}
</style>
