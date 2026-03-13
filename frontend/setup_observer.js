const fs = require('fs');
const path = './src/app/layout.tsx';
let content = fs.readFileSync(path, 'utf8');

const observerScript = `
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
`;

// This is client side logic, so it should go in a client component or a wrapper.
// I'll add a simple client wrapper for animations.
