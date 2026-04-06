// utils/formatTimeAgo.ts
export function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();

  const minutes = Math.floor(diffMs / 60_000);
  const hours   = Math.floor(diffMs / 3_600_000);
  const days    = Math.floor(diffMs / 86_400_000);
  const weeks   = Math.floor(days / 7);
  const months  = Math.floor(days / 30);

  if (minutes < 60)  return `${minutes}m ago`;
  if (hours < 24)    return `${hours}h ago`;
  if (days < 7)      return `${days}d ago`;
  if (weeks < 4)     return `${weeks}w ago`;
  return `${months}mo ago`;
}