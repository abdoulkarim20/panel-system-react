import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Shield, 
  MessageSquare, 
  QrCode,
  Share2,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import QRCode from 'qrcode';

interface Panel {
  id: number;
  panel: string;
  date: string;
  localisation: string;
  theme: string;
  gradient: string;
  moderateur: {
    nom: string;
    avatar: string;
    titre: string;
  };
  panelistes: { nom: string; avatar: string; titre: string }[];
}

interface PanelDetailsPageProps {
  panel: Panel;
  onBack: () => void;
}

const PanelDetailsPage: React.FC<PanelDetailsPageProps> = ({ panel, onBack }) => {
  const qrRef = React.useRef<HTMLCanvasElement>(null);
  const qrModalRef = React.useRef<HTMLCanvasElement>(null);
  // Fusionner modérateur et panélistes dans un seul carrousel
  const allParticipants = [
    { ...panel.moderateur, isModerateur: true },
    ...panel.panelistes.map(p => ({ ...p, isModerateur: false }))
  ];
  const [currentParticipant, setCurrentParticipant] = React.useState(0);
  // Pour le zoom du QR code
  const [showQrModal, setShowQrModal] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentParticipant((prev) => (prev + 1) % allParticipants.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [allParticipants.length]);

  const handlePrevParticipant = () => {
    setCurrentParticipant((prev) => (prev - 1 + allParticipants.length) % allParticipants.length);
  };
  const handleNextParticipant = () => {
    setCurrentParticipant((prev) => (prev + 1) % allParticipants.length);
  };

  React.useEffect(() => {
    const generateQRCode = async () => {
      if (qrRef.current) {
        // URL du panel pour le QR code
        const panelUrl = `${window.location.origin}/panel/${panel.id}`;
        
        try {
          // Générer le QR code (petit)
          await QRCode.toCanvas(qrRef.current, panelUrl, {
            width: 200,
            margin: 2,
            color: {
              dark: '#1f2937',
              light: '#ffffff'
            },
            errorCorrectionLevel: 'H'
          });
        } catch (error) {
          console.error('Erreur lors de la génération du QR code:', error);
        }
      }
    };
    
    generateQRCode();
  }, [panel.id]);

  // Générer le QR code de la modal à chaque ouverture
  React.useEffect(() => {
    if (showQrModal && qrModalRef.current) {
      const panelUrl = `${window.location.origin}/panel/${panel.id}`;
      QRCode.toCanvas(qrModalRef.current, panelUrl, {
        width: 500,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      }).catch(error => {
        console.error('Erreur lors de la génération du QR code (modal):', error);
      });
    }
  }, [showQrModal, panel.id]);

  const handleShare = () => {
    const panelUrl = `${window.location.origin}/panel/${panel.id}`;
    if (navigator.share) {
      navigator.share({
        title: panel.panel,
        text: `Rejoignez le panel: ${panel.theme}`,
        url: panelUrl,
      });
    } else {
      navigator.clipboard.writeText(panelUrl);
      alert('Lien copié dans le presse-papiers!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header de navigation */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 md:h-12"></div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="w-[90%] mx-auto px-2 sm:px-4 lg:px-6 py-4">
        {/* Section principale avec modérateur et panélistes */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700 tracking-tight">{panel.panel}</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full md:ml-6"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Carrousel modérateur + panélistes */}
              <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-blue-700 flex items-center">
                    <Users className="mr-2" size={20} /> Intervenants
                  </span>
                  <div className="flex space-x-2">
                    <button onClick={handlePrevParticipant} className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={handleNextParticipant} className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-center">
                  {allParticipants.length > 0 && (
                    <div className={`flex flex-col items-center bg-white rounded-3xl p-10 shadow-lg w-[90%] mx-auto border ${allParticipants[currentParticipant].isModerateur ? 'border-purple-300' : 'border-blue-100'} hover:shadow-2xl transition-shadow duration-300`}>
                      <img src={allParticipants[currentParticipant].avatar} alt={allParticipants[currentParticipant].nom} className={`w-40 h-40 rounded-full object-cover border-4 ${allParticipants[currentParticipant].isModerateur ? 'border-purple-300' : 'border-blue-300'} mb-6 shadow-md`} />
                      <div className="font-extrabold text-gray-900 text-2xl mb-1 tracking-tight flex items-center">
                        {allParticipants[currentParticipant].nom}
                        {allParticipants[currentParticipant].isModerateur && (
                          <span className="ml-2 px-2 py-1 text-xs rounded bg-purple-100 text-purple-700 font-bold flex items-center"><Shield size={14} className="mr-1" /> Modérateur</span>
                        )}
                      </div>
                      <div className={`${allParticipants[currentParticipant].isModerateur ? 'text-purple-600' : 'text-blue-600'} text-lg font-medium`}>{allParticipants[currentParticipant].titre}</div>
                    </div>
                  )}
                </div>
                {/* Indicateurs */}
                <div className="flex justify-center mt-4 space-x-2">
                  {allParticipants.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentParticipant(idx)}
                      className={`w-3 h-3 rounded-full ${idx === currentParticipant ? 'bg-blue-600' : 'bg-blue-200'}`}
                    />
                  ))}
                </div>
              </div>
              {/* Colonne date, lieu, thème principal */}
              <div className="flex flex-col gap-2 justify-start">
                <div className="flex flex-row gap-2">
                  <div className="flex items-center flex-1 p-6 bg-blue-50 rounded-2xl">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mr-4">
                      <Calendar className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Date</span>
                      <p className="text-xl font-semibold text-gray-900">{panel.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center flex-1 p-6 bg-green-50 rounded-2xl">
                    <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mr-4">
                      <MapPin className="text-green-600" size={24} />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Lieu</span>
                      <p className="text-xl font-semibold text-gray-900">{panel.localisation}</p>
                    </div>
                  </div>
                </div>
                {/* Thème Principal */}
                <div className="flex items-start p-6 bg-white rounded-2xl shadow border border-blue-100 mt-2">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                    <MessageSquare className="text-blue-600" size={28} />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Thème Principal</span>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{panel.theme}</h3>
                    <p className="text-gray-600 leading-relaxed text-base">
                      Ce panel abordera les enjeux contemporains et les perspectives d'avenir dans le domaine. 
                      Une discussion enrichissante avec des experts reconnus pour partager leurs expériences et visions.
                      Les participants auront l'opportunité d'échanger directement avec les intervenants et d'approfondir 
                      leurs connaissances sur les sujets abordés.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Fin section panélistes + description */}
          </div>
        </div>

        {/* Section QR Code modernisée */}
        <div className="mb-12">
          <div className="w-full max-w-3xl mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 md:p-12 flex flex-col items-center shadow-xl">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <QrCode className="text-white" size={48} />
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-blue-700 mb-1">Accès rapide au panel</h3>
              <p className="text-gray-600 text-lg">Scannez ou partagez ce QR code</p>
            </div>
            <div className="flex flex-col md:flex-row items-center w-full gap-8">
              <div className="flex flex-col items-center bg-white p-8 rounded-3xl shadow-lg cursor-zoom-in" onClick={() => setShowQrModal(true)} title="Cliquer pour agrandir">
                <canvas ref={qrRef} className="mx-auto w-48 h-48" style={{ width: '192px', height: '192px' }}></canvas>
                <p className="text-sm text-gray-500 mt-4">Cliquez pour agrandir le QR code</p>
              </div>
              <div className="flex flex-col items-center md:items-start w-full">
                <ul className="space-y-3 mb-6 w-full">
                  <li className="flex items-center text-gray-700 text-base"><span className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-200 text-blue-700 font-bold mr-3">1</span>Ouvrez l'appareil photo</li>
                  <li className="flex items-center text-gray-700 text-base"><span className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-200 text-blue-700 font-bold mr-3">2</span>Pointez vers le QR code</li>
                  <li className="flex items-center text-gray-700 text-base"><span className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-200 text-blue-700 font-bold mr-3">3</span>Accédez au panel</li>
                </ul>
                <button
                  onClick={handleShare}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 px-8 rounded-2xl transition-all font-semibold flex items-center text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Share2 className="mr-3" size={20} />
                  Partager ce panel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Informations supplémentaires */}
      </main>
      {/* Modal de zoom QR code */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setShowQrModal(false)}>
          <div className="bg-white rounded-3xl p-8 shadow-2xl relative flex flex-col items-center" style={{ minWidth: 350, minHeight: 350 }} onClick={e => e.stopPropagation()}>
            <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold" onClick={() => setShowQrModal(false)} aria-label="Fermer">&times;</button>
            <canvas ref={qrModalRef} className="w-[320px] h-[320px] md:w-[500px] md:h-[500px]" style={{ width: '100%', maxWidth: 500, height: 'auto' }}></canvas>
            <p className="text-gray-600 mt-4">Scannez ou fermez pour revenir</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelDetailsPage;