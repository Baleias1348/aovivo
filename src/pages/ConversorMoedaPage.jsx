import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { ArrowLeftRight, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Monedas soportadas por Freecurrencyapi
const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'Dólar Americano', flag: '🇺🇸' },
  { code: 'BRL', name: 'Real Brasileiro', flag: '🇧🇷' },
  { code: 'CLP', name: 'Peso Chileno', flag: '🇨🇱' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'ARS', name: 'Peso Argentino', flag: '🇦🇷' },
  { code: 'GBP', name: 'Libra Esterlina', flag: '🇬🇧' },
  { code: 'JPY', name: 'Yen Japonés', flag: '🇯🇵' },
  { code: 'CAD', name: 'Dólar Canadense', flag: '🇨🇦' },
  { code: 'AUD', name: 'Dólar Australiano', flag: '🇦🇺' },
  { code: 'CHF', name: 'Franco Suíço', flag: '🇨🇭' },
  { code: 'CNY', name: 'Yuan Chinês', flag: '🇨🇳' },
  { code: 'MXN', name: 'Peso Mexicano', flag: '🇲🇽' },
  { code: 'PEN', name: 'Sol Peruano', flag: '🇵🇪' },
  { code: 'UYU', name: 'Peso Uruguaio', flag: '🇺🇾' },
  { code: 'COP', name: 'Peso Colombiano', flag: '🇨🇴' }
];

const ConversorMoedaPage = () => {
  const { toast } = useToast ? useToast() : { toast: () => {} };
  
  // Estados do formulário
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('BRL');
  const [toCurrency, setToCurrency] = useState('CLP');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados para as paridades de câmbio
  const [brlToClpRate, setBrlToClpRate] = useState(null);
  const [clpToBrlRate, setClpToBrlRate] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(true);

  // Função para obter a taxa de câmbio da API
  const getExchangeRate = async (from, to) => {
    const apiUrl = import.meta.env.VITE_EXCHANGE_API_URL || 'https://v6.exchangerate-api.com/v6';
    const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;

    if (!apiKey) {
      throw new Error('Chave da API não configurada. Configure VITE_EXCHANGE_API_KEY no arquivo .env');
    }

    // Documentación: https://www.exchangerate-api.com/docs/overview
    // Endpoint: /v6/YOUR-API-KEY/pair/{base}/{target}
    const url = `${apiUrl}/${apiKey}/pair/${from}/${to}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (!data.conversion_rate) {
      throw new Error('Dados de taxa de câmbio não encontrados na resposta da API');
    }

    return data.conversion_rate;
  };

  // Função para carregar as paridades de câmbio
  const loadExchangeRates = async () => {
    setRatesLoading(true);
    try {
      const [brlToClp, clpToBrl] = await Promise.all([
        getExchangeRate('BRL', 'CLP'),
        getExchangeRate('CLP', 'BRL')
      ]);
      
      setBrlToClpRate(brlToClp);
      setClpToBrlRate(clpToBrl);
    } catch (error) {
      console.error('Erro ao carregar taxas de câmbio:', error);
    } finally {
      setRatesLoading(false);
    }
  };

  // Carregar as paridades ao montar o componente
  useEffect(() => {
    loadExchangeRates();
  }, []);

  // Função para realizar a conversão
  const handleConvert = async (e) => {
    e.preventDefault();
    
    // Validações
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Por favor, insira um valor válido maior que zero');
      setResult(null);
      return;
    }

    if (fromCurrency === toCurrency) {
      setError('Por favor, selecione moedas diferentes para conversão');
      setResult(null);
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const rate = await getExchangeRate(fromCurrency, toCurrency);
      const convertedAmount = parseFloat(amount) * rate;
      
      setResult({
        originalAmount: parseFloat(amount),
        convertedAmount: convertedAmount,
        fromCurrency,
        toCurrency,
        rate
      });

      toast({
        title: "Conversão realizada com sucesso!",
        description: `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`,
        duration: 3000,
      });

    } catch (err) {
      console.error('Erro na conversão:', err);
      setError(err.message || 'Erro ao consultar taxa de câmbio. Tente novamente.');
      
      toast({
        variant: "destructive",
        title: "Erro na conversão",
        description: "Não foi possível obter a taxa de câmbio. Verifique sua conexão e tente novamente.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para trocar as moedas
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
    setError('');
  };

  // Obter informações da moeda
  const getCurrencyInfo = (code) => {
    return SUPPORTED_CURRENCIES.find(curr => curr.code === code) || { code, name: code, flag: '💱' };
  };

  return (
    <>
      <Helmet>
        <title>Conversor de Moeda - Chile ao Vivo</title>
        <meta name="description" content="Converta moedas em tempo real com as melhores taxas de câmbio. Suporte para Real, Peso Chileno, Dólar e muito mais." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] p-4">
          
          {/* Cuadros de paridad de cambio */}
          <div className="w-full max-w-md mb-6">
            <div className="grid grid-cols-2 gap-4">
              
              {/* BRL a CLP */}
              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">Real → Peso Chileno</span>
                  <span className="text-2xl">🇧🇷→🇨🇱</span>
                </div>
                <div className="text-center text-xl font-mono">
                  {ratesLoading ? '...' : brlToClpRate}
                </div>
                <div className="text-xs text-gray-500 text-center">1 BRL = {ratesLoading ? '...' : brlToClpRate} CLP</div>
              </div>
              {/* CLP a BRL */}
              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">Peso Chileno → Real</span>
                  <span className="text-2xl">🇨🇱→🇧🇷</span>
                </div>
                <div className="text-center text-xl font-mono">
                  {ratesLoading ? '...' : clpToBrlRate}
                </div>
                <div className="text-xs text-gray-500 text-center">1 CLP = {ratesLoading ? '...' : clpToBrlRate} BRL</div>
              </div>
            </div>
          </div>

          {/* Formulário de conversão */}
          <form onSubmit={handleConvert} className="bg-white rounded-lg shadow-md p-6 w-full max-w-md flex flex-col gap-4 border border-gray-200">
            <div className="flex flex-col gap-2">
              <label htmlFor="amount" className="font-semibold">Valor</label>
              <input
                id="amount"
                type="number"
                min="0"
                step="any"
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Digite o valor"
                required
              />
            </div>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="font-semibold">De</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={fromCurrency}
                  onChange={e => setFromCurrency(e.target.value)}
                >
                  {SUPPORTED_CURRENCIES.map(curr => (
                    <option key={curr.code} value={curr.code}>{curr.flag} {curr.name} ({curr.code})</option>
                  ))}
                </select>
              </div>
              <Button type="button" variant="outline" onClick={swapCurrencies} className="mx-2">
                <ArrowLeftRight className="w-5 h-5" />
              </Button>
              <div className="flex-1">
                <label className="font-semibold">Para</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={toCurrency}
                  onChange={e => setToCurrency(e.target.value)}
                >
                  {SUPPORTED_CURRENCIES.map(curr => (
                    <option key={curr.code} value={curr.code}>{curr.flag} {curr.name} ({curr.code})</option>
                  ))}
                </select>
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="mt-2">
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
              Converter
            </Button>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          </form>
          {/* Resultado da conversão */}
          {result && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 w-full max-w-md text-center">
              <div className="text-xl font-semibold mb-1">{result.originalAmount} {getCurrencyInfo(result.fromCurrency).flag} {result.fromCurrency} = {result.convertedAmount.toFixed(2)} {getCurrencyInfo(result.toCurrency).flag} {result.toCurrency}</div>
              <div className="text-xs text-gray-500">Taxa usada: 1 {result.fromCurrency} = {result.rate} {result.toCurrency}</div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ConversorMoedaPage;
