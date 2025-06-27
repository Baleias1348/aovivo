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
  const { toast } = useToast();
  
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
                  <span className="flex items-center space-x-2">
                    <span className="text-2xl">🇧🇷</span>
                    <span className="font-semibold text-sm">BRL</span>
                  </span>
                  <ArrowLeftRight size={16} className="text-gray-400" />
                  <span className="flex items-center space-x-2">
                    <span className="font-semibold text-sm">CLP</span>
                    <span className="text-2xl">🇨🇱</span>
                  </span>
                </div>
                <div className="text-center">
                  {ratesLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <div className="text-lg font-bold text-gray-800">
                      1 = {brlToClpRate ? brlToClpRate.toFixed(2) : 'N/A'}
                    </div>
                  )}
                </div>
              </div>

              {/* CLP a BRL */}
              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center space-x-2">
                    <span className="text-2xl">🇨🇱</span>
                    <span className="font-semibold text-sm">CLP</span>
                  </span>
                  <ArrowLeftRight size={16} className="text-gray-400" />
                  <span className="flex items-center space-x-2">
                    <span className="font-semibold text-sm">BRL</span>
                    <span className="text-2xl">🇧🇷</span>
                  </span>
                </div>
                <div className="text-center">
                  {ratesLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <div className="text-lg font-bold text-gray-800">
                      1000 = {clpToBrlRate ? (clpToBrlRate * 1000).toFixed(2) : 'N/A'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Conversor principal */}
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            
            {/* Título */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Conversor de Moeda</h1>
              <p className="text-gray-600">Taxas de câmbio em tempo real</p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleConvert} className="space-y-6">
              
              {/* Input de quantidade */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade
                </label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Digite o valor"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium"
                  disabled={isLoading}
                />
              </div>

              {/* Seletores de moeda */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Moeda de origem */}
                <div>
                  <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-700 mb-2">
                    De:
                  </label>
                  <select
                    id="fromCurrency"
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={isLoading}
                  >
                    {SUPPORTED_CURRENCIES.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Moeda de destino */}
                <div>
                  <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700 mb-2">
                    Para:
                  </label>
                  <select
                    id="toCurrency"
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={isLoading}
                  >
                    {SUPPORTED_CURRENCIES.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Botão de trocar moedas */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={swapCurrencies}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                  disabled={isLoading}
                  title="Trocar moedas"
                >
                  <ArrowLeftRight size={24} />
                </button>
              </div>

              {/* Botão de conversão */}
              <Button
                type="submit"
                disabled={isLoading || !amount}
                className="w-full py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Consultando taxa de câmbio...
                  </>
                ) : (
                  'Converter'
                )}
              </Button>
            </form>

            {/* Resultado */}
            {result && (
              <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-800 mb-2">
                    {result.originalAmount.toLocaleString('pt-BR', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })} {getCurrencyInfo(result.fromCurrency).flag} {result.fromCurrency}
                  </div>
                  <div className="text-lg text-green-600 mb-2">=</div>
                  <div className="text-3xl font-bold text-green-800 mb-3">
                    {result.convertedAmount.toLocaleString('pt-BR', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })} {getCurrencyInfo(result.toCurrency).flag} {result.toCurrency}
                  </div>
                  <div className="text-sm text-green-600">
                    Taxa: 1 {result.fromCurrency} = {result.rate.toFixed(4)} {result.toCurrency}
                  </div>
                </div>
              </div>
            )}

            {/* Erro */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-center font-medium">{error}</p>
              </div>
            )}

            {/* Indicador de carregamento */}
            {isLoading && (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center text-blue-600">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Consultando taxa de câmbio...</span>
                </div>
              </div>
            )}

            {/* Informação adicional */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Taxas atualizadas em tempo real</p>
              <p className="mt-1">Powered by FreeCurrencyAPI</p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ConversorMoedaPage;