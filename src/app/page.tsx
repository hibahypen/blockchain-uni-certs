import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">
          PORTAIL DE <span className="text-blue-700">CERTIFICATION</span>
        </h1>
        <p className="text-xl text-slate-500 font-light">
          Validation multi-acteurs sécurisée par la technologie Blockchain.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link 
            href="/login" 
            className="px-8 py-4 bg-blue-700 text-white rounded-xl font-bold shadow-lg hover:shadow-blue-200 transition-all hover:-translate-y-1"
          >
            Se Connecter / S'inscrire
          </Link>
          <Link 
            href="/verify" 
            className="px-8 py-4 border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
          >
            Vérifier un Diplôme
          </Link>
        </div>
      </div>
    </main>
  );
}