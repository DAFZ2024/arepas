import React, { useState, FormEvent, useEffect } from 'react';
import { Plus, Minus, Trash2, X, MapPin, Phone, Clock, Instagram, Facebook, ChefHat, Sparkles, ChevronRight, UtensilsCrossed, ShoppingCart, User, Home, Navigation, Smartphone, Banknote, CreditCard, AlignLeft } from 'lucide-react';
import fondoHero from './assets/rellenitas.png';

interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
  imgUrl: string;
  badge?: string;
  flavors?: string[];
}

interface CartItem extends Product {
  cartId: string;
  qty: number;
  selectedFlavor?: string;
}

interface OrderForm {
  name: string;
  address: string;
  neighborhood: string;
  phone: string;
  payment: string;
  notes: string;
}

const products: { arepas: Product[]; drinks: Product[] } = {
  arepas: [
    { id: 'a1', name: 'Arepa de Pollo', desc: 'Jugoso pollo desmechado con nuestro hogao y sazón de la casa.', price: 5000, imgUrl: 'https://images.unsplash.com/photo-1615719413546-198b25453f85?auto=format&fit=crop&w=600&q=80' },
    { id: 'a2', name: 'Arepa de Carne Molida', desc: 'Carne de res premium con auténtico guiso tradicional.', price: 5500, imgUrl: 'https://images.unsplash.com/photo-1514326640560-7d063ef8aedc?auto=format&fit=crop&w=600&q=80' },
    { id: 'a3', name: 'Arepa de Chorizo', desc: 'Chorizo campesino dorado y crujiente para los amantes del sabor.', price: 6000, imgUrl: 'https://images.unsplash.com/photo-1627308595229-7830f5c90683?auto=format&fit=crop&w=600&q=80' },
    { id: 'a4', name: 'Arepa Mixta', desc: 'La combinación perfecta de pollo y carne. Lo mejor de ambos mundos.', price: 6500, imgUrl: 'https://plus.unsplash.com/premium_photo-1667683057186-b4d21ee6f72c?auto=format&fit=crop&w=600&q=80', badge: 'Popular' },
    { id: 'a5', name: 'Arepa de Queso', desc: 'Doble porción de queso doble crema fundido. Extra chiclosa, deliciosa.', price: 4500, imgUrl: 'https://images.unsplash.com/photo-1594958133503-bc97e598971f?auto=format&fit=crop&w=600&q=80' },
    { id: 'a6', name: 'Especial Rellenitas', desc: 'Nuestro orgullo: Pollo, carne, chorizo y un mar de queso fundido.', price: 7000, imgUrl: 'https://images.unsplash.com/photo-1633511090159-fb967eed4af9?auto=format&fit=crop&w=600&q=80', badge: '¡Estrella!' },
  ],
  drinks: [
    { id: 'd1', name: 'Coca-Cola personal', desc: 'Fría y burbujeante', price: 2500, imgUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=200&q=80' },
    { id: 'd2', name: 'Jugo Natural', desc: 'Mora, Mango o Mandarina', price: 3000, imgUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=200&q=80', flavors: ['Mora', 'Mango', 'Mandarina'] },
    { id: 'd3', name: 'Gaseosa Naranja', desc: 'Refrescante sabor', price: 2500, imgUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&q=80' },
    { id: 'd4', name: 'Agua Manantial', desc: 'Botella personal', price: 2000, imgUrl: 'https://images.unsplash.com/photo-1559839913-1140e31db503?auto=format&fit=crop&w=200&q=80', badge: 'Ligera' },
  ]
};

const WA_NUMBER = "573114996440"; // Reemplazar con real

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [flavorProduct, setFlavorProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<OrderForm>({
    name: '', address: '', neighborhood: '', phone: '', payment: 'efectivo', notes: ''
  });

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (product: Product, flavor?: string) => {
    const cartId = flavor ? `${product.id}-${flavor}` : product.id;
    setCart((prev) => {
      const existing = prev.find(item => item.cartId === cartId);
      if (existing) {
        return prev.map(item => item.cartId === cartId ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, cartId, qty: 1, selectedFlavor: flavor }];
    });
    setFlavorProduct(null);
    const cartBtn = document.getElementById('cart-btn');
    cartBtn?.classList.add('scale-110');
    setTimeout(() => cartBtn?.classList.remove('scale-110'), 200);
  };

  const handleAddClick = (product: Product) => {
    if (product.flavors && product.flavors.length > 0) {
      setFlavorProduct(product);
    } else {
      addToCart(product);
    }
  };

  const updateQty = (cartId: string, delta: number) => {
    setCart((prev) => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (cartId: string) => setCart((prev) => prev.filter(item => item.cartId !== cartId));

  const totalCart = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleCheckout = (e: FormEvent) => {
    e.preventDefault();
    if(cart.length === 0) return alert('El carrito está vacío');
    
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Buenos días';
      if (hour < 18) return 'Buenas tardes';
      return 'Buenas noches';
    };

    let orderText = `*¡Hola, ${getGreeting()}!* Quisiera hacer un pedido, por favor.\n\n`;
    orderText += `Mi nombre es *${formData.name}* y este es mi pedido:\n\n`;
    
    cart.forEach(item => {
      const flavorText = item.selectedFlavor ? ` (${item.selectedFlavor})` : '';
      orderText += `- ${item.qty}x ${item.name}${flavorText} ($${(item.price * item.qty).toLocaleString('es-CO')})\n`;
    });
    
    orderText += `\n*Total estimado:* $${totalCart.toLocaleString('es-CO')} COP\n\n`;
    orderText += `*Datos de entrega:*\n`;
    orderText += `Dirección: ${formData.address}, Barrio ${formData.neighborhood}, Soacha\n`;
    orderText += `Teléfono de contacto: ${formData.phone}\n`;
    orderText += `Método de pago: *${formData.payment === 'efectivo' ? 'Efectivo' : 'Transferencia'}*\n`;
    
    if(formData.notes) orderText += `\n*Nota para el pedido:* ${formData.notes}\n`;
    
    orderText += `\n¡Quedo atento/a a la confirmación de mi pedido! Muchas gracias.`;

    const encoded = encodeURIComponent(orderText);
    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  const scrollToMenu = () => {
    document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-950 font-sans selection:bg-amber-500 selection:text-white">
      {/* NAVEGACIÓN STICKY */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out border-t-2 ${isScrolled ? 'bg-stone-950/85 backdrop-blur-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] py-3 border-b-white/5 border-t-amber-500' : 'bg-gradient-to-b from-black/80 to-transparent py-5 border-transparent border-b-transparent'}`}>
        <div className="max-w-6xl mx-auto px-4 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-4 cursor-pointer group">
            {/* Logo de Arepa + Fuego Personalizado */}
            <div className={`p-2.5 rounded-2xl flex items-center justify-center transition-all duration-500 ${isScrolled ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-stone-950 shadow-lg shadow-orange-500/20' : 'bg-white/10 text-amber-400 backdrop-blur-md border border-white/10 shadow-lg'}`}>
              <div className="relative group-hover:-rotate-12 group-hover:scale-110 transition-transform">
                {/* Custom Arepa/Media Arepa Icon */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {/* Media arepa (mitad superior) */}
                  <path d="M 3 14 A 9 9 0 0 1 21 14 Z" fill="currentColor" fillOpacity="0.2" />
                  {/* Marcas de parrilla */}
                  <path d="M 7 10 h 10" />
                  <path d="M 5 14 h 14" strokeWidth="2.5" />
                  {/* Relleno asomándose por la mitad cortada */}
                  <path d="M 6 14 Q 12 19 18 14" fill="currentColor" fillOpacity="0.4" stroke="none" />
                  {/* Etiqueta de fuego visual (abstracta) */}
                  <path d="M12 3a9 9 0 0 1 9 9" strokeDasharray="2 4" className="text-orange-500" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className={`text-2xl sm:text-3xl font-black tracking-tighter transition-colors ${isScrolled ? 'text-white' : 'text-white drop-shadow-lg'} flex items-center gap-2`}>
                Rellenitas
                {/* Badge 100% Maíz */}
                <span className="hidden sm:flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  100% Maíz
                </span>
              </h1>
              <p className={`text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] transition-colors leading-none mt-0.5 ${isScrolled ? 'text-stone-400' : 'text-stone-300 drop-shadow-md'}`}>
                El sabor de Soacha
              </p>
            </div>
          </div>
          <button 
            id="cart-btn"
            onClick={() => setIsCartOpen(true)}
            className={`group relative px-4 py-2.5 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.5)] flex items-center gap-2.5 ${isScrolled ? 'bg-stone-900 border border-white/5 text-stone-300 hover:bg-stone-800 hover:text-amber-400 group-hover:border-amber-500/30' : 'bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20'}`}
          >
            {/* Ícono de Carrito con Media Arepa */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
              {/* Media arepa sobresaliendo */}
              <path d="M 9.5 7.5 A 4.5 4.5 0 0 1 18.5 7.5 Z" fill="currentColor" className="text-amber-500" fillOpacity="0.4" />
              {/* Marcas de parrilla pequeñas */}
              <path d="M 12 5.5 h 4" className="text-amber-600" strokeWidth="1.5" />
              {/* Cuerpo del carrito */}
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <span className="hidden sm:block font-bold text-sm">Carrito</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black rounded-full h-6 w-6 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* HERO SECTION DE ALTO IMPACTO */}
      <section className="relative min-h-[95vh] flex items-center pt-24 pb-16 px-4 md:py-24 overflow-hidden">
        {/* Absolute Backgrounds */}
        <div className="absolute inset-0 bg-stone-950">
          <img 
            src={fondoHero}
            alt="Fondo" 
            className="w-full h-full object-cover opacity-70 scale-105" 
          />
          {/* Difuminado negro en la parte inferior */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent"></div>
          {/* Oscurecimiento lateral para que el texto resalte */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/30 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="text-left flex flex-col items-start pt-10 lg:pt-0">
            <div className="inline-flex items-center gap-3 bg-stone-900/60 backdrop-blur-xl border border-amber-500/40 text-amber-400 px-5 py-2.5 rounded-full text-sm font-black mb-8 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <span className="flex h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,1)]"></span>
              <span className="tracking-wide uppercase text-[11px] sm:text-xs">🔥 Parrilla Encendida • 100% Maíz</span>
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white mb-6 tracking-tighter leading-[1.05] drop-shadow-2xl">
              Puro <span className="text-amber-500">queso</span>, pura <span className="relative whitespace-nowrap"><span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">candela.</span><svg className="absolute -bottom-3 left-0 w-full h-4 text-orange-500/50 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5 M0 2 Q 50 7 100 2" stroke="currentColor" strokeWidth="2" fill="none"/></svg></span>
            </h2>
            <p className="text-lg md:text-2xl text-stone-300 font-medium mb-10 max-w-xl leading-relaxed">
              Las verdaderas <strong className="text-white border-b-2 border-amber-500 pb-0.5">arepas rellenas</strong> de Soacha. Masa tostadita al carbón, carnes jugosas y un queso que estira hasta el techo. ¿Te vas a quedar con el antojo?
            </p>
            <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
              <button 
                onClick={scrollToMenu}
                className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-extrabold text-lg py-4 px-10 rounded-2xl shadow-[0_0_30px_-5px_rgba(245,158,11,0.5)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_-5px_rgba(245,158,11,0.7)] flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                Pedir Ahora <ChevronRight size={22} />
              </button>
              <a href="#contacto" className="bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/10 font-medium text-lg py-4 px-10 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto group">
                <MapPin size={22} className="text-amber-400 group-hover:scale-110 transition-transform" /> Dónde estamos
              </a>
            </div>
            
            <div className="mt-12 flex items-center gap-4 text-sm font-medium text-stone-400">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-stone-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Cliente" />
                <img className="w-10 h-10 rounded-full border-2 border-stone-900 object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="Cliente" />
                <div className="w-10 h-10 rounded-full border-2 border-stone-900 bg-amber-500 text-stone-900 flex items-center justify-center font-bold text-xs">+2k</div>
              </div>
              <p>Vecinos ya nos probaron</p>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-amber-500/20 blur-[100px] rounded-full"></div>
            <img src="https://images.unsplash.com/photo-1594958133503-bc97e598971f?auto=format&fit=crop&w=800&q=80" alt="Arepa Rellenita" className="relative z-10 w-full h-auto object-cover rounded-[3rem] rotate-3 shadow-2xl transition-transform duration-700 hover:rotate-0 hover:scale-105 border-8 border-white/10 backdrop-blur-sm" />
            
            {/* Flotante 1 */}
            <div className="absolute -top-6 -right-6 z-20 bg-stone-950/80 backdrop-blur-xl border border-orange-500/30 p-4 rounded-[2rem] shadow-[0_20px_40px_rgba(245,158,11,0.15)] flex items-center gap-4 animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-2.5 shadow-inner text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
              </div>
              <div>
                <p className="text-white font-black text-sm uppercase tracking-wider">Recién Asadas</p>
                <p className="text-orange-400 font-bold text-xs">¡Cuidado te quemas!</p>
              </div>
            </div>
            
            {/* Flotante 2 */}
            <div className="absolute -bottom-8 -left-8 z-20 bg-stone-900/90 backdrop-blur-xl border border-amber-500/20 p-4 rounded-[2rem] shadow-xl flex items-center gap-4 hover:scale-105 transition-transform cursor-default">
              <div className="bg-amber-500 rounded-2xl p-2.5 text-stone-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2A10 10 0 0 0 2 12c0 2.22.7 4.29 1.88 6L12 22l8.12-4A10 10 0 0 0 12 2Z" fill="currentColor" fillOpacity="0.2"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <div>
                <p className="text-white font-black text-sm uppercase tracking-wider">Full Queso</p>
                <p className="text-amber-500 font-bold text-xs">¡Estira hasta el techo!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MENÚ Y SECCIÓN CÓMO PEDIR */}
      <main id="menu-section" className="max-w-6xl mx-auto px-4 lg:px-8 py-16 scroll-mt-24">
        
        {/* GUÍA RÁPIDA "CÓMO FUNCIONA" */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-stone-900 to-stone-950 border border-white/5 rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden shadow-2xl z-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] pointer-events-none rounded-full"></div>
            
            <div className="text-center mb-10 relative z-10">
              <h3 className="text-3xl md:text-4xl font-black text-white mb-2">Pide en <span className="text-amber-500">3 simples pasos</span></h3>
              <p className="text-stone-400 font-light max-w-lg mx-auto">Selecciona, envía tu orden y te atendemos personalmente. ¡Así de fácil, directo por WhatsApp!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {/* Paso 1 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-stone-950 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 mb-6 shadow-inner group-hover:-translate-y-2 transition-transform duration-300 relative">
                  <span className="absolute -top-3 -right-3 bg-amber-500 text-stone-950 w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shadow-lg">1</span>
                  <UtensilsCrossed size={28} />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Arma tu pedido</h4>
                <p className="text-stone-400 text-sm font-light leading-relaxed">Navega por nuestro menú abajo y agrega al carrito las arepas y bebidas que te provoquen.</p>
              </div>
              
              {/* Paso 2 */}
              <div className="flex flex-col items-center text-center group relative">
                {/* Flecha conectora desktop (Opcional) */}
                <div className="hidden md:block absolute top-8 left-[-50%] w-full h-[2px] bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent -z-10 border-t border-dashed border-amber-500/20"></div>
                <div className="hidden md:block absolute top-8 right-[-50%] w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500/10 to-amber-500/20 -z-10 border-t border-dashed border-amber-500/20"></div>
                
                <div className="w-16 h-16 bg-stone-950 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 mb-6 shadow-inner group-hover:-translate-y-2 transition-transform duration-300 relative">
                  <span className="absolute -top-3 -right-3 bg-amber-500 text-stone-950 w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shadow-lg">2</span>
                  <ShoppingCart size={28} />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Revisa tu Carrito</h4>
                <p className="text-stone-400 text-sm font-light leading-relaxed">Llena tus datos de entrega en el carrito de compras. <strong className="text-stone-200">No te cobramos nada por aquí.</strong></p>
              </div>

              {/* Paso 3 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-stone-950 border border-[#25D366]/40 rounded-2xl flex items-center justify-center text-[#25D366] mb-6 shadow-inner group-hover:-translate-y-2 transition-transform duration-300 relative">
                  <span className="absolute -top-3 -right-3 bg-[#25D366] text-white w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shadow-lg">3</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Click a WhatsApp</h4>
                <p className="text-stone-400 text-sm font-light leading-relaxed">Ahí recibimos tu orden, coordinamos el despacho y eliges pagar cuando te lleguen o con Nequi. ¡Fácil!</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* SECCIÓN: AREPAS */}
        <section className="mb-24 relative py-16">
          {/* Fondo de parrilla (Rompe el contenedor para ser ultra ancho) */}
          <div className="absolute inset-y-0 w-[100vw] left-[50%] -ml-[50vw] pointer-events-none overflow-hidden">
            {/* Las líneas de la parrilla (Verticales con gradiente para dar volumen) */}
            <div 
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage: `linear-gradient(90deg, transparent 0%, transparent 40%, rgba(245, 158, 11, 0.4) 48%, rgba(255, 255, 255, 0.8) 50%, rgba(245, 158, 11, 0.4) 52%, transparent 60%, transparent 100%)`,
                backgroundSize: '80px 100%'
              }}
            ></div>
            {/* Brasa en el fondo */}
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-orange-600/20 via-red-900/5 to-transparent blur-3xl"></div>
            {/* Viñeta gigantesca para desaparecer los bordes */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0c0a09_70%)]"></div>
          </div>

          <div className="flex flex-col items-center text-center mb-16 relative z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/20 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="bg-amber-900/40 border border-amber-500/30 text-amber-500 p-4 rounded-3xl mb-6 shadow-inner relative z-10 backdrop-blur-md shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              <UtensilsCrossed size={36} />
            </div>
            <h3 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight relative z-10 drop-shadow-xl">Nuestras Arepas</h3>
            <p className="text-stone-300 text-lg max-w-2xl font-medium relative z-10 drop-shadow-md">Crujientes por fuera, una locura por dentro. Conoce nuestras estrellas y arma tu pedido perfecto.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 relative z-10">
            {products.arepas.map(product => (
              <div key={product.id} className="group bg-stone-900/50 backdrop-blur-sm p-3 hover:shadow-[0_20px_50px_-15px_rgba(245,158,11,0.15)] transition-all duration-500 border border-white/5 flex flex-col h-full transform hover:-translate-y-3 relative overflow-hidden rounded-full aspect-square justify-center items-center">
                
                {/* Badge flotante */}
                {product.badge && (
                  <div className="absolute top-10 right-10 z-20">
                    <span className="bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 text-[11px] font-black px-4 py-2 rounded-full shadow-lg shadow-amber-500/20 uppercase tracking-widest">
                      {product.badge}
                    </span>
                  </div>
                )}
                
                {/* Imagen del producto */}
                <div className="absolute inset-0 w-full h-full bg-stone-950 z-0">
                  <img 
                    src={product.imgUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[800ms] ease-out opacity-40 group-hover:opacity-60"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent"></div>
                </div>
                
                {/* Contenido */}
                <div className="flex flex-col items-center text-center relative z-10 px-8 w-full">
                  <h4 className="text-2xl font-black text-white leading-tight mb-3 group-hover:text-amber-400 transition-colors drop-shadow-md">{product.name}</h4>
                  <p className="text-stone-300 text-sm mb-6 flex-1 font-medium leading-relaxed drop-shadow-md">{product.desc}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-5 w-full">
                    <div className="flex flex-col text-left">
                      <span className="text-amber-500/80 text-[10px] font-black uppercase tracking-widest mb-1 drop-shadow-md">Precio Unidad</span>
                      <span className="text-3xl font-black text-white tracking-tighter drop-shadow-md">${product.price.toLocaleString('es-CO')}</span>
                    </div>
                    <button 
                      onClick={() => handleAddClick(product)}
                      className="w-14 h-14 bg-amber-500 text-stone-950 rounded-full flex items-center justify-center hover:bg-white hover:text-stone-950 shadow-[0_10px_20px_-5px_rgba(245,158,11,0.4)] transform group-hover:rotate-180 active:scale-95 transition-all duration-500 focus:outline-none relative z-20 border-4 border-stone-900"
                      aria-label="Agregar al carrito"
                    >
                      <Plus size={26} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN: BEBIDAS (Estilo Horizontal Compacto) */}
        <section>
          <div className="flex flex-col items-center text-center mb-16 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-500/10 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="bg-sky-900/30 border border-sky-500/20 text-sky-400 w-16 h-16 flex items-center justify-center rounded-3xl mb-6 text-3xl relative z-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 22 1-13h6l1 13"/><path d="M16 9h4"/><path d="M6 9H4"/><path d="M12 9v13"/><path d="M15 3h-6l-1 6h8z"/></svg>
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight relative z-10">Para Acompañar</h3>
            <p className="text-stone-400 text-lg max-w-xl font-light relative z-10">¿Qué es una arepa sin una buena sobremesa? Refresca tu pedido.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 lg:px-12">
            {products.drinks.map(product => (
              <div 
                key={product.id} 
                onClick={() => handleAddClick(product)}
                className="bg-stone-900/50 backdrop-blur-sm rounded-t-2xl rounded-b-[4rem] p-4 hover:shadow-[0_20px_40px_-15px_rgba(14,165,233,0.15)] transition-all duration-500 border border-white/5 flex flex-col items-center gap-4 cursor-pointer group transform hover:-translate-y-2 relative overflow-hidden aspect-[1/1.5]"
              >
                {/* Decoration blob animado en hover */}
                <div className="absolute -inset-10 bg-sky-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none translate-y-10 group-hover:translate-y-0"></div>

                {/* Imagen del producto simulando el líquido del vaso */}
                <div className="w-full flex-1 rounded-t-xl rounded-b-3xl overflow-hidden bg-stone-950 relative z-10 mx-auto shadow-inner border border-white/5">
                  <img 
                    src={product.imgUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-[800ms] ease-out opacity-80 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent"></div>
                  
                  {/* Highlight burbujas vaso simulando brillo */}
                  <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none opacity-50 skew-x-12 translate-x-2"></div>
                </div>
                
                {/* Contenido */}
                <div className="w-full flex flex-col items-center text-center relative z-10 pb-2">
                  <div className="flex flex-col items-center">
                    {product.badge && (
                      <span className="text-[10px] uppercase font-bold bg-sky-900/40 text-sky-400 border border-sky-400/20 px-3 py-0.5 rounded-full tracking-widest block w-max mb-2">
                        {product.badge}
                      </span>
                    )}
                    <h4 className="text-xl font-black text-white leading-tight group-hover:text-sky-400 transition-colors mb-1">{product.name}</h4>
                    <p className="text-stone-400 text-xs mb-3 font-light line-clamp-2">{product.desc}</p>
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-black text-sky-400 tracking-tighter">${product.price.toLocaleString('es-CO')}</span>
                    </div>
                  </div>
                  
                  <div className="w-12 h-12 mt-2 rounded-full bg-stone-800 border border-white/5 text-stone-300 flex items-center justify-center group-hover:bg-gradient-to-tr group-hover:from-sky-400 group-hover:to-blue-500 group-hover:text-stone-950 group-hover:border-transparent group-hover:shadow-[0_10px_20px_-5px_rgba(56,189,248,0.4)] transform group-hover:scale-125 group-hover:rotate-90 active:scale-95 transition-all duration-300">
                    <Plus size={22} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER PÚBLICO */}
      <footer id="contacto" className="bg-stone-950 text-stone-300 pt-24 pb-12 relative overflow-hidden mt-12">
        {/* Abstract Backgrounds */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
        
        <div className="max-w-6xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 relative z-10">
          
          {/* Marca (ocupa 5 columnas en lg) */}
          <div className="md:col-span-5 space-y-6 text-center md:text-left">
            <h4 className="text-4xl font-black text-white flex items-center justify-center md:justify-start gap-4 tracking-tight">
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-3 rounded-2xl text-stone-900 shadow-lg shadow-amber-500/20 transform -rotate-6"><ChefHat size={32} /></div> 
              Rellenitas
            </h4>
            <p className="text-stone-400 leading-relaxed font-light text-lg max-w-sm mx-auto md:mx-0">
              Las mejores arepas del centro de Soacha, amasadas con tradición y rellenas de puro sabor. Si no te manchas los dedos, no cuenta.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
              <a href="#" className="bg-stone-900/80 border border-stone-800 p-3.5 rounded-2xl text-stone-400 hover:bg-gradient-to-tr hover:from-pink-500 hover:to-orange-500 hover:text-white hover:border-transparent transition-all duration-300 shadow-lg transform hover:-translate-y-1"><Instagram size={22} /></a>
              <a href="#" className="bg-stone-900/80 border border-stone-800 p-3.5 rounded-2xl text-stone-400 hover:bg-blue-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-lg transform hover:-translate-y-1"><Facebook size={22} /></a>
            </div>
          </div>
          
          {/* Ubicación (ocupa 4 columnas) */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <h4 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <MapPin className="text-amber-500" size={20} /> Visítanos
            </h4>
            <div className="bg-stone-900/50 border border-stone-800/80 p-6 rounded-[1.5rem] w-full max-w-xs hover:border-stone-700 transition-colors shadow-inner backdrop-blur-sm">
              <p className="text-xl text-white font-black mb-1">Sede Principal</p>
              <p className="text-stone-400 text-sm mb-5 font-light">Calle Falsa 123 #45-67<br/>Soacha Centro, Cundinamarca</p>
              <div className="inline-flex items-center gap-2 text-amber-200 text-sm font-medium bg-amber-900/30 border border-amber-500/20 px-3 py-2 rounded-xl">
                <Clock size={16} className="text-amber-500" />
                <span>Mar - Dom | 12:00m - 10:00pm</span>
              </div>
            </div>
          </div>
          
          {/* Contacto (ocupa 3 columnas) */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <h4 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Phone className="text-amber-500" size={20} /> Domicilios
            </h4>
            <p className="text-stone-400 text-sm font-light max-w-[250px]">¿Mucho frío para salir? Nosotros te la llevamos calientita.</p>
            <a 
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366] hover:bg-[#20BE5C] text-white p-1.5 rounded-2xl flex items-center gap-4 w-full max-w-md transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-[#25D366]/20 group"
            >
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </div>
              <div className="text-left pr-4">
                <p className="text-[10px] uppercase tracking-widest font-black text-green-100 mb-0.5">WhatsApp</p>
                <p className="text-base sm:text-lg font-black tracking-wider leading-none">+{WA_NUMBER}</p>
              </div>
            </a>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 lg:px-8 mt-20 pt-8 border-t border-stone-800/80 relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-light text-stone-500">
            © {new Date().getFullYear()} Arepas Rellenitas Soacha. Todos los derechos reservados.
          </p>
          <p className="text-sm font-medium text-stone-500 flex items-center gap-1.5">
            Creado con <span className="text-red-500 animate-pulse">❤️</span> y mucho queso.
          </p>
        </div>
      </footer>

      {/* OVERLAY DEL CARRITO */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end font-sans">
          {/* Backdrop oscurecido */}
          <div 
            className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsCartOpen(false)}
          ></div>
          
          {/* Panel lateral con borde muy curvo simulando media arepa */}
          <div className="relative w-[92vw] sm:w-[520px] bg-stone-950 h-full shadow-[-30px_0_60px_rgba(0,0,0,0.8)] flex flex-col animate-slide-in rounded-l-[120px] sm:rounded-l-[250px] overflow-hidden border-l-[6px] md:border-l-[8px] border-amber-500/60">
            
            {/* Header del carrito */}
            <div className="bg-stone-900 border-b border-white/5 pl-14 pr-6 sm:pl-[110px] sm:pr-10 py-6 flex justify-between items-center shadow-lg z-10 relative">
              {/* Decoración curva extra para simular tostado de parrilla edge */}
              <div className="absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent pointer-events-none"></div>
              
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3 relative z-10 ml-6 sm:ml-8">
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-stone-950 p-2 rounded-2xl shadow-lg shadow-orange-500/20 transform -rotate-12">
                  {/* Custom Arepa/Media Arepa Icon mini */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 3 14 A 9 9 0 0 1 21 14 Z" fill="currentColor" fillOpacity="0.2" />
                    <path d="M 7 10 h 10" />
                    <path d="M 5 14 h 14" strokeWidth="2.5" />
                    <path d="M 6 14 Q 12 19 18 14" fill="currentColor" fillOpacity="0.4" stroke="none" />
                    <path d="M12 3a9 9 0 0 1 9 9" strokeDasharray="2 4" className="text-orange-950" />
                  </svg>
                </div>
                Tu Pedido
                {totalItems > 0 && <span className="bg-stone-800 text-amber-500 border border-amber-500/30 text-sm px-3 py-1 rounded-full font-black ml-1">{totalItems}</span>}
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-stone-500 hover:text-white hover:bg-red-500 hover:rotate-90 p-2.5 rounded-2xl transition-all duration-300 active:scale-95"
              >
                <X size={20}/>
              </button>
            </div>
            
            {/* Contenido (Items + Formulario) */}
            <div className="flex-1 overflow-y-auto w-full scroll-smooth">
              {cart.length === 0 ? (
                /* Estado Vacío */
                <div className="h-full flex flex-col items-center justify-center text-stone-500 p-6 pl-14 sm:pl-[120px] sm:pr-10 text-center pt-20 relative z-10">
                  <div className="absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-transparent pointer-events-none"></div>
                  
                  <div className="bg-stone-900/80 p-8 rounded-[2.5rem] shadow-inner mb-6 border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-amber-500/5 blur-2xl group-hover:bg-amber-500/10 transition-colors duration-500"></div>
                    <UtensilsCrossed size={80} className="text-amber-500/50 relative z-10 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500"/>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight">¡La parrilla está vacía!</h3>
                  <p className="text-stone-400 mb-8 font-light max-w-[260px] mx-auto">Agrega unas buenas arepas bien quesudas a tu pedido. ¡No te quedes con el antojo!</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-black px-8 py-4 rounded-2xl hover:brightness-110 transition-all duration-300 shadow-[0_0_30px_-5px_rgba(245,158,11,0.4)] hover:-translate-y-1 active:scale-95 w-full"
                  >
                    Ir al Menú
                  </button>
                </div>
              ) : (
                /* Lista de productos */
                <div className="pl-14 pr-4 py-6 sm:pl-[120px] sm:pr-10 sm:py-8 space-y-4 relative z-10">
                  <div className="absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent pointer-events-none"></div>

                  {cart.map(item => (
                    <div key={item.cartId} className="bg-stone-900/50 p-3 sm:p-4 hover:scale-[1.02] rounded-3xl shadow-md border border-white/5 flex items-center gap-3 sm:gap-4 group hover:bg-stone-900 transition-all duration-300 relative z-10">
                      
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-950 flex-shrink-0">
                        <img src={item.imgUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white leading-tight truncate">{item.name}</h4>
                        {item.selectedFlavor && <p className="text-xs text-stone-400 font-medium">Sabor: <span className="text-amber-500">{item.selectedFlavor}</span></p>}
                        <div className="text-amber-400 font-black mt-1.5">${(item.price * item.qty).toLocaleString('es-CO')}</div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <button onClick={() => removeItem(item.cartId)} className="text-stone-500 hover:text-red-400 transition-colors p-1" aria-label="Eliminar">
                          <Trash2 size={18}/>
                        </button>
                        
                        <div className="flex items-center gap-1 bg-stone-950 border border-white/5 rounded-lg p-1">
                          <button type="button" onClick={() => updateQty(item.cartId, -1)} className="bg-stone-800 text-stone-400 hover:text-white rounded-md p-1 shadow-sm transition-colors">
                            <Minus size={14}/>
                          </button>
                          <span className="w-6 text-center font-bold text-white text-sm">{item.qty}</span>
                          <button type="button" onClick={() => updateQty(item.cartId, 1)} className="bg-stone-800 text-stone-400 hover:text-white rounded-md p-1 shadow-sm transition-colors">
                            <Plus size={14}/>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* FORMULARIO DE CHECKOUT */}
                  <div className="mt-8 relative animate-fade-in">
                    <div className="bg-stone-900 border border-white/5 text-white p-6 sm:p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                      {/* Decoration Flotantes tipo 'fuego/brasas' */}
                      <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/10 rounded-full -mr-20 -mt-20 blur-[50px] pointer-events-none"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full -ml-16 -mb-16 blur-[40px] pointer-events-none"></div>
                      
                      <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-8 relative z-10 gap-2 border-b border-white/5 pb-6">
                        <span className="text-stone-400 font-medium">Total Parrilla:<br/><span className="text-xs text-stone-500 font-light tracking-wide">*Domicilio no incluido</span></span>
                        <span className="text-3xl sm:text-4xl font-black text-amber-500 leading-none">${totalCart.toLocaleString('es-CO')}</span>
                      </div>

                      <form onSubmit={handleCheckout} className="space-y-4 relative z-10">
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2.5 text-lg">
                          <div className="bg-amber-500/20 p-1.5 rounded-lg border border-amber-500/30">
                            <MapPin size={20} className="text-amber-500"/>
                          </div>
                          ¿A dónde te las llevamos?
                        </h4>
                        
                        <div className="space-y-4">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                              <User size={18} />
                            </div>
                            <input required type="text" placeholder="Tu Nombre Completo" className="w-full bg-stone-950 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-stone-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-medium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                                <Home size={18} />
                              </div>
                              <input required type="text" placeholder="Dirección (Ej. Cr 4 #5-6)" className="w-full bg-stone-950 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-stone-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-medium" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                            </div>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                                <Navigation size={18} />
                              </div>
                              <input required type="text" placeholder="Barrio" className="w-full bg-stone-950 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-stone-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-medium" value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} />
                            </div>
                          </div>
                          
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                              <Smartphone size={18} />
                            </div>
                            <input required type="tel" placeholder="Número de Celular" className="w-full bg-stone-950 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-stone-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-medium" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                          </div>
                          
                          <div className="pt-2">
                            <p className="text-sm font-bold text-stone-300 mb-3 ml-1">Método de pago al recibir:</p>
                            <div className="grid grid-cols-2 gap-3">
                              <label className={`cursor-pointer rounded-xl border p-3 flex flex-col items-center gap-2 transition-all ${formData.payment === 'efectivo' ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-stone-950 border-white/10 text-stone-500 hover:border-white/20 hover:text-stone-300'}`}>
                                <input type="radio" name="payment" value="efectivo" className="sr-only" checked={formData.payment === 'efectivo'} onChange={e => setFormData({...formData, payment: e.target.value})} />
                                <Banknote size={24} className={formData.payment === 'efectivo' ? 'text-amber-500' : 'opacity-70'} />
                                <span className="font-bold text-sm text-center">Efectivo</span>
                              </label>
                              <label className={`cursor-pointer rounded-xl border p-3 flex flex-col items-center gap-2 transition-all ${formData.payment === 'transferencia' ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-stone-950 border-white/10 text-stone-500 hover:border-white/20 hover:text-stone-300'}`}>
                                <input type="radio" name="payment" value="transferencia" className="sr-only" checked={formData.payment === 'transferencia'} onChange={e => setFormData({...formData, payment: e.target.value})} />
                                <CreditCard size={24} className={formData.payment === 'transferencia' ? 'text-amber-500' : 'opacity-70'} />
                                <span className="font-bold text-sm text-center">Nequi/Daviplata</span>
                              </label>
                            </div>
                          </div>
                          
                          <div className="relative pt-2">
                            <div className="absolute top-5 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                              <AlignLeft size={18} />
                            </div>
                            <textarea placeholder="Notas ej. 'Salsas aparte, sin cebolla, bien tostada'" rows={2} className="w-full bg-stone-950 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-stone-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none transition-all font-medium" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
                          </div>
                        </div>
                        
                        <button type="submit" className="w-full bg-gradient-to-r from-[#25D366] to-[#1DA851] text-white font-extrabold text-[15px] py-4.5 px-6 rounded-xl shadow-[0_10px_20px_-5px_rgba(37,211,102,0.4)] flex items-center justify-center gap-3 mt-7 transition-all hover:-translate-y-1 hover:shadow-[0_15px_25px_-5px_rgba(37,211,102,0.5)] active:translate-y-0 group h-[56px] border border-white/10">
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                          Mandar Pedido por WhatsApp
                        </button>
                        
                        <div className="bg-stone-950/50 border border-white/5 rounded-xl p-4 mt-4 flex items-start gap-3">
                          <div className="bg-stone-900 text-amber-500 rounded-full p-1.5 flex-shrink-0">
                            <Clock size={14} />
                          </div>
                          <p className="text-[11px] text-stone-400 font-light leading-snug">
                            <strong className="text-stone-300 font-bold block mb-0.5">¡Pagas al Recibir! 🤝</strong>
                            Aquí solo tomas la orden. No te pediremos tarjeta y pagarás directamente al recibir tus arepas o por Nequi/Daviplata por el chat de WhatsApp.
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE SABORES */}
      {flavorProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm" onClick={() => setFlavorProduct(null)}></div>
          <div className="bg-stone-900 border border-white/10 rounded-[2rem] p-6 sm:p-8 relative z-10 w-full max-w-md shadow-2xl animate-slide-in">
            <button onClick={() => setFlavorProduct(null)} className="absolute top-4 right-4 bg-stone-800 text-stone-400 hover:text-white p-2 rounded-full transition-colors border border-white/5 z-20"><X size={20} /></button>
            
            <div className="flex items-center gap-4 mb-6 pt-2">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-950 border border-white/10 flex-shrink-0 shadow-lg">
                <img src={flavorProduct.imgUrl} alt={flavorProduct.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white leading-none mb-1">{flavorProduct.name}</h3>
                <p className="text-amber-500 font-bold">${flavorProduct.price.toLocaleString('es-CO')}</p>
              </div>
            </div>
            
            <p className="text-stone-400 mb-4 font-light text-sm">Elige la bebida de tu preferencia:</p>
            <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {flavorProduct.flavors?.map(flavor => {
                const getFlavorImage = (f: string) => {
                  const lower = f.toLowerCase();
                  if (lower.includes('mora')) return 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=150&q=80';
                  if (lower.includes('mango')) return 'https://images.unsplash.com/photo-1623065422900-058721adcc20?auto=format&fit=crop&w=150&q=80';
                  if (lower.includes('mandarina') || lower.includes('naranja')) return 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&w=150&q=80';
                  return flavorProduct.imgUrl;
                };

                return (
                  <button
                    key={flavor}
                    onClick={() => addToCart(flavorProduct, flavor)}
                    className="bg-stone-950 hover:bg-stone-800 border border-white/5 hover:border-amber-500/50 transition-all shadow-md active:scale-95 text-left group flex items-center justify-between p-3 rounded-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-900 border border-white/5 flex-shrink-0">
                        <img 
                          src={getFlavorImage(flavor)} 
                          alt={flavor} 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                        />
                      </div>
                      <div className="text-stone-300 group-hover:text-amber-400 font-bold text-lg transition-colors">{flavor}</div>
                    </div>
                    <ChevronRight size={20} className="text-stone-600 group-hover:text-amber-500 transition-colors mr-1" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;