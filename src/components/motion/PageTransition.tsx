import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

const prefersReduced =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/* 避免使用 x: 100% 横向移入：父级 main 有 overflow-hidden 时，整页会被裁在视区外，表现为「全屏/宽屏下白屏」 */
const variants = {
  initial: prefersReduced ? { opacity: 0 } : { y: 16, opacity: 0, scale: 0.98 },
  animate: prefersReduced
    ? { opacity: 1 }
    : {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: { type: 'spring' as const, stiffness: 200, damping: 25, mass: 0.8 },
      },
  exit: prefersReduced
    ? { opacity: 0 }
    : {
        y: -12,
        opacity: 0,
        scale: 0.98,
        transition: { duration: 0.25, ease: 'easeInOut' as const },
      },
}

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation()
  /*
   * 必须用 mode="wait"：sync 时退场页与进场页会同时挂在 DOM 里，两页高度叠加，
   * 新页面内容会被顶到视口下方（要往下滚才看得见）；手动刷新后只挂一页故正常。
   * 懒加载已放在 MainLayout 内，不再与外层 Suspense 抢时序。
   */
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        className="min-h-0 w-full min-w-0 flex-1"
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
