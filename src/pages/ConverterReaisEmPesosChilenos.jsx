import React, { useEffect, useState } from "react";

const API_URL = "https://economia.awesomeapi.com.br/last";

const FLAGS = {
  BRL: "🇧🇷",
  CLP: "🇨🇱",
  USD: "🇺🇸",
};

const currencyOptions = [
  { code: "BRL", label: "BRL - Real Brasileiro", flag: FLAGS.BRL },
  { code: "CLP", label: "CLP - Peso Chileno", flag: FLAGS.CLP },
  { code: "USD", label: "USD - Dólar Americano", flag: FLAGS.USD },
];

function formatMoney(val, code) {
  if (code === "BRL") return `R$ ${Number(val).toLocaleString("pt-BR", {minimumFractionDigits:2})}`;
  if (code === "CLP") return `$ ${Number(val).toLocaleString("es-CL", {minimumFractionDigits:0})}`;
  if (code === "USD") return `US$ ${Number(val).toLocaleString("en-US", {minimumFractionDigits:2})}`;
  return `${val} ${code}`;
}

export default function ConverterReaisEmPesosChilenos() {
  const [rates, setRates] = useState(null);
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("BRL");
  const [to, setTo] = useState("CLP");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cotizaciones principales
  useEffect(() => {
    async function fetchRates() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_URL}/BRL-CLP,CLP-BRL,USD-BRL,USD-CLP`);
        if (!res.ok) throw new Error("Erro ao buscar taxas");
        const data = await res.json();
        setRates(data);
      } catch (e) {
        setError("Erro ao buscar taxas de câmbio.");
      } finally {
        setLoading(false);
      }
    }
    fetchRates();
  }, []);

  // Conversión custom
  const handleConvert = async (e) => {
    e.preventDefault();
    setResult(null);
    setError("");
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Digite um valor válido.");
      return;
    }
    if (from === to) {
      setResult(formatMoney(amount, from));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${from}-${to}`);
      if (!res.ok) throw new Error("Erro ao buscar conversão.");
      const data = await res.json();
      const key = `${from}${to}`;
      const rate = data[key]?.bid;
      if (!rate) throw new Error("Conversão não disponível.");
      const converted = Number(amount) * Number(rate);
      setResult(`${formatMoney(amount, from)} = ${formatMoney(converted, to)}`);
    } catch (e) {
      setError("Erro ao converter moeda.");
    } finally {
      setLoading(false);
    }
  };

  // Swap monedas
  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setResult(null);
  };

  return (
    <div style={{background:'#f4f8fb', minHeight:'100vh', padding:'32px 0'}}>
      <h1 style={{textAlign:'center', fontWeight:700, fontSize:'2rem', color:'#374151', marginBottom:32}}>
        Câmbio de Moeda: Real para Peso Chileno
      </h1>
      <div style={{display:'flex', justifyContent:'center', gap:24, flexWrap:'wrap', marginBottom:32}}>
        <div style={{background:'#fff', borderRadius:16, boxShadow:'0 2px 12px #0001', padding:24, minWidth:260, textAlign:'center', fontWeight:500}}>
          <div style={{marginBottom:8}}>Real para Peso Chileno</div>
          <div style={{fontSize:'1.4rem', fontWeight:700}}>
            <span role="img" aria-label="Brasil">{FLAGS.BRL}</span> R$ 1,00 = $ {rates?.BRLCLP?.bid ? Number(rates.BRLCLP.bid).toLocaleString('es-CL', {minimumFractionDigits:2}) : '--'} <span role="img" aria-label="Chile">{FLAGS.CLP}</span>
          </div>
        </div>
        <div style={{background:'#fff', borderRadius:16, boxShadow:'0 2px 12px #0001', padding:24, minWidth:260, textAlign:'center', fontWeight:500}}>
          <div style={{marginBottom:8}}>Peso Chileno para Real</div>
          <div style={{fontSize:'1.4rem', fontWeight:700}}>
            <span role="img" aria-label="Chile">{FLAGS.CLP}</span> $ 1.000 = R$ {rates?.CLPBRL?.bid ? (Number(rates.CLPBRL.bid)*1000).toLocaleString('pt-BR', {minimumFractionDigits:2}) : '--'} <span role="img" aria-label="Brasil">{FLAGS.BRL}</span>
          </div>
        </div>
      </div>
      {/* Card principal */}
      <div style={{maxWidth:540, margin:'0 auto', background:'#fff', borderRadius:20, boxShadow:'0 2px 16px #0002', padding:32, marginBottom:32}}>
        <h2 style={{textAlign:'center', fontWeight:600, fontSize:'1.2rem', color:'#374151', marginBottom:24}}>Conversor de Moedas</h2>
        <form onSubmit={handleConvert}>
          <div style={{marginBottom:16}}>
            <label style={{fontWeight:500, marginBottom:4, display:'block'}}>Valor a converter</label>
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={e=>setAmount(e.target.value)}
              style={{width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid #b0bec5', fontSize:'1.1rem'}}
            />
          </div>
          <div style={{display:'flex', gap:12, marginBottom:16}}>
            <div style={{flex:1}}>
              <label style={{fontWeight:500, marginBottom:4, display:'block'}}>De</label>
              <select value={from} onChange={e=>setFrom(e.target.value)} style={{width:'100%', padding:'8px', borderRadius:8, border:'1px solid #b0bec5'}}>
                {currencyOptions.map(opt => (
                  <option key={opt.code} value={opt.code}>{opt.flag} {opt.label}</option>
                ))}
              </select>
            </div>
            <button type="button" aria-label="Trocar moedas" onClick={handleSwap} style={{alignSelf:'end', background:'#f4f8fb', border:'none', borderRadius:'50%', width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', cursor:'pointer'}}>
              ↔️
            </button>
            <div style={{flex:1}}>
              <label style={{fontWeight:500, marginBottom:4, display:'block'}}>Para</label>
              <select value={to} onChange={e=>setTo(e.target.value)} style={{width:'100%', padding:'8px', borderRadius:8, border:'1px solid #b0bec5'}}>
                {currencyOptions.map(opt => (
                  <option key={opt.code} value={opt.code}>{opt.flag} {opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" style={{width:'100%', background:'#e9eef6', color:'#374151', fontWeight:700, fontSize:'1.2rem', border:'none', borderRadius:8, padding:'12px 0', marginBottom:8, cursor:'pointer'}} disabled={loading}>
            {loading ? 'Convertendo...' : 'Converter'}
          </button>
        </form>
        {error && <div style={{color:'#d32f2f', textAlign:'center', marginTop:8}}>{error}</div>}
        {result && <div style={{background:'#e9eef6', borderRadius:8, padding:'16px 0', textAlign:'center', fontWeight:700, fontSize:'1.25rem', color:'#374151', marginTop:12}}>{result}</div>}
      </div>
      {/* Cards inferiores */}
      <div style={{display:'flex', justifyContent:'center', gap:24, flexWrap:'wrap', marginBottom:32}}>
        <div style={{background:'#fff', borderRadius:16, boxShadow:'0 2px 12px #0001', padding:24, minWidth:260, textAlign:'center', fontWeight:500}}>
          <div style={{marginBottom:8}}>Dólar no Brasil (USD)</div>
          <div style={{fontSize:'1.4rem', fontWeight:700}}>
            <span role="img" aria-label="EUA">{FLAGS.USD}</span> US$ 1,00 = R$ {rates?.USDBRL?.bid ? Number(rates.USDBRL.bid).toLocaleString('pt-BR', {minimumFractionDigits:2}) : '--'}
          </div>
        </div>
        <div style={{background:'#fff', borderRadius:16, boxShadow:'0 2px 12px #0001', padding:24, minWidth:260, textAlign:'center', fontWeight:500}}>
          <div style={{marginBottom:8}}>Dólar no Chile (USD)</div>
          <div style={{fontSize:'1.4rem', fontWeight:700}}>
            <span role="img" aria-label="EUA">{FLAGS.USD}</span> US$ 1,00 = $ {rates?.USDCLP?.bid ? Number(rates.USDCLP.bid).toLocaleString('es-CL', {minimumFractionDigits:0}) : '--'}
          </div>
        </div>
      </div>
    </div>
  );
}
          />
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full">
              <label className="block text-sm text-gray-600 mb-1" htmlFor="fromCurrency">De:</label>
              <select
                id="fromCurrency"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base bg-white"
                value={from}
                onChange={e => setFrom(e.target.value)}
              >
                {SUPPORTED_CURRENCIES.map(cur => (
                  <option key={cur} value={cur}>{CURRENCY_LABELS[cur] || cur}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-center my-2 sm:my-0">
              <ArrowLeftRight className="text-blue-400 w-7 h-7" />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm text-gray-600 mb-1" htmlFor="toCurrency">A:</label>
              <select
                id="toCurrency"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base bg-white"
                value={to}
                onChange={e => setTo(e.target.value)}
              >
                {SUPPORTED_CURRENCIES.map(cur => (
                  <option key={cur} value={cur}>{CURRENCY_LABELS[cur] || cur}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-lg shadow transition"
            disabled={loading}
          >
            Converter
          </button>
        </form>
        <div className="min-h-[40px] flex items-center justify-center mt-2">
          {loading ? (
            <div className="flex items-center gap-2 text-blue-600"><Spinner className="animate-spin" /> Consultando taxa de câmbio…</div>
          ) : error ? (
            <div className="text-red-600 text-center text-lg">{error}</div>
          ) : result ? (
            <div className="text-xl text-center font-semibold text-green-700">{result}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
