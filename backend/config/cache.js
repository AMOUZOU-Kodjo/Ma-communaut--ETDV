// config/cache.js
// Cache en mémoire léger — évite les allers-retours DB répétés pour les
// données peu changeantes (stats, listes de médias, programmes).
// Pas de dépendance externe, fonctionne en dev et en prod Render.

class MemoryCache {
  constructor() {
    this._store = new Map();
  }

  /**
   * Récupère une valeur. Retourne null si absente ou expirée.
   * @param {string} key
   */
  get(key) {
    const entry = this._store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this._store.delete(key);
      return null;
    }
    return entry.value;
  }

  /**
   * Stocke une valeur avec TTL en secondes.
   * @param {string} key
   * @param {*} value
   * @param {number} ttlSeconds  - durée de vie en secondes (défaut: 60)
   */
  set(key, value, ttlSeconds = 60) {
    this._store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  /**
   * Supprime une ou plusieurs clés (supporte les préfixes avec *)
   * @param {string} keyOrPrefix
   */
  invalidate(keyOrPrefix) {
    if (keyOrPrefix.endsWith('*')) {
      const prefix = keyOrPrefix.slice(0, -1);
      for (const key of this._store.keys()) {
        if (key.startsWith(prefix)) this._store.delete(key);
      }
    } else {
      this._store.delete(keyOrPrefix);
    }
  }

  /** Vide tout le cache */
  clear() {
    this._store.clear();
  }

  /** Nombre d'entrées actives */
  get size() {
    return this._store.size;
  }
}

// Singleton partagé dans tout le backend
const cache = new MemoryCache();

// ── TTL par type de ressource ─────────────────────────
const TTL = {
  STATS:    30,   // secondes — stats dashboard (30s)
  POSTS:    20,   // liste des posts
  MEDIA:    20,   // liste des médias
  PROGRAMS: 60,   // programmes (changent peu)
  VISITORS: 15,   // visiteurs (changent souvent)
};

module.exports = { cache, TTL };
