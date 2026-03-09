export async function onPageTransitionEnd() {
  console.log("Page transition end");
  document.body.classList.remove("page-transition");
  
  // 添加 page-entered 类触发动画
  document.body.classList.add("page-entered");
  
  // 动画完成后移除类
  setTimeout(() => {
    document.body.classList.remove("page-entered");
  }, 400);
}
