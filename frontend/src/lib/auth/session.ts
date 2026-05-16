export function getCurrentUserId() {
  const userId = Number(localStorage.getItem("user_id"));
  return Number.isFinite(userId) && userId > 0 ? userId : null;
}

export function isCurrentUser(ownerId?: number | null) {
  return Boolean(ownerId && ownerId === getCurrentUserId());
}
