const { useState, useEffect } = React;

const productosData = [
  // CATEGORÍA: HAMBURGUESAS
  {
    id: 1,
    categoria: 'hamburguesas',
    nombre: 'La Legendaria',
    descripcion: '¿Buscas el equilibrio perfecto? La Clásica Beefger es donde todo comenzó. Carne jugosa, vegetales frescos y ese toque secreto que solo nosotros tenemos. Simple, real y absolutamente deliciosa. ✨ \n📍 ¡Pídela hoy y descubre por qué somos Beefger!',
    precio: '$16.000 Combo',
    imagen: '../imagenes/Legendaria.jpeg'
  },
  {
    id: 2,
    categoria: 'hamburguesas',
    nombre: 'Tropical Vulcano',
    descripcion: '¡Prepárate para una erupción de sabor! 🌋 La Tropical Volcano es para los que se atreven a más. Imagina: Queso mozzarella fundido sobre nuestra carne artesanal, el dulzor de la piña asada caramelizada y el golpe vibrante de los jalapeños con nuestra Mayo-Sriracha. 🍍🔥🌶️ ¿Nivel de picante? Tú lo decides. Una mezcla de colores y texturas que solo encuentras aquí. ¡Atrévete a probar el volcán!',
    precio: '$18.000',
    imagen: '../imagenes/vulcano.jpeg'
  },
  {
    id: 3,
    categoria: 'hamburguesas',
    nombre: 'Bourbon Smokehouse',
    descripcion: '¿Buscas la joya de la corona? 👑 Presentamos la Bourbon Smokehouse. Nuestra carne artesanal de 150g se encuentra con una mermelada de tocineta al whiskey que redefine lo que es el sabor. Coronada con un nido de cebolla crispy para ese "crunch" perfecto en cada bocado. Todo en un pan brioche sellado que abraza esta explosión de sabor. 🥓🥃✨ El secreto: El equilibrio entre el ahumado y el dulce del ron. ¡Pídela ya en Beefger!',
    precio: '$22.000',
    imagen: '../imagenes/Bourbon.jpeg'
  },
  {
    id: 4,
    categoria: 'hamburguesas',
    nombre: 'Umami Truffle Master',
    descripcion: 'Sofisticación pura en formato de hamburguesa. 💎 La Umami Truffle Master es nuestra apuesta para los paladares más exigentes. El alioli de ajo confitado prepara el camino para una generosa porción de champiñones salteados y pimienta negra recién molida sobre queso fundido. 🍄🧄Una experiencia terrosa, cremosa y absolutamente irresistible. Si amas lo gourmet, esta es tu Master en Beefger. 🎓🍔',
    precio: '$20.000',
    imagen: '../imagenes/umami.jpeg'
  },
  // CATEGORÍA: PERROS CALIENTES
  {
    id: 101,
    categoria: 'perros calientes',
    nombre: 'Perro Caliente Clásico New York',
    descripcion: 'Salchicha tipo frankfurt de alta calidad en pan tierno, acompañada de mostaza, ketchup, cebolla picada y chucrut.',
    precio: '$9.500',
    imagen: '../imagenes/perro_clasico_ny.png'
  },
  {
    id: 102,
    categoria: 'perros calientes',
    nombre: 'Perro Caliente Especial de la Casa',
    descripcion: 'Salchicha jumbo, queso fundido, tocineta desmechada, papas cabello de ángel, salsa de la casa y un toque de cilantro.',
    precio: '$11.000',
    imagen: '../imagenes/perro_especial.png'
  }
];

// ICONOS SVG (Heroicons)
const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
);

const FireIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-500 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.866 8.281 8.281 0 0 0 3 2.48Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
    </svg>
);

// COMPONENTES

const Header = () => {
    return (
        <header className="fixed w-full z-50 bg-slate-900/90 backdrop-blur-md border-b border-orange-500/20 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center gap-2 cursor-pointer">
                        {/* Logo tipográfico stylizado */}
                        <div className="bg-orange-500 text-slate-900 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-2xl">
                            B
                        </div>
                        <span className="text-2xl font-black tracking-tight text-white">
                            Beef<span className="text-orange-500 text-gradient">ger</span>
                        </span>
                    </div>
                    <nav className="hidden md:flex space-x-8">
                        <a href="#menu" className="text-slate-300 hover:text-orange-400 font-medium transition-colors">La Carta</a>
                        <a href="#nosotros" className="text-slate-300 hover:text-orange-400 font-medium transition-colors">Nosotros</a>
                        <a href="#contacto" className="text-slate-300 hover:text-orange-400 font-medium transition-colors">Contacto</a>
                    </nav>
                    <div className="flex items-center">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-transform hover:scale-110 shadow-lg shadow-orange-500/30">
                            <CartIcon />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            <div className="absolute inset-0 bg-slate-900 hero-pattern z-0"></div>
            {/* Gradiente radial para enfocar el centro */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-slate-900/80 z-0"></div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white">
                    Sabor que <br className="hidden md:block"/>
                    <span className="text-orange-500">Despierta Sentidos</span>
                </h1>
                <p className="mt-4 text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-light">
                    Las mejores hamburguesas y perros calientes de la ciudad. Preparados con ingredientes frescos y pasión artesanal.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                    <a href="#menu" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg shadow-orange-500/30 transition-all hover:scale-105">
                        Ver Menú Completo
                    </a>
                </div>
            </div>
        </section>
    );
};

const ProductCard = ({ producto }) => {
    return (
        <article className="bg-slate-800 rounded-2xl overflow-hidden card-hover border border-slate-700/50 flex flex-col h-full group">
            <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                <img 
                    src={producto.imagen} 
                    alt={producto.nombre} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300/1e293b/f97316?text=Imagen+No+Disponible';
                    }}
                />
                <div className="absolute top-4 right-4 z-20 bg-slate-900/90 backdrop-blur text-white font-bold py-1 px-3 rounded-full border border-slate-700 shadow-lg">
                    {producto.precio}
                </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                    {producto.nombre}
                </h3>
                <p className="text-slate-400 text-sm mb-6 flex-grow whitespace-pre-line leading-relaxed">
                    {producto.descripcion}
                </p>
                <button className="w-full bg-slate-700 hover:bg-orange-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300 flex justify-center items-center gap-2 group-hover:shadow-lg group-hover:shadow-orange-500/20">
                    <CartIcon />
                    <span>Añadir al pedido</span>
                </button>
            </div>
        </article>
    );
};

const MenuInfo = () => (
    <div className="w-full bg-slate-800/50 rounded-2xl p-6 md:p-10 mb-12 border border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
       <div>
           <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
               <FireIcon />
               Calidad 100% Artesanal
           </h3>
           <p className="text-slate-400 max-w-2xl">
               Nuestras recetas son únicas. Utilizamos carne de primera calidad, panes horneados en el día e ingredientes frescos para garantizar una experiencia explosiva.
           </p>
       </div>
    </div>
);

const App = () => {
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('hamburguesas');
    const [productosFiltrados, setProductosFiltrados] = useState([]);

    useEffect(() => {
        const filtrados = productosData.filter(p => p.categoria === categoriaSeleccionada);
        setProductosFiltrados(filtrados);
    }, [categoriaSeleccionada]);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <Hero />
                
                <section id="menu" className="py-20 bg-slate-900 relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black text-white mb-4">Nuestra <span className="text-orange-500">Carta</span></h2>
                            <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
                        </div>

                        {/* Pestañas de Navegación */}
                        <div className="flex justify-center gap-4 mb-12">
                            <button 
                                onClick={() => setCategoriaSeleccionada('hamburguesas')}
                                className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${
                                    categoriaSeleccionada === 'hamburguesas' 
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 transform scale-105' 
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                }`}
                            >
                                Hamburguesas
                            </button>
                            <button 
                                onClick={() => setCategoriaSeleccionada('perros calientes')}
                                className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${
                                    categoriaSeleccionada === 'perros calientes' 
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 transform scale-105' 
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                }`}
                            >
                                Perros Calientes
                            </button>
                        </div>

                        <MenuInfo />

                        {/* Grid de Productos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {productosFiltrados.map(producto => (
                                <ProductCard key={producto.id} producto={producto} />
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer id="contacto" className="bg-slate-950 border-t border-slate-800 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                            <div className="bg-orange-500 text-slate-900 w-8 h-8 rounded shrink-0 flex items-center justify-center font-bold text-xl">
                                B
                            </div>
                            <span className="text-xl font-black tracking-tight text-white">Beefger</span>
                        </div>
                        <p className="text-slate-400 max-w-xs mx-auto md:mx-0">
                            Haciendo las mejores hamburguesas artesanales de la ciudad, un bocado a la vez.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Contacto</h4>
                        <ul className="text-slate-400 space-y-2">
                            <li>📍 Av. Principal 123, Zona Gourmet</li>
                            <li>📞 +1 234 567 8900</li>
                            <li>✉️ hola@beefger.com</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Horario</h4>
                        <ul className="text-slate-400 space-y-2">
                            <li>Lun - Jue: 12:00 PM - 10:00 PM</li>
                            <li>Vie - Sáb: 12:00 PM - 12:00 AM</li>
                            <li>Dom: 1:00 PM - 9:00 PM</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm text-balance">
                    &copy; 2026 Beefger Restaurant. Todos los derechos reservados.
                </div>
            </footer>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
