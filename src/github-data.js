import {useSyncExternalStore} from 'react';

const user = 'enzofernandesnz';
const listeners = new Set();
let state = {profile: null, repos: null, contributions: null, latestCommits: [], errors: {}};
let published = {};
let snapshotPromise = null;
let controller = null;
let refreshTimer = null;

export function readCache(key) {
  try { return JSON.parse(localStorage.getItem(`nz-github:${key}`)); }
  catch { return null; }
}

export function saveCache(key, value) {
  try { localStorage.setItem(`nz-github:${key}`, JSON.stringify(value)); }
  catch { /* The public dashboard also works without browser storage. */ }
}

function update(next) {
  state = {...state, ...next};
  listeners.forEach(listener => listener());
}

async function refreshPublished(signal) {
  try {
    const response = await fetch(new URL('data/github.json', document.baseURI), {
      cache: 'no-store', headers: {Accept: 'application/json'},
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000)
    });
    if (response.ok) {
      const next = await response.json();
      if (signal?.aborted) return published;
      published = next;
      update({latestCommits: published.latestCommits || []});
    }
  } catch { /* Retain the last published data when offline. */ }
  return published;
}

export function getPublishedData() {
  if (!snapshotPromise) snapshotPromise = refreshPublished();
  return snapshotPromise;
}

async function loadSource(key, url, signal) {
  const snapshot = await getPublishedData();
  if (signal.aborted) return;
  const publishedEntry = snapshot[key];
  const cached = readCache(key);
  const entry = publishedEntry && (!cached || publishedEntry.updatedAt > cached.updatedAt)
    ? publishedEntry : cached;
  if (entry) update({[key]: entry.data});
  if (publishedEntry || (entry && Date.now() - Date.parse(entry.updatedAt) < 3600000)) return;
  try {
    const response = await fetch(url, {
      headers: {Accept: 'application/json'},
      signal: AbortSignal.any([signal, AbortSignal.timeout(12000)])
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (signal.aborted) return;
    saveCache(key, {data, updatedAt: new Date().toISOString()});
    update({[key]: data});
  } catch (error) {
    if (!signal.aborted) update({errors: {...state.errors, [key]: true}});
  }
}

function start() {
  controller = new AbortController();
  const signal = controller.signal;
  snapshotPromise = refreshPublished(signal);
  const sources = {
    profile: `https://api.github.com/users/${user}`,
    repos: `https://api.github.com/users/${user}/repos?per_page=100&sort=updated`,
    contributions: `https://github-contributions-api.jogruber.de/v4/${user}?y=last`
  };
  Object.entries(sources).forEach(([key, url]) => loadSource(key, url, signal));
  refreshTimer = setInterval(() => { snapshotPromise = refreshPublished(signal); }, 5 * 60 * 1000);
}

function subscribe(listener) {
  listeners.add(listener);
  if (listeners.size === 1) start();
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      controller?.abort();
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
  };
}

export function useGitHubData() {
  return useSyncExternalStore(subscribe, () => state);
}
