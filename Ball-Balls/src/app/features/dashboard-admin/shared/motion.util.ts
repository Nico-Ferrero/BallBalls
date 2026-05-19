import { animate, inView } from 'motion';

const ENTER_KEYFRAMES = {
  opacity: [0, 1],
  y: [14, 0],
  filter: ['blur(6px)', 'blur(0px)']
};

const SPRING = {
  type: 'spring' as const,
  stiffness: 180,
  damping: 22,
  mass: 0.9
};

export function revealOnView(host: HTMLElement, selector = '[data-reveal]'): () => void {
  const nodes = Array.from(host.querySelectorAll<HTMLElement>(selector));
  if (!nodes.length) {
    return () => undefined;
  }

  for (const node of nodes) {
    node.style.opacity = '0';
    node.style.transform = 'translateY(14px)';
    node.style.filter = 'blur(6px)';
    node.style.willChange = 'transform, opacity, filter';
  }

  const stops = nodes.map((node, index) =>
    inView(node, () => {
      animate(node, ENTER_KEYFRAMES, {
        ...SPRING,
        delay: Math.min(index, 6) * 0.06
      });
      return () => undefined;
    })
  );

  return () => stops.forEach((stop) => stop());
}

export function pressFeedback(target: HTMLElement): void {
  animate(target, { scale: [0.96, 1] }, SPRING);
}
