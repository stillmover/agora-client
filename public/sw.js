const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;
const GRAPHQL_CACHE = `graphql-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
];

const CACHE_DURATIONS = {
  STATIC: 7 * 24 * 60 * 60 * 1000,
  API: 5 * 60 * 1000,
  GRAPHQL: 2 * 60 * 1000,
  IMAGE: 30 * 24 * 60 * 60 * 1000,
};

const isStaticAsset = (url) => {
  return url.match(/\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|webp|ico)$/i) ||
    url.includes('/assets/') ||
    url === self.location.origin + '/' ||
    url === self.location.origin + '/index.html';
};

const isGraphQLRequest = (url) => {
  return url.includes('/graphql');
};

const isImageRequest = (url) => {
  return url.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|bmp)$/i) ||
    url.includes('image') ||
    url.includes('media') ||
    url.includes('thumbnail');
};

const isAPIRequest = (url) => {
  return url.includes('/api/') && !isGraphQLRequest(url);
};

const isMutation = async (request) => {
  if (!isGraphQLRequest(request.url)) return false;
  if (request.method !== 'POST') return false;
  
  try {
    const cloned = request.clone();
    const text = await cloned.text();
    try {
      const parsed = JSON.parse(text);
      return parsed.query && (
        parsed.query.includes('mutation') ||
        parsed.query.includes('create') ||
        parsed.query.includes('update') ||
        parsed.query.includes('delete') ||
        parsed.query.includes('vote') ||
        parsed.query.includes('join') ||
        parsed.query.includes('leave')
      );
    } catch {
      return false;
    }
  } catch {
    return false;
  }
};

const isAuthRequest = (url) => {
  return url.includes('/auth/') ||
    url.includes('/login') ||
    url.includes('/register') ||
    url.includes('/session');
};

const isCacheable = (request) => {
  const url = new URL(request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return false;
  }
  if (request.method !== 'GET') return false;
  if (isAuthRequest(request.url)) return false;
  return true;
};

const cacheFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    if (cached) return cached;
    throw error;
  }
};

const networkFirst = async (request, cacheName, maxAge = CACHE_DURATIONS.API) => {
  const cache = await caches.open(cacheName);
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cacheResponse = networkResponse.clone();
      cacheResponse.headers.set('sw-cached-at', Date.now().toString());
      await cache.put(request, cacheResponse);
    }
    return networkResponse;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      const cachedAt = cached.headers.get('sw-cached-at');
      if (cachedAt && Date.now() - parseInt(cachedAt) < maxAge) {
        return cached;
      }
    }
    const offlineResponse = await cache.match('/offline.html');
    if (offlineResponse) {
      return offlineResponse;
    }
    throw error;
  }
};

const staleWhileRevalidate = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      const cacheResponse = response.clone();
      cacheResponse.headers.set('sw-cached-at', Date.now().toString());
      cache.put(request, cacheResponse).catch(() => {});
    }
    return response;
  }).catch(() => null);
  
  if (cached) {
    fetchPromise.catch(() => {});
    return cached;
  }
  
  const response = await fetchPromise;
  if (response) return response;
  
  if (cached) return cached;
  
  const offlineResponse = await cache.match('/offline.html');
  if (offlineResponse) {
    return offlineResponse;
  }
  
  throw new Error('Network request failed and no cache available');
};

const networkOnly = async (request) => {
  return fetch(request);
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => 
            name.startsWith('static-') && name !== STATIC_CACHE ||
            name.startsWith('api-') && name !== API_CACHE ||
            name.startsWith('graphql-') && name !== GRAPHQL_CACHE ||
            name.startsWith('images-') && name !== IMAGE_CACHE
          )
          .map(name => caches.delete(name))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  if (!isCacheable(request)) {
    return;
  }
  
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }
  
  if (isImageRequest(request.url)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }
  
  if (isGraphQLRequest(request.url)) {
    event.respondWith(
      (async () => {
        const isMut = await isMutation(request);
        if (isMut) {
          return networkOnly(request);
        } else {
          return staleWhileRevalidate(request, GRAPHQL_CACHE);
        }
      })()
    );
    return;
  }
  
  if (isAPIRequest(request.url)) {
    if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
      event.respondWith(networkOnly(request));
    } else {
      event.respondWith(networkFirst(request, API_CACHE, CACHE_DURATIONS.API));
    }
    return;
  }
  
  event.respondWith(networkFirst(request, STATIC_CACHE));
});

const SYNC_TAG = 'background-sync';
const SYNC_MAX_AGE = 24 * 60 * 60 * 1000;

self.addEventListener('sync', (event) => {
  if (event.tag === SYNC_TAG) {
    event.waitUntil(syncPendingRequests());
  }
});

async function syncPendingRequests() {
  try {
    const cache = await caches.open(API_CACHE);
    const requests = await cache.keys();
    const pendingRequests = [];
    
    for (const request of requests) {
      if (request.method === 'POST' || request.method === 'PUT') {
        const cached = await cache.match(request);
        if (cached) {
          const cachedAt = cached.headers.get('sw-cached-at');
          if (cachedAt && Date.now() - parseInt(cachedAt) < SYNC_MAX_AGE) {
            pendingRequests.push({ request, cached });
          }
        }
      }
    }
    
    for (const { request, cached } of pendingRequests) {
      try {
        const response = await fetch(request.clone());
        if (response.ok) {
          await cache.delete(request);
        }
      } catch (error) {
        continue;
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

self.addEventListener('message', (event) => {
  if (!event.data || !event.data.type) return;
  
  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CLEAR_CACHE':
      event.waitUntil(
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(name => caches.delete(name))
          );
        }).then(() => {
          if (event.ports && event.ports[0]) {
            event.ports[0].postMessage({ success: true });
          }
        })
      );
      break;
      
    case 'CACHE_SIZE':
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(name => 
            caches.open(name).then(cache => 
              cache.keys().then(keys => ({ name, size: keys.length }))
            )
          )
        );
      }).then(sizes => {
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({ sizes });
        }
      });
      break;
  }
});
