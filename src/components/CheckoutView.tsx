import React, { useState, useEffect } from "react";
import { ArrowLeft, Check, ShieldCheck, CreditCard, Lock, Smartphone, Users, Settings, Copy, Info } from "lucide-react";
import { generatePixCode } from "../lib/pix";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

interface CheckoutViewProps {
  onBack: () => void;
}

export interface OfferItem {
  id: number;
  text: string;
  price: number;
}

const OFFERS_DATA: OfferItem[] = [
  { id: 1, text: "Passo a passo de como ouvir a voz de Deus e saber se ele falou com você", price: 4.00 },
  { id: 2, text: "Técnica para saber se aquele sonho é uma revelação de Deus", price: 4.00 },
  { id: 3, text: "Manual de como ser uma pessoa que Deus ouve", price: 4.00 },
  { id: 4, text: "Mapa do caminho que lhe mostra o que fazer para não sofrer um ataque do inimigo", price: 4.00 },
  { id: 5, text: "Fundo musical para orar e conseguir ficar a sós com Deus", price: 4.00 },
  { id: 6, text: "Oração super poderosa para mudar sua vida e a de quem você ama", price: 4.00 },
  { id: 7, text: "O melhor plano para seguir e garantir seu lugar no paraíso", price: 4.00 },
  { id: 8, text: "Super Método para adormecer com Deus e acordar com uma ótima surpresa", price: 4.00 },
  { id: 9, text: "Trajeto da fé para conseguir enxergar solução onde você não está vendo saída", price: 4.00 },
  { id: 10, text: "Caminho prático para conseguir sair da vida do pecado", price: 4.00 },
  { id: 11, text: "Aprenda a lidar com a inveja e evite problemas horríveis na sua vida", price: 4.00 },
  { id: 12, text: "Super combo para conseguir quebrar de uma vez por todas as maldições na sua vida", price: 4.00 },
  { id: 13, text: "Caminho para ter uma mente forte e um coração sábio", price: 4.00 },
  { id: 14, text: "Estratégia para conseguir se proteger do maligno", price: 4.00 },
  { id: 15, text: "Fórmula para se tornar uma pessoa grandiosa, nobre e abençoada", price: 4.00 },
  { id: 16, text: "Jornada para conseguir paralisar todo medo e dúvida", price: 4.00 },
  { id: 17, text: "Rota para paralisar toda ansiedade, tristeza e derrota", price: 4.00 },
  { id: 18, text: "Trilha para conseguir mandar embora os dias turbulentos da sua vida", price: 4.00 }
];

export default function CheckoutView({ onBack }: CheckoutViewProps) {
  const [selectedOffers, setSelectedOffers] = useState<number[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // States for Pix vendor configuration
  const [pixKey, setPixKey] = useState(() => {
    const val = localStorage.getItem("checkout_pix_key");
    if (!val || val === "financeiro@seudominio.com.br") return "lucasdelimapraxedes@gmail.com";
    return val;
  });
  const [recipientName, setRecipientName] = useState(() => {
    const val = localStorage.getItem("checkout_pix_recipient");
    if (!val || val === "IGREJA DO REINO") return "Lucas Apolônio Praxedes de Lima";
    return val;
  });
  const [recipientCity, setRecipientCity] = useState(() => {
    const val = localStorage.getItem("checkout_pix_city");
    if (!val) return "SAO PAULO";
    return val;
  });
  const [cardPaymentLink, setCardPaymentLink] = useState(() => {
    return localStorage.getItem("checkout_card_link") || "";
  });
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Credit card real input states
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardError, setCardError] = useState("");

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    val = val.substring(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(" ") || val;
    setCardNumber(formatted);
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    val = val.substring(0, 4);
    if (val.length > 2) {
      val = `${val.substring(0, 2)}/${val.substring(2)}`;
    }
    setCardExpiry(val);
  };

  const handleCardCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").substring(0, 4);
    setCardCvv(val);
  };

  const handleCardHolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardHolderName(e.target.value.toUpperCase());
  };

  // Controle secreto de administração (invisível para clientes comuns)
  const [isAdminModeEnabled, setIsAdminModeEnabled] = useState(() => {
    return typeof window !== "undefined" && (
      window.location.search.includes("admin=true") || 
      window.location.hash === "#admin"
    );
  });
  const [lockClickCount, setLockClickCount] = useState(0);

  const handleLockClick = () => {
    const newCount = lockClickCount + 1;
    setLockClickCount(newCount);
    if (newCount >= 5) {
      setIsAdminModeEnabled(true);
      setIsAdminOpen(true);
    }
  };

  const basePrice = 10.00;
  
  const handleToggleOffer = (id: number) => {
    const isAdding = !selectedOffers.includes(id);
    setSelectedOffers((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );

    if (isAdding) {
      const offer = OFFERS_DATA.find((o) => o.id === id);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ 
        event: 'adicionou_order_bump',
        nome_produto: offer ? offer.text : "",
        valor: offer ? offer.price : 0
      });
    }
  };

  const calculateTotal = () => {
    const extrasTotal = selectedOffers.reduce((sum, id) => {
      const offer = OFFERS_DATA.find((o) => o.id === id);
      return sum + (offer ? offer.price : 0);
    }, 0);
    return basePrice + extrasTotal;
  };

  const getWhatsAppUrl = (methodOverride?: "pix" | "card") => {
    const total = calculateTotal();
    const currentMethod = methodOverride || paymentMethod;
    let message = "";
    if (currentMethod === "pix") {
      message += `Olá, Lucas! Realizei o pagamento via Pix.\n\n`;
      message += `Aqui estão os detalhes do meu pedido:\n`;
    } else {
      message += `Quero fazer o pagamento do meu pedido com cartão! Aqui estão os detalhes do meu pedido:\n`;
    }
    message += `✅ Super Método (R$ 10,00)\n`;

    if (selectedOffers.length > 0) {
      message += `\n*Ofertas Adicionais Selecionadas:*\n`;
      selectedOffers.forEach((id) => {
        const offer = OFFERS_DATA.find((o) => o.id === id);
        if (offer) {
          message += `• ${offer.text} (R$ ${offer.price.toFixed(2)})\n`;
        }
      });
    }

    message += `\n*💰 Valor Total:* R$ ${total.toFixed(2)}\n\n`;
    if (currentMethod === "pix") {
      message += `Por favor, envie meus acessos e os conteúdos correspondentes. Obrigado!`;
    } else {
      message += `me envie o link de pagamento seguro por cartão para eu concluir a compra!`;
    }

    const encodedText = encodeURIComponent(message);
    return `https://wa.me/5511912032350?text=${encodedText}`;
  };

  const handleFinishPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCardError("");
    setIsProcessing(true);

    if (paymentMethod === "pix") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ 
        event: 'confirmou_pagamento_pix' 
      });
    } else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ 
        event: 'iniciou_pagamento_cartao_wpp',
        forma_pagamento: 'cartao_credito'
      });
    }

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      try {
        const url = getWhatsAppUrl();
        window.open(url, "_blank");
      } catch (err) {
        console.log("Navigation blocked by iframe restrictions, user can click the green button directly.", err);
      }
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white font-sans overflow-y-auto pb-16">
      {/* Background Ambience */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-orange-950/20 via-neutral-950 to-transparent pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-orange-600/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-neutral-700/5 blur-[120px] pointer-events-none -z-10" />

      {/* Navigation Headers */}
      <header className="max-w-5xl mx-auto px-6 pt-4 pb-0 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao início</span>
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900 border border-white/10 rounded-full text-[10px] font-mono tracking-widest text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          DETECTOR DE FINALIZADOS
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-2 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6">
        
        {/* Left Column: Offers checkboxes (Grid Layout) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h2 className="text-lg md:text-xl font-serif text-white font-medium mb-2">Ofertas Disponíveis</h2>
            <p className="text-white text-sm leading-relaxed mb-6 select-text">
              Confira essas outras ofertas abaixo para você, caso queira adquirir é só marcar no quadrado ao lado do nome da oferta que tem interesse
            </p>
          </div>

          <div className="space-y-3">
            {OFFERS_DATA.map((offer) => {
              const isChecked = selectedOffers.includes(offer.id);
              return (
                <div
                  key={offer.id}
                  onClick={() => handleToggleOffer(offer.id)}
                  className={`group relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none ${
                    isChecked
                      ? "bg-orange-950/20 border-orange-500/40 shadow-lg shadow-orange-500/5 text-white"
                      : "bg-neutral-900/40 border-white/5 hover:border-white/10 hover:bg-neutral-900/60 text-neutral-300 hover:text-white"
                  }`}
                >
                  <div className="pt-0.5">
                    {/* Custom Styled Checkbox Container */}
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center transition-all border ${
                        isChecked
                          ? "bg-green-500 border-green-500 text-black scale-102"
                          : "bg-neutral-950 border-neutral-700 group-hover:border-neutral-500"
                      }`}
                    >
                      {isChecked && <Check className="w-4 h-4 stroke-[3px]" />}
                    </div>
                  </div>
                  
                  <div className="flex-grow flex flex-col gap-1.5 text-left">
                    <span className="text-sm font-medium leading-relaxed select-text block">
                      Se além de adquirir o Super Método, você também quer isto: <span className="font-semibold text-white">{offer.text} R${offer.price.toFixed(2).replace(".", ",")}</span>
                    </span>
                    <span className="text-xs font-semibold text-orange-400 block">
                      Clique nesse quadrado 🔳
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dynamic Price Summary & Payments Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-6 shadow-xl sticky top-6">
            
            {/* Purchase Header info */}
            <div className="pb-4 border-b border-white/5 mb-4">
              <h3 className="text-lg font-serif font-semibold text-white">Resumo do Pedido</h3>
              <p className="text-xs text-neutral-400 mt-1 select-text">Acesso digital seguro e instantâneo</p>
            </div>

            {/* Calculations */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-neutral-400">
                <span className="select-text">Acesso ao Super Método</span>
                <span className="font-mono text-white">R$ 10,00</span>
              </div>
              
              {selectedOffers.map((id) => {
                const offer = OFFERS_DATA.find((o) => o.id === id);
                if (!offer) return null;
                return (
                  <div key={offer.id} className="flex justify-between items-start gap-4 text-neutral-400 text-xs pl-2 border-l border-orange-500/20 py-0.5">
                    <span className="select-text leading-relaxed flex-grow">{offer.text}</span>
                    <span className="font-mono text-white shrink-0">R$ {offer.price.toFixed(2)}</span>
                  </div>
                );
              })}

              <div className="pt-3 border-t border-white/5 flex justify-between items-baseline">
                <span className="text-base font-medium select-text">Total Geral</span>
                <span className="text-2xl font-bold font-mono text-orange-400">
                  R$ {calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>

            {/* Success state */}
            {isSuccess ? (
              paymentMethod === "pix" ? (
                <div className="mt-6 bg-green-500/10 border border-green-500/20 text-green-400 p-6 rounded-2xl text-center space-y-4 animate-fade-in shadow-xl shadow-green-500/5">
                  <ShieldCheck className="w-12 h-12 mx-auto text-green-400 animate-pulse" />
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-[15px] text-white select-text">Código Pix Processado!</h4>
                    <p className="text-xs text-neutral-300 leading-relaxed select-text">
                      Seu pedido de <strong>R$ {calculateTotal().toFixed(2)}</strong> está pré-aprovado. Para receber a continuação do vídeo e seus bônus, clique no botão verde abaixo para nos enviar o comprovante:
                    </p>
                  </div>

                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 active:scale-[0.98] text-neutral-950 py-3.5 px-5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-md shadow-green-500/10 animate-pulse"
                  >
                    <span>🟢 CLIQUE AQUI PARA ENVIAR COMPROVANTE</span>
                  </a>

                  <p className="text-[10px] text-neutral-500 select-text leading-tight bg-black/20 py-2 rounded-lg">
                    Seu WhatsApp abrirá automaticamente com o pedido e as ofertas selecionadas pré-preenchidas. Basta enviar!
                  </p>
                </div>
              ) : (
                <div className="mt-6 bg-green-500/10 border border-green-500/20 text-green-400 p-6 rounded-2xl text-center space-y-4 animate-fade-in shadow-xl shadow-green-500/5">
                  <ShieldCheck className="w-12 h-12 mx-auto text-green-400 animate-pulse" />
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-[15px] text-white select-text">Pedido do Cartão Preparado!</h4>
                    <p className="text-xs text-neutral-300 leading-relaxed select-text">
                      Seu pedido de <strong>R$ {calculateTotal().toFixed(2)}</strong> com todas as ofertas selecionadas foi montado. Clique no botão verde abaixo para enviar seu pedido via WhatsApp e receber seu link de pagamento seguro!
                    </p>
                  </div>

                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      window.dataLayer = window.dataLayer || [];
                      window.dataLayer.push({ 
                        event: 'iniciou_pagamento_cartao_wpp',
                        forma_pagamento: 'cartao_credito'
                      });
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 active:scale-[0.98] text-neutral-950 py-3.5 px-5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-md shadow-green-500/10 animate-pulse"
                  >
                    <span>🟢 ENVIAR PEDIDO NO WHATSAPP</span>
                  </a>

                  <p className="text-[10px] text-neutral-500 select-text leading-tight bg-black/20 py-2 rounded-lg">
                    Seu WhatsApp abrirá automaticamente com a mensagem e ofertas selecionadas pré-preenchidas. Basta enviar!
                  </p>
                </div>
              )
            ) : (
              <div className="mt-6 space-y-4">
                {/* Payment tab buttons */}
                <div className="grid grid-cols-2 gap-2 bg-neutral-950 p-1.5 rounded-xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("pix");
                      window.dataLayer = window.dataLayer || [];
                      window.dataLayer.push({ 
                        event: 'gerou_pix',
                        forma_pagamento: 'pix'
                      });
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                      paymentMethod === "pix"
                        ? "bg-orange-500 text-white shadow-md"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>PIX</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("card");
                      setIsSuccess(true);
                      
                      window.dataLayer = window.dataLayer || [];
                      window.dataLayer.push({ 
                        event: 'iniciou_pagamento_cartao_wpp',
                        forma_pagamento: 'cartao_credito'
                      });

                      const url = getWhatsAppUrl("card");
                      try {
                        window.open(url, "_blank");
                      } catch (err) {
                        console.log("Navigation blocked by browser restrictions. User can click fallback green button.", err);
                      }
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                      paymentMethod === "card"
                        ? "bg-orange-500 text-white shadow-md"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>CARTÃO</span>
                  </button>
                </div>

                {/* Form area */}
                <form onSubmit={handleFinishPayment} className="space-y-3.5">
                  {paymentMethod === "pix" ? (
                    <div className="bg-neutral-950 rounded-2xl border border-white/5 p-4 text-center space-y-3">
                      
                      {/* Dynamic Pix Code Generation Block */}
                      {(() => {
                        const currentAmount = calculateTotal();
                        const generatedCode = generatePixCode({
                          key: pixKey,
                          amount: currentAmount,
                          name: recipientName,
                          city: recipientCity
                        });
                        const currentQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(generatedCode)}`;
                        
                        return (
                          <>
                            <div className="w-40 h-40 bg-white rounded-2xl mx-auto flex items-center justify-center p-3 shadow-lg relative group">
                              <img 
                                src={currentQrUrl} 
                                alt="Pix QR Code"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            
                            <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-white/5 mx-auto">
                              <p className="text-xs font-bold text-white select-text">Valor a pagar: R$ {currentAmount.toFixed(2)}</p>
                              <p className="text-[10px] text-neutral-400 select-text leading-tight">
                                Favorecido: {recipientName || "Não Configurado"} <br/>
                                Chave: {pixKey || "Não Configurada"}
                              </p>
                            </div>

                            {/* Pix Copia e Cola Container */}
                            <div className="space-y-2 text-left">
                              <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500">Código Pix Copia e Cola</label>
                              <div className="flex gap-1.5 items-center bg-neutral-900 border border-white/10 rounded-xl p-1.5 pl-3">
                                <span className="text-[11px] font-mono text-neutral-400 truncate flex-grow leading-none select-all select-text">
                                  {generatedCode}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(generatedCode);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                    
                                    window.dataLayer = window.dataLayer || [];
                                    window.dataLayer.push({ 
                                      event: 'gerou_pix',
                                      forma_pagamento: 'pix'
                                    });
                                  }}
                                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                                    copied 
                                      ? "bg-green-500 text-black" 
                                      : "bg-orange-500 text-white hover:bg-orange-600 active:scale-95"
                                  }`}
                                >
                                  {copied ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>{copied ? "Copiado!" : "Copiar"}</span>
                                </button>
                              </div>
                            </div>
                          </>
                        );
                      })()}

                      <div className="space-y-1">
                        <p className="text-xs font-bold text-white select-text">Escaneie o QR Code ou Copie o Código</p>
                        <p className="text-[11px] text-neutral-400 select-text">O processamento é imediato, seguro e sem taxas no PagBank.</p>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 disabled:bg-neutral-800 text-black py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all active:scale-[0.98]"
                      >
                        {isProcessing ? "Redirecionando para o WhatsApp..." : "Já realizei o Pix!"}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-neutral-950 rounded-2xl border border-white/5 p-5 text-center space-y-4">
                      <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full flex items-center justify-center mx-auto">
                        <CreditCard className="w-5 h-5" />
                      </div>

                      <div className="bg-orange-500/5 border border-white/5 p-5 rounded-xl mx-auto space-y-2 text-center">
                        <span className="text-[15px] sm:text-[16px] font-bold text-white block">Acesso Imediato Liberado</span>
                        <span className="text-[12px] sm:text-[13px] text-white font-bold block leading-relaxed">Clique no botão abaixo escrito FAZER PEDIDO POR CARTÃO para receber o que você deseja adquirir!</span>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 disabled:from-neutral-800 disabled:to-neutral-900 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all active:scale-[0.98]"
                      >
                        {isProcessing ? "Redirecionando para o WhatsApp..." : `Fazer Pedido por Cartão (R$ ${calculateTotal().toFixed(2)})`}
                      </button>
                    </div>
                  )}
                </form>
                          {/* Seller Config Panel Drawer */}
                {isAdminModeEnabled && (
                  <div className="bg-neutral-950/60 border border-white/5 rounded-2xl p-3.5 mt-2 transition-all">
                    <button
                      type="button"
                      onClick={() => setIsAdminOpen(!isAdminOpen)}
                      className="w-full flex items-center justify-between text-left text-neutral-400 hover:text-white transition-colors"
                      id="admin-settings-toggle-btn"
                    >
                      <div className="flex items-center gap-1.5">
                        <Settings className="w-3.5 h-3.5 text-orange-400 animate-spin-slow" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Configurar Minha Chave Pix PagBank</span>
                      </div>
                      <span className="text-[10px] font-semibold text-neutral-500 underline">{isAdminOpen ? "Fechar Painel" : "Abrir Painel"}</span>
                    </button>

                    {isAdminOpen && (
                      <div className="pt-3 mt-3 border-t border-white/5 space-y-3.5 text-xs text-neutral-300">
                        <p className="text-[11px] text-neutral-400 leading-relaxed select-text">
                          Insira os dados da sua conta <strong>PagBank</strong> abaixo. Os dados são salvos localmente e os QR Codes e Copia-e-Cola serão gerados na hora com o valor preciso escolhido pelo seu comprador.
                        </p>
                        
                        <div className="space-y-2.5">
                          <div>
                            <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">Minha Chave Pix (E-mail, Celular, CPF/CNPJ ou Chave Aleatória)</label>
                            <input
                              type="text"
                              value={pixKey}
                              onChange={(e) => {
                                setPixKey(e.target.value);
                                localStorage.setItem("checkout_pix_key", e.target.value);
                              }}
                              placeholder="Ex: seuemail@pagbank.com.br, ou celular"
                              className="w-full bg-neutral-950 border border-white/5 focus:border-orange-500/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500/30"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">Nome Completo do Titular (Seja idêntico ao PagBank, max 25 letras)</label>
                            <input
                              type="text"
                              value={recipientName}
                              onChange={(e) => {
                                // Standard sanitization for holder names directly responsive
                                const raw = e.target.value;
                                const sanitized = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
                                setRecipientName(sanitized);
                                localStorage.setItem("checkout_pix_recipient", sanitized);
                              }}
                              placeholder="Ex: MARCIO DA SILVA"
                              className="w-full bg-neutral-950 border border-white/5 focus:border-orange-500/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500/30"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">Cidade da Conta (Sem acentos, max 15 letras)</label>
                            <input
                              type="text"
                              value={recipientCity}
                              onChange={(e) => {
                                const raw = e.target.value;
                                const sanitized = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
                                setRecipientCity(sanitized);
                                localStorage.setItem("checkout_pix_city", sanitized);
                              }}
                              placeholder="Ex: SAO PAULO"
                              className="w-full bg-neutral-950 border border-white/5 focus:border-orange-500/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500/30"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">Link de Pagamento do Cartão (Opcional - PagBank/Mercado Pago/Stripe)</label>
                            <input
                              type="text"
                              value={cardPaymentLink}
                              onChange={(e) => {
                                const val = e.target.value.trim();
                                setCardPaymentLink(val);
                                localStorage.setItem("checkout_card_link", val);
                              }}
                              placeholder="Ex: https://pag.ae/7Y... ou Mercado Pago link"
                              className="w-full bg-neutral-950 border border-white/5 focus:border-orange-500/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500/30"
                            />
                          </div>
                        </div>

                        <div className="bg-orange-500/5 border border-orange-500/10 p-2.5 rounded-xl text-[11px] text-orange-200/90 leading-relaxed space-y-1">
                          <div className="flex gap-1.5 font-bold text-orange-400 items-center">
                            <Info className="w-3.5 h-3.5" />
                            <span>Instruções extra:</span>
                          </div>
                          <ul className="list-disc pl-3.5 space-y-0.5 text-[10px]">
                            <li><strong>Celular:</strong> Use formato internacional brasileiro: <code className="bg-neutral-900 border border-white/5 px-1 py-0.5 rounded text-orange-200">+55DDD912345678</code></li>
                            <li><strong>CPF / CNPJ:</strong> Prefira digitar apenas números sem traços ou pontos.</li>
                            <li><strong>Chave Aleatória:</strong> Insira de forma completa incluindo os traços.</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Trust Footer */}
                <div 
                  onClick={handleLockClick}
                  className="flex items-center justify-center gap-1.5 text-neutral-500 text-[10px] uppercase font-mono tracking-widest pt-3 border-t border-white/5 cursor-default select-none active:text-neutral-400 transition-colors"
                >
                  <Lock className={`w-3.5 h-3.5 ${lockClickCount > 0 ? "text-orange-500 animate-pulse" : "text-neutral-500"}`} />
                  <span>Sua conexão é protegida por SSL de 256 bits</span>
                </div>
              </div>
            )}

            {/* Additional reviews indicator */}
            <div className="mt-4 flex items-center gap-2.5 justify-center text-xs text-neutral-400 select-text">
              <Users className="w-4 h-4 text-orange-400" />
              <span>Mais de 14.820 pessoas já transformaram suas vidas</span>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
