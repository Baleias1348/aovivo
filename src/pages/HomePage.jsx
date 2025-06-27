import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TourCard from '@/components/shared/TourCard';
import TourCardSkeleton from '@/components/shared/TourCardSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllTours, getSiteConfig } from '@/lib/tourData';
import { supabase } from '@/lib/supabaseClient';
import { 
    Thermometer, Cloud, CloudRain, MountainSnow, Sun, Landmark, Briefcase, AlertTriangle, Replace, 
    SunDim, Banknote, Flag, Globe, Map, HeartPulse, Shuffle, Newspaper
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TickerItem = ({ icon: Icon, text, highlight = false }) => (
    <div className={`flex items-center space-x-3 mx-5 ${highlight ? 'text-yellow-300' : ''}`}>
        {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
        <span className="whitespace-nowrap text-base md:text-lg italic font-arial">{text}</span>
    </div>
);

const NewsTicker = ({ tickerData }) => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentDateTime(new Date()), 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    if (!tickerData || tickerData.length === 0) {
        return (
            <div className="bg-red-600 text-white py-3 overflow-hidden">
                <p className="text-center italic text-sm">Carregando informações do ticker...</p>
            </div>
        );
    }
    
    const formattedDate = format(currentDateTime, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    const formattedTime = format(currentDateTime, "HH:mm");

    const dateAndTimeText = `Informações do dia: ${formattedDate}, Hora de Chile: ${formattedTime} horas`;
    
    const tickerContent = [
        { icon: SunDim, text: dateAndTimeText, id: 'datetime' },
        { icon: Cloud, text: `Santiago: ${tickerData.find(d => d.id === 'weather_santiago')?.content || '--º'}`, id: 'weather_santiago' },
        { icon: Cloud, text: `Viña del Mar: ${tickerData.find(d => d.id === 'weather_vina')?.content || '--º'}`, id: 'weather_vina' },
        { icon: Cloud, text: `Valparaíso: ${tickerData.find(d => d.id === 'weather_valparaiso')?.content || '--º'}`, id: 'weather_valparaiso' },
        { icon: CloudRain, text: `Concepción: ${tickerData.find(d => d.id === 'weather_concepcion')?.content || '--º'}`, id: 'weather_concepcion' },
        { icon: Cloud, text: `Chillán (cidade): ${tickerData.find(d => d.id === 'weather_chillan_city')?.content || '--º'}`, id: 'weather_chillan_city' },
        { icon: Sun, text: `Antofagasta: ${tickerData.find(d => d.id === 'weather_antofagasta')?.content || '--º'}`, id: 'weather_antofagasta' },
        { icon: MountainSnow, text: `Valle Nevado: ${tickerData.find(d => d.id === 'ski_valle_nevado')?.content || '--'}`, id: 'ski_valle_nevado' },
        { icon: MountainSnow, text: `Farellones: ${tickerData.find(d => d.id === 'ski_farellones')?.content || '--'}`, id: 'ski_farellones' },
        { icon: MountainSnow, text: `El Colorado: ${tickerData.find(d => d.id === 'ski_el_colorado')?.content || '--'}`, id: 'ski_el_colorado' },
        { icon: MountainSnow, text: `Portillo: ${tickerData.find(d => d.id === 'ski_portillo')?.content || '--'}`, id: 'ski_portillo' },
        { icon: MountainSnow, text: `La Parva: ${tickerData.find(d => d.id === 'ski_la_parva')?.content || '--'}`, id: 'ski_la_parva' },
        { icon: MountainSnow, text: `Nevados de Chillán: ${tickerData.find(d => d.id === 'ski_nevados_chillan')?.content || '--'}`, id: 'ski_nevados_chillan' },
        { icon: Flag, text: `Real (BRL): ${tickerData.find(d => d.id === 'currency_brl_clp')?.content || '$--'}`, id: 'currency_brl_clp' },
        { icon: Flag, text: `Dólar (USD) em Reais: ${tickerData.find(d => d.id === 'currency_usd_brl')?.content || 'R$--'}`, id: 'currency_usd_brl' },
        { icon: Flag, text: `Dólar (USD) em Pesos: ${tickerData.find(d => d.id === 'currency_usd_clp')?.content || '$--'}`, id: 'currency_usd_clp' },
    ].filter(item => item.text && (item.id === 'datetime' || (tickerData.find(d => d.id === item.id)?.content || '').trim() !== '--'));


    return (
        <div className="bg-red-600 text-white py-3 overflow-hidden h-[50px] flex items-center font-arial">
            <motion.div
                className="flex"
                animate={{ x: ['100%', '-100%'] }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 124, // 20% más lento
                        ease: "linear",
                    },
                }}
            >
                {tickerContent.map((item, index) => (
                    <TickerItem key={index} icon={item.icon} text={item.text} highlight={item.highlight} />
                ))}

            </motion.div>
        </div>
    );
};

export default function HomePage() {
    const heroImage = "https://i.imgur.com/Rct8VB8.png";
    const heroAlt = "Chile ao Vivo";

    const navigate = useNavigate();
    const [featuredTours, setFeaturedTours] = useState([]);
    const [siteConfigData, setSiteConfigData] = useState(getSiteConfig());
    const [isLoadingTours, setIsLoadingTours] = useState(true);
    const [tickerData, setTickerData] = useState([]);

    const fetchSiteConfig = useCallback(() => {
        setSiteConfigData(getSiteConfig());
    }, []);

    useEffect(() => {
        fetchSiteConfig();
        // Cargar datos del ticker
        const fetchTickerData = async () => {
            const { data, error } = await supabase.from('ticker_data').select('*');
            if (error) {
                console.error('Erro ao buscar dados do ticker:', error);
                setTickerData([]);
            } else {
                setTickerData(data);
            }
        };
        // Cargar tours destacados
        const fetchFeaturedTours = async () => {
            setIsLoadingTours(true);
            try {
                const allTours = await getAllTours();
                if (Array.isArray(allTours)) {
                    setFeaturedTours(allTours);
                } else {
                    setFeaturedTours([]);
                }
            } catch (e) {
                setFeaturedTours([]);
            } finally {
                setIsLoadingTours(false);
            }
        };
        fetchTickerData();
        fetchFeaturedTours();
    }, [fetchSiteConfig]);

    return (
        <div className="bg-white min-h-screen w-full">
            {/* HERO BANNER */}
            <div className="relative w-full overflow-hidden aspect-[21/9] max-h-[400px]" style={{height: 'auto'}}>
                <img
                    className="object-cover w-full h-full max-h-[400px] sm:rounded-xl"
                    alt={heroAlt}
                    src={heroImage}
                    style={{width: '100%', height: '100%', maxHeight: 400}}
                />
                <div className="absolute inset-0 bg-black/30 z-0"></div>
            </div>
            {/* TICKER */}
            <NewsTicker tickerData={tickerData} />

            {/* ACCESOS RÁPIDOS */}
            <nav className="w-full h-[70px] flex items-center justify-center gap-4 md:gap-8 bg-[#1238f5]">
                <button onClick={()=>navigate('/clima-no-chile')} className="flex flex-col items-center text-white hover:text-yellow-200 focus:outline-none">
                    <Thermometer className="w-7 h-7"/>
                    <span className="text-xs mt-1">Clima</span>
                </button>
                <button onClick={()=>navigate('/converter-reais-em-pesos-chilenos')} className="flex flex-col items-center text-white hover:text-yellow-200 focus:outline-none">
                    <Banknote className="w-7 h-7"/>
                    <span className="text-xs mt-1">Conversor</span>
                </button>
                <button onClick={()=>navigate('/restaurantes-santiago')} className="flex flex-col items-center text-white hover:text-yellow-200 focus:outline-none">
                    <Landmark className="w-7 h-7"/>
                    <span className="text-xs mt-1">Guia Gastronômico</span>
                </button>
                <button onClick={()=>navigate('/centros-de-esqui')} className="flex flex-col items-center text-white hover:text-yellow-200 focus:outline-none">
                    <MountainSnow className="w-7 h-7"/>
                    <span className="text-xs mt-1">Centros de Esqui</span>
                </button>
                <div className="flex flex-col items-center text-white opacity-60">
                    <Briefcase className="w-7 h-7"/>
                    <span className="text-xs mt-1">Estado do Voo</span>
                </div>
                <div className="flex flex-col items-center text-white opacity-60">
                    <AlertTriangle className="w-7 h-7"/>
                    <span className="text-xs mt-1">Emergência</span>
                </div>
            </nav>

            {/* BOX MODELS (Clima, Cambio, Estado do voo) */}
            <section className="w-full flex flex-col md:flex-row gap-6 px-4 md:px-12 mt-8 mb-12">
                {/* CLIMA AO VIVO */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 flex-1 min-w-[320px] max-w-[600px] p-4 flex flex-col" style={{minHeight: 420}}>
                    <h2 className="text-[#0c37e6] font-bold text-lg md:text-xl mb-4 font-arial">Clima ao vivo</h2>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* Santiago */}
                        <div className="bg-[#0c37e6] rounded-lg flex flex-col items-center justify-center p-3 text-white shadow-md">
                            <Sun className="w-8 h-8 mb-1"/>
                            <span className="font-bold text-base">Santiago</span>
                            <span className="text-2xl font-bold">{tickerData.find(d => d.id === 'weather_santiago')?.content || '--º'}</span>
                            <span className="text-xs">Soleado</span>
                        </div>
                        {/* Viña del Mar */}
                        <div className="bg-[#0c37e6] rounded-lg flex flex-col items-center justify-center p-3 text-white shadow-md">
                            <Cloud className="w-8 h-8 mb-1"/>
                            <span className="font-bold text-base">Viña del Mar</span>
                            <span className="text-2xl font-bold">{tickerData.find(d => d.id === 'weather_vina')?.content || '--º'}</span>
                            <span className="text-xs">Nublado</span>
                        </div>
                        {/* Valparaíso */}
                        <div className="bg-[#0c37e6] rounded-lg flex flex-col items-center justify-center p-3 text-white shadow-md">
                            <CloudRain className="w-8 h-8 mb-1"/>
                            <span className="font-bold text-base">Valparaíso</span>
                            <span className="text-2xl font-bold">{tickerData.find(d => d.id === 'weather_valparaiso')?.content || '--º'}</span>
                            <span className="text-xs">Chuva</span>
                        </div>
                        {/* Concepción */}
                        <div className="bg-[#0c37e6] rounded-lg flex flex-col items-center justify-center p-3 text-white shadow-md">
                            <Cloud className="w-8 h-8 mb-1"/>
                            <span className="font-bold text-base">Concepción</span>
                            <span className="text-2xl font-bold">{tickerData.find(d => d.id === 'weather_concepcion')?.content || '--º'}</span>
                            <span className="text-xs">Nublado</span>
                        </div>
                    </div>
                    <button className="w-full mt-2 py-2 rounded-lg bg-[#0c37e6] text-white font-bold hover:bg-[#0c37e6]/90 transition" onClick={()=>navigate('/clima-no-chile')}>
                        Veja a previsão para os próximos 5 dias
                    </button>
                </div>
                {/* TAXAS DE CÂMBIO HOJE */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col min-w-[220px] max-w-[300px] p-4" style={{height: 420}}>
                    <h2 className="text-[#0c37e6] font-bold text-lg md:text-xl mb-4 font-arial">Taxas de câmbio hoje</h2>
                    {/* CLP → BRL */}
                    <div className="bg-[#05882f] text-white rounded-lg flex flex-col items-center justify-center p-3 mb-3 shadow-md">
                        <span className="font-bold text-base flex items-center gap-2"><img src="https://flagcdn.com/br.svg" alt="BR" className="w-5 h-5 inline"/> 1 BRL = {tickerData.find(d => d.id === 'currency_brl_clp')?.content || '--'} CLP</span>
                        <a href="/converter-reais-em-pesos-chilenos" className="underline text-xs mt-1">Vá para o conversor de moedas</a>
                    </div>
                    {/* BRL → CLP */}
                    <div className="bg-[#05882f] text-white rounded-lg flex flex-col items-center justify-center p-3 mb-3 shadow-md">
                        <span className="font-bold text-base flex items-center gap-2"><img src="https://flagcdn.com/cl.svg" alt="CL" className="w-5 h-5 inline"/> 1 CLP = {tickerData.find(d => d.id === 'currency_clp_brl')?.content || '--'} BRL</span>
                        <a href="/converter-reais-em-pesos-chilenos" className="underline text-xs mt-1">Vá para o conversor de moedas</a>
                    </div>
                    {/* Casas de Câmbio */}
                    <div className="bg-[#05882f] text-white rounded-lg flex flex-col items-center justify-center p-4 mb-3 shadow-md cursor-pointer hover:bg-[#047a28] transition" onClick={()=>alert('Em breve!')}>
                        <span className="font-bold text-base">Casas de Câmbio</span>
                        <span className="text-xs mt-1">Classificação com avaliações reais</span>
                    </div>
                </div>
                {/* ESTADO DO VOO */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col min-w-[220px] max-w-[300px] p-4" style={{height: 420}}>
                    <h2 className="text-[#0c37e6] font-bold text-lg md:text-xl mb-4 font-arial">Estado do voo</h2>
                    {/* LATAM */}
                    <div className="bg-[#0c37e6] text-white rounded-lg flex flex-col items-center justify-center p-3 mb-3 shadow-md">
                        <span className="font-bold text-base">Voos da Latam Airlines</span>
                        <div className="flex gap-2 mt-2">
                            <button className="bg-white text-[#0c37e6] font-bold px-2 py-1 rounded shadow hover:bg-gray-100 text-xs" onClick={()=>alert('Em breve!')}>voos do Brasil para o Chile</button>
                            <button className="bg-white text-[#0c37e6] font-bold px-2 py-1 rounded shadow hover:bg-gray-100 text-xs" onClick={()=>alert('Em breve!')}>voos do Chile para o Brasil</button>
                        </div>
                    </div>
                    {/* SKY */}
                    <div className="bg-[#0c37e6] text-white rounded-lg flex flex-col items-center justify-center p-3 mb-3 shadow-md">
                        <span className="font-bold text-base">Voos da Sky Airlines</span>
                        <div className="flex gap-2 mt-2">
                            <button className="bg-white text-[#0c37e6] font-bold px-2 py-1 rounded shadow hover:bg-gray-100 text-xs" onClick={()=>alert('Em breve!')}>voos do Brasil para o Chile</button>
                            <button className="bg-white text-[#0c37e6] font-bold px-2 py-1 rounded shadow hover:bg-gray-100 text-xs" onClick={()=>alert('Em breve!')}>voos do Chile para o Brasil</button>
                        </div>
                    </div>
                    {/* Jetsmart */}
                    <div className="bg-[#0c37e6] text-white rounded-lg flex flex-col items-center justify-center p-3 mb-3 shadow-md">
                        <span className="font-bold text-base">Voos da Jetsmart</span>
                        <div className="flex gap-2 mt-2">
                            <button className="bg-white text-[#0c37e6] font-bold px-2 py-1 rounded shadow hover:bg-gray-100 text-xs" onClick={()=>alert('Em breve!')}>voos do Brasil para o Chile</button>
                            <button className="bg-white text-[#0c37e6] font-bold px-2 py-1 rounded shadow hover:bg-gray-100 text-xs" onClick={()=>alert('Em breve!')}>voos do Chile para o Brasil</button>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
