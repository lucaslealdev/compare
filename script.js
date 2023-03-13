JSON.getItem = (value) => JSON.parse(localStorage.getItem(value) || null);
JSON.setItem = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const setRegex = (r) => localStorage.setItem('regex', r);

const cfgPadrao = () => JSON.setItem('cfg', {
  regex: ['((^P)|[^0-9A-z]|([0-9][A-z][0-9]$))'],
});

const checkLS = () => {
  if (!localStorage.getItem('cfg')) {
    cfgPadrao();
  }
  if (!localStorage.getItem('codigos')) JSON.setItem('codigos', []);
}
checkLS();

const cfg = JSON.getItem('cfg');

const add = (c) => {
  const d = JSON.getItem('codigos');
  cfg.regex.forEach((regexString) => {
    const regex = new RegExp(regexString, 'gm');
    c = c.replace(regex, '');
  });
  if (c.length == 0) return true;
  d.unshift(c);
  JSON.setItem('codigos', d);
  updateList();
}

const updateList = () => {
  if (JSON.getItem('codigos').length > 0) {
    lista.innerHTML = '';
    JSON.getItem('codigos').forEach((e) => {
      lista.insertAdjacentHTML('beforeend', `<li>${e}</li>`);
    });
    const p = document.querySelector('#lista li:nth-child(1)');
    const s = document.querySelector('#lista li:nth-child(2)');
    if (p && s && p.innerText === s.innerText) {
      p.classList.add('green');
      s.classList.add('green');
    }
  } else {
    lista.innerHTML = '<li>Por enquanto você não leu nenhum código.</li>';
  }
}

const clearList = () => {
  localStorage.setItem('codigos', '[]');
  updateList();
}
updateList();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  add(codigo.value);
  codigo.value = '';
  form.reset();
})

const loadRegexes = () => {
  regexes.innerHTML = '';
  if (cfg.regex.length === 0) {
    regexes.insertAdjacentHTML('beforeend', "<li>Nenhum regex cadastrado</li>");
    return;
  }
  cfg.regex
    .map((r, i) => `<li onclick="removeRegex(this)" data-idx="${i}">${r}</li>`)
    .forEach((r) => regexes.insertAdjacentHTML('beforeend', r));
}
loadRegexes();
const removeRegex = (e) => {
  const idx = parseInt(e.getAttribute('data-idx'));
  inputNewRegex.value = e.innerText;
  cfg.regex.splice(idx, 1);
  loadRegexes();
}
const addRegex = (e) => {
  if (inputNewRegex.value.length > 0) {
    cfg.regex.push(inputNewRegex.value);
    inputNewRegex.value = '';
    loadRegexes();
  }
}

const saveCfg = () => {
  JSON.setItem('cfg', cfg);
  showmodal.checked = false;
}

const padroes = () => {
  if(confirm('Você tem certeza?')){
    cfgPadrao();
    location.reload();
  }
}

document.addEventListener('keydown', (event) => {
  if (!showmodal.checked) codigo.focus();
});

compartilhar.addEventListener('click', () => navigator.share({
  title: "Leituras",
  text: JSON.getItem('codigos').reduce((a, i) => a + i + '\r\n', ''),
}));

if (!navigator.share && !window.location.hash) compartilhar.remove();