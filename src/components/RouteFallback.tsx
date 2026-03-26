/** 懒加载页面时的占位：只应在 main 内出现，避免整页被 Suspense 换掉 */
export function RouteFallback() {
  return (
    <div className="px-4 py-8">
      <div className="h-7 w-28 animate-pulse rounded-lg bg-[var(--color-surface)]" />
      <div className="mt-4 h-36 animate-pulse rounded-2xl bg-[var(--color-surface)]" />
      <div className="mt-3 h-20 animate-pulse rounded-2xl bg-[var(--color-surface)]" />
    </div>
  )
}
