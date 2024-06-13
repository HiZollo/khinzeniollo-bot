module.exports = {
  energy: 10,
  maxEnergy: 10,
  refillInterval: 60 * 60e3,
  refillTimeout: null,
  nextRefillTimestamp: null,

  initialize(initialEnergy = this.maxEnergy, initialCountdown = null) {
    this.energy = initialEnergy;
    if (initialCountdown !== null) {
      this.startRefillTimer(initialCountdown);
    } else if (this.energy < this.maxEnergy) {
      this.startRefillTimer();
    }
  },

  startRefillTimer(nexttime = null) {
    this.nextRefillTimestamp = nexttime ?? Date.now() + this.refillInterval
    this.refillTimeout = setTimeout(() => {
      if (this.energy < this.maxEnergy) {
        this.energy += 1
        console.log(`Energy refilled: ${this.energy}/${this.maxEnergy}`)
        if (this.energy < this.maxEnergy) {
          this.startRefillTimer()
        } else {
          this.clearRefillTimer()
        }
      }
    }, this.refillInterval)
  },

  clearRefillTimer() {
    clearTimeout(this.refillTimeout)
    this.refillTimeout = null
    this.nextRefillTimestamp = null
  },

  useEnergy(amount = 1) {
    if (this.energy >= amount) {
      this.energy -= amount
      if (this.energy < this.maxEnergy && !this.refillTimeout) {
        this.startRefillTimer()
      }
      return true
    } else {
      return false
    }
  },

  addEnergy(amount = 1) {
    this.energy += amount;
    if (this.energy >= this.maxEnergy) {
      this.clearRefillTimer()
    }
  },

  refillMaxEnergy() {
    this.energy = this.maxEnergy
    this.clearRefillTimer()
  },

  getEnergy() {
    return this.energy
  },

  getNextRefillTime() {
    if (this.nextRefillTimestamp) {
      const remainingTime = this.nextRefillTimestamp - Date.now()
      return remainingTime > 0 ? remainingTime : null
    }
    return null
  },

  getNextRefillTimestamp() {
    return this.nextRefillTimestamp
  }
}
