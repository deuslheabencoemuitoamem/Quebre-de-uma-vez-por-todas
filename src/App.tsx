import React, { useState, useEffect } from "react";
import { ShieldCheck, ArrowRight, Heart, Sparkles, Star, MessageCircle, CreditCard, Compass, Flame, Smile, CheckCircle } from "lucide-react";
import CheckoutView from "./components/CheckoutView";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const CtaButton = ({ onClick, text, id }: { onClick: (id: string, text: string) => void; text?: string; id: string }) => {
  const buttonText = text || "Quero ter acesso a esse Super Combo que vai me permitir conseguir tudo isto acima";
  return (
    <div className="w-full max-w-2xl mx-auto my-6 px-4">
      <button
        id={id}
        onClick={() => onClick(id, buttonText)}
        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 hover:from-amber-600 hover:via-orange-700 hover:to-red-700 text-white font-sans font-bold text-center text-sm sm:text-base md:text-lg py-4 px-6 rounded-2xl transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all duration-300 shadow-xl shadow-orange-950/40 border border-white/15 hover:border-white/25 text-wrap"
      >
        <span className="leading-tight">
          {buttonText}
        </span>
        <ArrowRight className="w-5 h-5 flex-shrink-0 animate-pulse" />
      </button>
    </div>
  );
};

export default function App() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [activeCta, setActiveCta] = useState<{ id: string; text: string } | null>(null);

  useEffect(() => {
    // Automatically trigger initial view tracking event
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 
      event: "pagina_carregada" 
    });
  }, []);

  const handleCtaClick = (id: string, text: string) => {
    setActiveCta({ id, text });
    setShowCheckout(true);

    window.dataLayer = window.dataLayer || [];
    // Envia ÚNICA e EXCLUSIVAMENTE o evento clique_cta nos botões de CTA normais
    window.dataLayer.push({ 
      event: "clique_cta",
      cta_id: id,
      cta_text: text
    });

    // O evento abriu_checkout é disparado junto ao abrir o checkout de forma direta e blindada
    window.dataLayer.push({ 
      event: "abriu_checkout",
      cta_id: id,
      cta_text: text
    });
  };

  const handleBackFromCheckout = () => {
    setShowCheckout(false);
  };

  if (showCheckout) {
    return <CheckoutView onBack={handleBackFromCheckout} />;
  }

  return (
    <div className="relative min-h-screen bg-black text-white font-sans flex flex-col justify-between overflow-y-auto select-none">
      
      {/* Background Calm and Inspiring Sunset Image with Multi-layered vignettes */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/sunset_hero.png"
          alt="Sunset Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center select-none opacity-25"
        />
        {/* Soft, glowing radial focus over the golden sunset shades */}
        <div className="absolute inset-0 bg-radial-[circle_at_75%_30%] from-orange-500/10 via-black/60 to-black pointer-events-none mix-blend-screen" />
        
        {/* Sun Glow elements matching Immersive UI specifications */}
        <div className="absolute top-[10%] right-[15%] w-72 h-72 rounded-full blur-3xl bg-orange-500/15 opacity-40 pointer-events-none" />
        <div className="absolute bottom-[20%] left-[10%] w-80 h-80 rounded-full blur-3xl bg-amber-500/10 opacity-30 pointer-events-none" />
        
        {/* Deep ambient gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/90" />
      </div>

      {/* Desktop Top Toolbar Info Bar */}
      <header className="relative z-10 w-full max-w-4xl mx-auto px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-widest text-neutral-400">
          PROPRIEDADE EXCLUSIVA - SUPER COMBO
        </span>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900/80 backdrop-blur-md rounded-full border border-white/10">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[9px] font-mono tracking-widest text-white/90 font-bold uppercase">
            SUPER COMBO ATUALIZADO 2026
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10">
        
        {/* Section 1: Hero Block */}
        <section className="text-center flex flex-col gap-6 py-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-amber-100 font-bold leading-tight tracking-tight drop-shadow-md">
            Quebre de uma vez por todas as maldições na sua vida
          </h1>
          
          <div className="grid grid-cols-1 gap-3.5 text-left mt-4 max-w-xl mx-auto w-full">
            <div className="flex items-start gap-3 p-4 bg-neutral-900/60 backdrop-blur-sm rounded-xl border border-white/5 shadow-md">
              <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
              <p className="text-sm sm:text-base text-neutral-200 font-medium">Consiga receber a operação de Deus na sua vida</p>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-neutral-900/60 backdrop-blur-sm rounded-xl border border-white/5 shadow-md">
              <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base text-neutral-200 font-medium">Consiga paralisar toda dúvida</p>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-neutral-900/60 backdrop-blur-sm rounded-xl border border-white/5 shadow-md">
              <Heart className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base text-neutral-200 font-medium">Consiga paralisar todo medo</p>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-neutral-900/60 backdrop-blur-sm rounded-xl border border-white/5 shadow-md">
              <Compass className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base text-neutral-200 font-medium">Consiga paralisar toda ansiedade, tristeza e derrota</p>
            </div>
          </div>

          <CtaButton onClick={handleCtaClick} id="cta-hero" />
        </section>

        {/* Section 2: Tenha acesso a um Super Combo que vai te permitir */}
        <section className="py-2">
          <div className="bg-neutral-950/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/5 shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-amber-200 mb-6 border-b border-white/5 pb-3">
              Tenha acesso a um Super Combo que vai te permitir:
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                <p className="text-neutral-200 text-sm sm:text-base font-medium">
                  Conseguir com que toda má língua que lhe maldiz se torne bênçãos
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                <p className="text-neutral-200 text-sm sm:text-base font-medium">
                  Conseguir se livrar da falsidade
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                <p className="text-neutral-200 text-sm sm:text-base font-medium">
                  Conseguir se livrar das doenças
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                <p className="text-neutral-200 text-sm sm:text-base font-medium">
                  Conseguir se livrar da traição
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                <p className="text-neutral-200 text-sm sm:text-base font-medium">
                  Conseguir se livrar dos caminhos ruins e dolorosos
                </p>
              </div>
            </div>
          </div>
          <CtaButton onClick={handleCtaClick} id="cta-trajeto-permitir" />
        </section>

        {/* Section 3: Com esse Super Combo, você vai conseguir */}
        <section className="py-2">
          <div className="bg-neutral-950/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/5 shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-amber-200 mb-6 border-b border-white/5 pb-3">
              Com esse Super Combo, você vai conseguir:
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-200 text-sm sm:text-base font-medium">
                  Conseguir desamarrar tudo que está impedindo sua vitória
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-200 text-sm sm:text-base font-medium">
                  Conseguir abençoar a vida das pessoas que você ama e gosta
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-200 text-sm sm:text-base font-medium">
                  Conseguir ter proteção divina na sua vida
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-200 text-sm sm:text-base font-medium">
                  Conseguir ter força, coragem, sustentação e equilíbrio
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-200 text-sm sm:text-base font-medium">
                  Conseguir ter serenidade, paciência, controle, domínio próprio e compreensão
                </p>
              </div>
            </div>
          </div>
          <CtaButton onClick={handleCtaClick} id="cta-trajeto-conseguir" />
        </section>

        {/* Section 4: Esse Super Combo é para quem */}
        <section className="py-2">
          <div className="bg-neutral-950/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/5 shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-amber-200 mb-6 border-b border-white/5 pb-3">
              Esse Super Combo é para quem:
            </h2>
            <div className="flex flex-col gap-4.5">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-200 text-sm sm:text-base font-medium">
                  Quer conseguir ter mais compreensão, persistência, perseverança, inteligência e sabedoria
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-200 text-sm sm:text-base font-medium">
                  Quer conseguir desfazer da sua vida as armadilhas feitas pelo inimigo
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-200 text-sm sm:text-base font-medium">
                  Quer receber uma grande bênção de Deus ainda hoje
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-200 text-sm sm:text-base font-medium">
                  Quer receber uma visita de Deus ainda essa semana
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-200 text-sm sm:text-base font-medium">
                  Quer receber uma bênção financeira
                </p>
              </div>
            </div>
          </div>
          <CtaButton onClick={handleCtaClick} id="cta-trajeto-para-quem" />
        </section>

        {/* Section 5: Testimonial Viviane S. */}
        <section className="py-2">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 p-6 sm:p-8 rounded-2xl border border-white/5 flex flex-col justify-between shadow-lg relative">
            <div className="text-amber-400/20 text-6xl font-serif absolute top-2 left-4 pointer-events-none select-none">“</div>
            <p className="text-neutral-300 text-sm sm:text-base italic leading-relaxed relative z-10 pt-4">
              "As amarras espirituais caíram, as más línguas sumiram, portas se abriram onde eu só via parede. Deus me visitou de uma forma que eu nunca tinha experimentado. Graças ao Super Combo e a Deus, hoje sou outra pessoa. Paz, força e bênção financeira chegaram mesmo!"
            </p>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-sm font-bold text-amber-200">— Viviane S.</span>
              <div className="flex gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>
          </div>
          <CtaButton onClick={handleCtaClick} id="cta-depoimento-viviane" />
        </section>

        {/* Section 6: Testimonial Felipe Almeida */}
        <section className="py-2">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 p-6 sm:p-8 rounded-2xl border border-white/5 flex flex-col justify-between shadow-lg relative">
            <div className="text-amber-400/20 text-6xl font-serif absolute top-2 left-4 pointer-events-none select-none">“</div>
            <p className="text-neutral-300 text-sm sm:text-base italic leading-relaxed relative z-10 pt-4">
              "Eu pedi a Deus uma resposta. E veio através desse Super Combo. Foi como um empurrão divino. Me livrei de caminhos ruins, de pessoas falsas, da angústia... Hoje tenho domínio próprio, sabedoria e coragem pra seguir. É inexplicável."
            </p>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-sm font-bold text-amber-200">— Felipe Almeida</span>
              <div className="flex gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>
          </div>
          <CtaButton onClick={handleCtaClick} id="cta-depoimento-felipe-almeida" />
        </section>

        {/* Section 7: Adquirindo o Super Combo */}
        <section className="py-2">
          <div className="bg-neutral-950/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/5 shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-amber-200 mb-6 border-b border-white/5 pb-3">
              Adquirindo o Super Combo, você vai conseguir:
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-200 text-sm sm:text-base font-medium">
                  Conseguir receber uma boa notícia de Deus na sua vida
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-200 text-sm sm:text-base font-medium">
                  Conseguir a bênção de não faltar nada na sua vida
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-200 text-sm sm:text-base font-medium">
                  Conseguir com que praga NENHUMA chegue na sua tenda
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-200 text-sm sm:text-base font-medium">
                  Conseguir viver todos os dias na presença de Deus
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-200 text-sm sm:text-base font-medium">
                  Conseguir viver todos os dias com o cuidado, amor e carinho de Deus
                </p>
              </div>
            </div>
          </div>
          <CtaButton onClick={handleCtaClick} id="cta-adquirindo-trajeto" />
        </section>

        {/* Section 8: FAQ */}
        <section className="py-2 flex flex-col gap-6">
          <h2 className="text-2xl font-serif font-semibold text-center text-amber-100">
            Perguntas frequentes
          </h2>
          <div className="flex flex-col gap-4">
            <div className="bg-neutral-900/60 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3 mb-2.5">
                <MessageCircle className="w-5 h-5 text-green-400" />
                <h3 className="font-bold text-base text-white">Como recebo meu Super Combo?</h3>
              </div>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                Assim que o pagamento for confirmado, você receberá seu Super Combo por Whatsapp e o terá com acesso vitalício, para acessar quando e onde quiser.
              </p>
            </div>

            <div className="bg-neutral-900/60 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3 mb-2.5">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">Quais são as formas de pagamento disponíveis?</h3>
              </div>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                Pix e cartão de crédito.
              </p>
            </div>
          </div>
          <CtaButton onClick={handleCtaClick} id="cta-faq" />
        </section>

        {/* Section 9: Testimonial Camila Rocha */}
        <section className="py-2">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 p-6 sm:p-8 rounded-2xl border border-white/5 flex flex-col justify-between shadow-lg relative">
            <div className="text-amber-400/20 text-6xl font-serif absolute top-2 left-4 pointer-events-none select-none">“</div>
            <p className="text-neutral-300 text-sm sm:text-base italic leading-relaxed relative z-10 pt-4">
              “Foi com o Super Combo e com Deus que minha vida começou a andar. Eu estava completamente derrotada. Tudo dava errado, minha saúde, minha vida amorosa, meu dinheiro… Mas foi quando comecei a usar o Super Combo, com fé em Deus, que as coisas começaram a se desatar. Hoje eu vivo milagres diários. É surreal o que Deus faz quando a gente entrega e usa as ferramentas certas.”
            </p>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-sm font-bold text-amber-200">— Camila Rocha</span>
              <div className="flex gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>
          </div>
          <CtaButton onClick={handleCtaClick} id="cta-depoimento-camila-rocha" />
        </section>

        {/* Section 10: Testimonial Felipe Nascimento */}
        <section className="py-2">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 p-6 sm:p-8 rounded-2xl border border-white/5 flex flex-col justify-between shadow-lg relative">
            <div className="text-amber-400/20 text-6xl font-serif absolute top-2 left-4 pointer-events-none select-none">“</div>
            <p className="text-neutral-300 text-sm sm:text-base italic leading-relaxed relative z-10 pt-4">
              “Eu clamei e Deus usou o Super Combo pra mudar minha história. Nunca vou esquecer da noite em que fiz uma oração. Chorei como nunca. Era como se Deus estivesse ali comigo. Desde então, minha mente clareou, a ansiedade sumiu, portas se abriram. Foi Deus, mas Ele usou esse Super Combo pra me alcançar."
            </p>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-sm font-bold text-amber-200">— Felipe Nascimento</span>
              <div className="flex gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>
          </div>
          <CtaButton onClick={handleCtaClick} id="cta-depoimento-felipe-nascimento" />
        </section>

        {/* Section 11: Pricing Area */}
        <section className="py-4">
          <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 rounded-3xl p-8 sm:p-10 border border-amber-500/20 shadow-2xl text-center max-w-lg mx-auto relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
            <h3 className="text-lg sm:text-xl font-medium text-neutral-400 uppercase tracking-widest mb-3 font-mono">
              Adquira agora o Super Combo por:
            </h3>
            
            <div className="flex flex-col gap-2 items-center justify-center my-6">
              <span className="text-lg sm:text-xl text-neutral-500 line-through font-semibold">
                De R$57
              </span>
              <span className="text-4xl sm:text-5xl md:text-6xl font-serif text-amber-400 font-extrabold tracking-tight drop-shadow-sm leading-tight">
                por apenas R$12
              </span>
            </div>
          </div>
          <CtaButton onClick={handleCtaClick} id="cta-preco" />
        </section>

        {/* Section 12: Testimonial Sandra Martins */}
        <section className="py-2">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 p-6 sm:p-8 rounded-2xl border border-white/5 flex flex-col justify-between shadow-lg relative">
            <div className="text-amber-400/20 text-6xl font-serif absolute top-2 left-4 pointer-events-none select-none">“</div>
            <p className="text-neutral-300 text-sm sm:text-base italic leading-relaxed relative z-10 pt-4">
              “Esse Super Combo é uma resposta direta de Deus. Eu pedi uma direção a Deus. Estava cansada de sofrer. Quando encontrei o Super Combo, eu sabia que era a resposta. Não demorou: a tristeza foi embora, meu filho voltou a falar comigo, e eu consegui um emprego depois de 2 anos parada. Eu sou a prova viva de que Deus opera quando a gente dá o primeiro passo."
            </p>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-sm font-bold text-amber-200">— Sandra Martins</span>
              <div className="flex gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>
          </div>
          <CtaButton onClick={handleCtaClick} id="cta-depoimento-sandra-martins" />
        </section>

        {/* Section 13: Testimonial Luciana Teixeira */}
        <section className="py-2">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 p-6 sm:p-8 rounded-2xl border border-white/5 flex flex-col justify-between shadow-lg relative">
            <div className="text-amber-400/20 text-6xl font-serif absolute top-2 left-4 pointer-events-none select-none">“</div>
            <p className="text-neutral-300 text-sm sm:text-base italic leading-relaxed relative z-10 pt-4">
              “A boa notícia chegou, e foi diretamente de Deus! Eu estava orando há meses por uma resposta. Nada mudava. Mas depois de começar esse conteúdo, foi questão de dias. Deus me surpreendeu com uma notícia que mudou tudo. O que eu achava impossível, Ele fez acontecer. Eu só posso agradecer!"
            </p>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-sm font-bold text-amber-200">— Luciana Teixeira</span>
              <div className="flex gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>
          </div>
          <CtaButton onClick={handleCtaClick} id="cta-depoimento-luciana-teixeira" />
        </section>

      </main>

      {/* Sleek secure disclaimer footer */}
      <footer className="relative z-10 w-full px-6 py-8 border-t border-white/5 text-center text-xs text-neutral-500 font-mono flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-orange-400 animate-pulse" />
        <span className="tracking-widest">AMBIENTE 100% SEGURO & PRIVADO</span>
      </footer>

    </div>
  );
}
