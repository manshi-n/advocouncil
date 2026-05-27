const API_BASE = 'http://localhost:5000/api';
const SERVER_BASE = 'http://localhost:5000/';
function getToken(){ return localStorage.getItem('token') || ''; }
function getUser(){ try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } }
function setSession(data){ localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user)); localStorage.setItem('currentUser', JSON.stringify(data.user)); }
function updateStoredUser(user){ localStorage.setItem('user', JSON.stringify(user)); localStorage.setItem('currentUser', JSON.stringify(user)); }
function logout(){ localStorage.clear(); window.location.href='signin.html'; }
function requireLogin(role){ const u=getUser(); if(!u || !getToken()){ window.location.href='signin.html'; return null; } if(role && u.userType!==role){ alert('Please login as '+role); window.location.href='signin.html'; return null; } return u; }
async function api(path, options={}){
  const headers = options.headers || {};
  if(!(options.body instanceof FormData)) headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  if(getToken()) headers.Authorization = 'Bearer '+getToken();
  const res = await fetch(API_BASE+path, { ...options, headers });
  let data = {};
  try { data = await res.json(); } catch {}
  if(!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}
function money(n){ return '₹' + Number(n || 0).toLocaleString('en-IN'); }
function dateText(d){ return d ? new Date(d).toLocaleDateString('en-IN') : '-'; }
function fileUrl(path){ if(!path) return ''; return path.startsWith('http') ? path : SERVER_BASE + path.replace(/^\//,''); }
function setAvatar(el, user, fallback='👤'){
  if(!el) return;
  const src = user?.profilePicture || user?.image;
  if(src){ el.innerHTML = `<img src="${fileUrl(src)}" alt="profile" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`; }
  else { el.textContent = fallback; }
}
function statusClass(s){ return String(s||'').replace(/\s+/g,''); }
async function uploadProfilePhoto(inputId='photoInput'){
  const input = document.getElementById(inputId);
  if(!input || !input.files[0]) return alert('Select profile photo first');
  const fd = new FormData();
  fd.append('profilePicture', input.files[0]);
  const data = await api('/auth/me/profile-picture', { method:'POST', body: fd });
  updateStoredUser(data.user);
  alert('Profile photo uploaded');
  location.reload();
}
