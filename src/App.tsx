import React, { useState, useEffect } from 'react';
import { 
  User,
  Calendar,
  MapPin,
  MessageSquare,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import PanelDetailsPage from './components/PanelDetailsPage';

function PanelsCarousel({ panels }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % panels.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [panels.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % panels.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + panels.length) % panels.length);
  };

  return (
    <section id="panels" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Panels à Venir
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez les prochains panels et leurs intervenants experts
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Carrousel Principal */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="relative h-[500px]">
              {panels.map((panel, index) => (
                <div
                  key={panel.id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentSlide 
                      ? 'opacity-100 transform translate-x-0' 
                      : index < currentSlide 
                        ? 'opacity-0 transform -translate-x-full' 
                        : 'opacity-0 transform translate-x-full'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row h-full">
                    {/* Section Panéliste avec dégradé dynamique */}
                    <div className={`lg:w-2/5 bg-gradient-to-br ${panel.gradient} flex items-center justify-center relative overflow-hidden`}>
                      {/* Effet de fond décoratif */}
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                      
                      <div className="text-center text-white p-8 relative z-10">
                        <div className="relative mb-6">
                          <img
                            src={panel.panelistes[0]?.avatar}
                            alt={panel.panelistes[0]?.nom}
                            className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-2xl object-cover"
                          />
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <User className="text-gray-600" size={16} />
                          </div>
                        </div>
                        <h3 className="text-3xl font-bold mb-2">{panel.panelistes[0]?.nom}</h3>
                        <p className="text-white/90 text-lg font-medium">{panel.panelistes[0]?.titre}</p>
                      </div>
                    </div>

                    {/* Section Informations du Panel */}
                    <div className="lg:w-3/5 p-10 flex flex-col justify-center bg-gradient-to-br from-gray-50 to-white">
                      <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{panel.panel}</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="flex items-center group">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                            <Calendar className="text-blue-600" size={20} />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Date</span>
                            <p className="text-lg font-semibold text-gray-900">{panel.date}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center group">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                            <MapPin className="text-green-600" size={20} />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Localisation</span>
                            <p className="text-lg font-semibold text-gray-900">{panel.localisation}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center group">
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                            <Shield className="text-purple-600" size={20} />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Modérateur</span>
                            <p className="text-lg font-semibold text-gray-900">{panel.moderateur.nom}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start group">
                          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-orange-200 transition-colors">
                            <MessageSquare className="text-orange-600" size={20} />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Thème</span>
                            <p className="text-lg font-semibold text-gray-900 leading-relaxed">{panel.theme}</p>
                          </div>
                        </div>
                      </div>
                      {/* Bouton Voir les détails */}
                      <div className="mt-8">
                        <button
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-8 rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                          type="button"
                          onClick={() => navigate(`/panel/${panel.id}`, { state: { panel } })}
                        >
                          Voir les détails
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contrôles du carrousel */}
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-xl transition-all hover:scale-110 z-10"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-xl transition-all hover:scale-110 z-10"
            >
              <ChevronRight size={24} />
            </button>

            {/* Indicateurs améliorés */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {panels.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 ${
                    index === currentSlide 
                      ? 'w-8 h-3 bg-white rounded-full' 
                      : 'w-3 h-3 bg-white/60 rounded-full hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Miniatures des panels suivants */}
          <div className="flex justify-center mt-8 space-x-4 overflow-x-auto pb-4">
            {panels.map((panel, index) => (
              <button
                key={panel.id}
                onClick={() => setCurrentSlide(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                  index === currentSlide 
                    ? 'ring-4 ring-blue-500 scale-110' 
                    : 'opacity-60 hover:opacity-100 hover:scale-105'
                }`}
              >
                <img
                  src={panel.panelistes[0]?.avatar}
                  alt={panel.panelistes[0]?.nom}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PanelDetailsRoute({ panels }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  let panel = location.state?.panel;
  if (!panel && id) {
    panel = panels.find((p) => String(p.id) === String(id));
  }
  if (!panel) {
    return <div className="text-center py-20 text-2xl">Panel introuvable</div>;
  }
  return <PanelDetailsPage panel={panel} onBack={() => navigate('/')} />;
}

export default function App() {
  const panels = [
    {
      id: 1,
      panel: "Panel Santé Publique",
      date: "15 Mars 2024",
      localisation: "Dakar, Sénégal",
      theme: "Innovation en santé digitale",
      gradient: "from-emerald-500 to-teal-600",
      moderateur: {
        nom: "Dr. Amadou Ba",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        titre: "Médecin Chef"
      },
      panelistes: [
        { nom: "Marie Diallo", avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop", titre: "Spécialiste Santé Digitale" },
        { nom: "Alioune Sarr", avatar: "https://randomuser.me/api/portraits/men/45.jpg", titre: "Consultant e-Santé" }
      ]
    },
    {
      id: 2,
      panel: "Panel Économie Numérique",
      date: "22 Mars 2024",
      localisation: "Thiès, Sénégal",
      theme: "Transformation digitale des entreprises",
      gradient: "from-purple-500 to-indigo-600",
      moderateur: {
        nom: "Fatou Sow",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        titre: "Directrice Innovation"
      },
      panelistes: [
        { nom: "Ousmane Ndiaye", avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop", titre: "Expert Fintech" },
        { nom: "Moussa Diop", avatar: "https://randomuser.me/api/portraits/men/46.jpg", titre: "Entrepreneur Numérique" }
      ]
    },
    {
      id: 3,
      panel: "Panel Éducation",
      date: "28 Mars 2024",
      localisation: "Saint-Louis, Sénégal",
      theme: "L'avenir de l'éducation en Afrique",
      gradient: "from-rose-500 to-pink-600",
      moderateur: {
        nom: "Mamadou Diop",
        avatar: "https://randomuser.me/api/portraits/men/47.jpg",
        titre: "Inspecteur Académique"
      },
      panelistes: [
        { nom: "Aïssatou Sarr", avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop", titre: "Professeure Université" },
        { nom: "Fatou Bintou", avatar: "https://randomuser.me/api/portraits/women/48.jpg", titre: "Chercheuse" }
      ]
    },
    {
      id: 4,
      panel: "Panel Agriculture",
      date: "5 Avril 2024",
      localisation: "Kaolack, Sénégal",
      theme: "Agriculture durable et technologie",
      gradient: "from-orange-500 to-red-600",
      moderateur: {
        nom: "Aminata Touré",
        avatar: "https://randomuser.me/api/portraits/women/49.jpg",
        titre: "Ingénieure Agronome"
      },
      panelistes: [
        { nom: "Ibrahima Fall", avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop", titre: "Expert AgroTech" },
        { nom: "Cheikh Mbaye", avatar: "https://randomuser.me/api/portraits/men/50.jpg", titre: "Consultant Rural" }
      ]
    },
    {
      id: 5,
      panel: "Panel Technologie",
      date: "12 Avril 2024",
      localisation: "Ziguinchor, Sénégal",
      theme: "Intelligence artificielle et société",
      gradient: "from-blue-500 to-cyan-600",
      moderateur: {
        nom: "Ndeye Fatou",
        avatar: "https://randomuser.me/api/portraits/women/51.jpg",
        titre: "Data Scientist"
      },
      panelistes: [
        { nom: "Cheikh Sy", avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop", titre: "Ingénieur IA" },
        { nom: "Mame Diarra", avatar: "https://randomuser.me/api/portraits/women/52.jpg", titre: "Développeuse ML" }
      ]
    }
  ];

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16 justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  {/* Icône ou logo ici si besoin */}
                </div>
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  e-Panel
                </span>
              </div>
              <a
                href="#connexion"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-6 rounded-xl font-semibold shadow-md transition-all text-base"
              >
                Accéder à Mon Espace
              </a>
            </div>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<PanelsCarousel panels={panels} />} />
          <Route path="/panel/:id" element={<PanelDetailsRoute panels={panels} />} />
        </Routes>
        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-2xl font-bold">e-Panel</span>
            <p className="text-gray-400 mt-2">&copy; 2024 e-Panel. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}