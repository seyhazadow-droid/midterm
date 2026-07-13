/* ══ SAKURA PARTICLES ══ */
(function(){
    const canvas = document.getElementById('sakura-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, petals = [];

    function resize(){ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    function createPetal(){
        return {
            x: Math.random() * W,
            y: -20,
            r: Math.random()*4+2,
            rot: Math.random()*Math.PI*2,
            rotSpd: (Math.random()-.5)*.04,
            vx: (Math.random()-.5)*1.5,
            vy: Math.random()*.8+.4,
            alpha: Math.random()*.6+.3,
            hue: Math.random()*20+340 // pinks
        };
    }

    for(let i=0;i<40;i++){ const p=createPetal(); p.y=Math.random()*H; petals.push(p); }

    function drawPetal(p){
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        // simple 5-petal flower shape
        for(let i=0;i<5;i++){
            const angle = (i/5)*Math.PI*2;
            const px = Math.cos(angle)*p.r;
            const py = Math.sin(angle)*p.r;
            ctx.ellipse(px*.7, py*.7, p.r*.7, p.r*.35, angle, 0, Math.PI*2);
        }
        ctx.fillStyle = `hsl(${p.hue},90%,75%)`;
        ctx.fill();
        ctx.restore();
    }

    function loop(){
        ctx.clearRect(0,0,W,H);
        // spawn
        if(petals.length < 60 && Math.random()<.05) petals.push(createPetal());
        petals.forEach((p,i)=>{
            p.x += p.vx + Math.sin(Date.now()*.001+i)*.3;
            p.y += p.vy;
            p.rot += p.rotSpd;
            drawPetal(p);
            if(p.y > H+20) petals.splice(i,1);
        });
        requestAnimationFrame(loop);
    }
    loop();
})();

/* ══ RING DOTS ══ */
(function(){
    const c = document.getElementById('ringCanvas');
    if(!c) return;
    const ctx = c.getContext('2d');
    const N=8, R=178;
    let t=0;
    function draw(){
        ctx.clearRect(0,0,360,360);
        for(let i=0;i<N;i++){
            const a = (i/N)*Math.PI*2 + t;
            const x = 180+Math.cos(a)*R;
            const y = 180+Math.sin(a)*R;
            ctx.beginPath();
            ctx.arc(x,y,4,0,Math.PI*2);
            ctx.fillStyle='rgba(255,107,157,.9)';
            ctx.shadowBlur=12;
            ctx.shadowColor='#ff6b9d';
            ctx.fill();
        }
        t+=.012;
        requestAnimationFrame(draw);
    }
    draw();
})();

/* ══ CURSOR ══ */
const dot=document.querySelector('.cursor-dot');
const ring=document.querySelector('.cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.transform=`translate(${mx-3}px,${my-3}px)`;});
(function animRing(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.transform=`translate(${rx-16}px,${ry-16}px)`;requestAnimationFrame(animRing);})();
document.querySelectorAll('a,button,.svc-card,.skill-card,.proj-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>{ring.classList.add('h');dot.classList.add('h');});
    el.addEventListener('mouseleave',()=>{ring.classList.remove('h');dot.classList.remove('h');});
});

/* ══ SCROLL REVEAL ══ */
const revObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));

/* ══ NAVBAR ══ */
const nb=document.getElementById('navbar');
window.addEventListener('scroll',()=>{
    nb.classList.toggle('scrolled',window.scrollY>60);
    let cur='';
    document.querySelectorAll('section[id]').forEach(s=>{if(window.scrollY>=s.offsetTop-140)cur=s.getAttribute('id');});
    document.querySelectorAll('.nav-link').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur));
});

/* ══ MOBILE MENU ══ */
const menuBtn=document.getElementById('menuBtn');
const closeBtn=document.getElementById('closeBtn');
const mm=document.getElementById('mobileMenu');
menuBtn.addEventListener('click',()=>{mm.classList.add('open');document.body.style.overflow='hidden';menuBtn.classList.add('open');});
closeBtn.addEventListener('click',()=>{mm.classList.remove('open');document.body.style.overflow='';menuBtn.classList.remove('open');});
document.querySelectorAll('.mobile-link').forEach(a=>a.addEventListener('click',()=>{mm.classList.remove('open');document.body.style.overflow='';menuBtn.classList.remove('open');}));

/* ══ TYPEWRITER ══ */
const phrases=['Electronics & Gadgets','Fashion & Apparel','Home & Living','Sports & Fitness'];
let pi=0,ci=0,del=false;
const tw=document.getElementById('typewriter');
function type(){
    const ph=phrases[pi];
    if(!del){tw.textContent=ph.slice(0,++ci);if(ci===ph.length){del=true;setTimeout(type,1800);return;}}
    else{tw.textContent=ph.slice(0,--ci);if(ci===0){del=false;pi=(pi+1)%phrases.length;}}
    setTimeout(type,del?40:80);
}type();

/* ══ SKILL BARS ══ */
const skObs=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting)e.target.querySelectorAll('.sk-fill').forEach(b=>b.classList.add('run'));
}),{threshold:.25});
document.querySelectorAll('.skills-grid').forEach(g=>skObs.observe(g));

/* ══ CONTACT FORM ══ */
document.getElementById('contactForm').addEventListener('submit',function(e){
    e.preventDefault();
    const btn=this.querySelector('button[type="submit"]');
    const orig=btn.innerHTML;
    btn.innerHTML='✓ Message Sent!';
    btn.style.background='#2dd4bf';
    btn.style.color='#07070d';
    setTimeout(()=>{btn.innerHTML=orig;btn.style.background='';btn.style.color='';},3000);
});

/* ══ SHOPPING CART FUNCTIONALITY ══ */
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');

// Update cart UI
function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = count;
    cartCount.classList.toggle('show', count > 0);
    cartTotal.textContent = total.toFixed(2);
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><i class="bi bi-bag"></i><p>Your cart is empty</p></div>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add to cart
function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price: parseFloat(price), image, quantity: 1 });
    }
    updateCartUI();
    showNotification(`${name} added to cart!`);
}

// Remove from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

// Update quantity
function updateQuantity(id, quantity) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = Math.max(1, parseInt(quantity));
        updateCartUI();
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed; top: 100px; right: 20px; z-index: 9999;
        background: var(--sakura); color: #07070d; padding: 12px 20px;
        border-radius: 6px; font-weight: 600; transform: translateX(100%);
        transition: transform .3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Event listeners
cartBtn.addEventListener('click', () => cartSidebar.classList.add('open'));
closeCart.addEventListener('click', () => cartSidebar.classList.remove('open'));

// Add to cart buttons
document.addEventListener('click', (e) => {
    if (e.target.closest('.add-to-cart')) {
        const btn = e.target.closest('.add-to-cart');
        const id = btn.dataset.productId;
        const name = btn.dataset.name;
        const price = btn.dataset.price;
        const image = btn.dataset.image;
        addToCart(id, name, price, image);
    }
    
    if (e.target.closest('.quantity-btn.increase')) {
        const id = e.target.closest('.quantity-btn').dataset.id;
        const item = cart.find(item => item.id === id);
        if (item) updateQuantity(id, item.quantity + 1);
    }
    
    if (e.target.closest('.quantity-btn.decrease')) {
        const id = e.target.closest('.quantity-btn').dataset.id;
        const item = cart.find(item => item.id === id);
        if (item && item.quantity > 1) updateQuantity(id, item.quantity - 1);
    }
    
    if (e.target.closest('.remove-item')) {
        const id = e.target.closest('.remove-item').dataset.id;
        removeFromCart(id);
    }
});

// Quantity input change
document.addEventListener('change', (e) => {
    if (e.target.classList.contains('quantity-input')) {
        const id = e.target.dataset.id;
        const quantity = e.target.value;
        updateQuantity(id, quantity);
    }
});

// Checkout
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    showNotification('Redirecting to checkout...');
    // Here you would typically redirect to a checkout page
    setTimeout(() => {
        cart = [];
        updateCartUI();
        cartSidebar.classList.remove('open');
        showNotification('Order placed successfully!');
    }, 2000);
});

// Newsletter form
document.getElementById('newsletterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    showNotification('Thank you for subscribing!');
    this.reset();
});

// Initialize cart
updateCartUI();

/* ══ CATEGORY CARDS CLICK ══ */
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        window.location.href = 'Category.html';
    });
});