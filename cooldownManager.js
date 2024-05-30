module.exports = {
  data: new Map(),
  defaultCooldown: 300,

  addUser(userId, duration = this.defaultCooldown) {
    if (duration === 0) return
    this.data.set(userId, Date.now() + duration * 1000)
    setTimeout(() => {
      if (this.data.has(userId)) this.data.delete(userId)
    }, duration * 1000)
  },

  removeUser(userId) {
    return !!this.data.delete(userId);
  },

  checkUser(userId) {
    const now = Date.now()
    const endTime = this.data.get(userId);
    return endTime && endTime > now ? endTime - now : 0;
  }
}
