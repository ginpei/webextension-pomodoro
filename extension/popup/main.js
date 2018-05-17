function foo (el) {
  el.textContent = 'Hello World!';
}

document.querySelector('h1').onclick = (event) => {
  const el = event.currentTarget;
  foo(el);
};
