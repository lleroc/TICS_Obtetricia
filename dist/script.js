const search = document.querySelector('#search');
const lessons = [...document.querySelectorAll('.lesson')];
const units = [...document.querySelectorAll('.unit')];
const expand = document.querySelector('#expand');
const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function updateExpandButton() {
  const visible = lessons.filter(lesson => !lesson.hidden);
  const allOpen = visible.length > 0 && visible.every(lesson => lesson.querySelector('details').open);
  expand.textContent = allOpen ? 'Contraer todos los temas −' : 'Expandir todos los temas +';
  expand.setAttribute('aria-expanded', String(allOpen));
}
search.addEventListener('input', () => {
  const query = normalize(search.value.trim());
  let count = 0;
  lessons.forEach(lesson => {
    const matches = normalize(lesson.textContent).includes(query);
    lesson.hidden = !matches;
    if (matches) count++;
    lesson.querySelector('details').open = Boolean(query) && matches;
  });
  units.forEach(unit => { unit.hidden = ![...unit.querySelectorAll('.lesson')].some(lesson => !lesson.hidden); });
  const results = document.querySelector('#results');
  results.hidden = !query;
  results.textContent = count ? `${count} tema${count === 1 ? '' : 's'} encontrado${count === 1 ? '' : 's'}.` : 'No se encontraron temas. Prueba con otra palabra.';
  updateExpandButton();
});
expand.addEventListener('click', () => {
  const shouldOpen = expand.getAttribute('aria-expanded') !== 'true';
  lessons.filter(lesson => !lesson.hidden).forEach(lesson => { lesson.querySelector('details').open = shouldOpen; });
  updateExpandButton();
});
lessons.forEach(lesson => lesson.querySelector('details').addEventListener('toggle', updateExpandButton));
// Una búsqueda no debe ocultar el destino de un enlace de navegación.
window.addEventListener('hashchange', () => {
  if (search.value) { search.value = ''; search.dispatchEvent(new Event('input')); }
  const target = document.getElementById(location.hash.slice(1));
  if (target?.classList.contains('lesson')) target.querySelector('details').open = true;
  target?.scrollIntoView();
});
