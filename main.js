// Shared interactions for the 3-page wireframe

// Mobile menu toggles (works for all page variants)
document.querySelectorAll('#mobileMenuBtn, #mobileMenuBtnFeatures, #mobileMenuBtnPricing').forEach(btn=>{
  if(!btn) return;
  btn.addEventListener('click', ()=>{
    const nav = document.querySelector('.nav');
    if(nav) nav.classList.toggle('open');
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', function(e){
    const href = this.getAttribute('href');
    if(!href || href === '#') return;
    const el = document.querySelector(href);
    if(el){
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
      document.querySelector('.nav')?.classList.remove('open');
    }
  });
});

// Intersection observer for fade-in elements
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('in-view');
  });
},{threshold:0.12});

document.querySelectorAll('.fade-in').forEach(el=>{
  const d = el.getAttribute('data-delay') || 0;
  el.style.transitionDelay = (d/1000) + 's';
  io.observe(el);
});

// Modal preview
const modal = document.getElementById('modal');
const previewBtn = document.getElementById('previewFlow');
const closeModal = document.getElementById('closeModal');
previewBtn?.addEventListener('click', ()=> modal.classList.add('open'));
closeModal?.addEventListener('click', ()=> modal.classList.remove('open'));

// Simple demo alert fallback for pages without modal content
previewBtn?.addEventListener('click', ()=> {
  // if modal exists it opens; else show quick alert
  if(!modal) alert('Agent flow preview: Web lead → Agent qualifies → Book call → CRM update');
});

// Accordion logic (Features page)
document.querySelectorAll('.accordion-header').forEach(header=>{
  header.addEventListener('click', ()=>{
    const item = header.parentElement;
    const content = item.querySelector('.accordion-content');
    const isOpen = item.classList.contains('open');
    if(isOpen){
      content.style.maxHeight = null;
      item.classList.remove('open');
    } else {
      // close other items
      document.querySelectorAll('.accordion-item.open').forEach(openItem=>{
        openItem.querySelector('.accordion-content').style.maxHeight = null;
        openItem.classList.remove('open');
      });
      item.classList.add('open');
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  });
});

// Pricing toggle (pricing.html) - change amounts based on data attributes
const billingToggle = document.getElementById('billingToggle');
if(billingToggle){
  billingToggle.addEventListener('change', ()=>{
    const yearly = billingToggle.checked;
    document.querySelectorAll('.plan').forEach(plan=>{
      const monthly = plan.dataset.monthly;
      const yearlyVal = plan.dataset.yearly;
      const amountEl = plan.querySelector('.amount');
      const periodEl = plan.querySelector('.period');
      if(amountEl && periodEl){
        amountEl.textContent = yearly ? yearlyVal : monthly;
        periodEl.textContent = yearly ? '/yr' : '/mo';
      }
    });
  });
}

// Netlify form UX small feedback
document.querySelectorAll('form[data-netlify="true"]').forEach(form=>{
  form.addEventListener('submit', (e)=>{
    // Let Netlify handle the submit; show tiny feedback
    setTimeout(()=> alert('Thanks — we received your request. We will contact you soon.'), 400);
  });
});
