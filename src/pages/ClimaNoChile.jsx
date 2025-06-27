import React, { useEffect, useState } from "react";

const MAIN_CITIES = [
  { label: "Santiago", value: "Santiago" },
  { label: "Valparaíso", value: "Valparaiso" },
  { label: "Viña del Mar", value: "Vina del Mar" },
  { label: "Concepción", value: "Concepcion" },
  { label: "La Serena", value: "La Serena" },
];

const REGIONAL_CAPITALS = [
  { label: "Antofagasta", value: "Antofagasta" },
  { label: "Arica", value: "Arica" },
  { label: "Chillán", value: "Chillan" },
  { label: "Copiapó", value: "Copiapo" },
  { label: "Coyhaique", value: "Coyhaique" },
  { label: "Iquique", value: "Iquique" },
  { label: "Puerto Montt", value: "Puerto Montt" },
  { label: "Punta Arenas", value: "Punta Arenas" },
  { label: "Rancagua", value: "Rancagua" },
  { label: "Talca", value: "Talca" },
  { label: "Temuco", value: "Temuco" },
  { label: "Valdivia", value: "Valdivia" },
];

const WEEKDAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function formatDate(date) {
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getWeekdayShort(dateStr) {
  const date = new Date(dateStr);
  return WEEKDAYS_PT[date.getDay()];
}

const API_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export default function ClimaNoChile() {
  const [city, setCity] = useState("Santiago");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWeather(city);
    // eslint-disable-next-line
  }, [city]);

  async function fetchWeather(cityName) {
    setLoading(true);
    setError("");
    try {
      // Clima atual
      const resp = await fetch(
        `${API_URL}/weather?q=${encodeURIComponent(cityName)},cl&units=metric&lang=pt_br&appid=${API_KEY}`
      );
      if (!resp.ok) throw new Error("Erro ao buscar o clima atual.");
      const data = await resp.json();
      setWeather(data);

      // Forecast 5 dias
      const resp2 = await fetch(
        `${API_URL}/forecast?q=${encodeURIComponent(cityName)},cl&units=metric&lang=pt_br&appid=${API_KEY}`
      );
      if (!resp2.ok) throw new Error("Erro ao buscar o prognóstico.");
      const data2 = await resp2.json();
      // Processar forecast: agrupar por dia, pegar min/max de cada dia
      const days = {};
      data2.list.forEach((item) => {
        const day = item.dt_txt.split(" ")[0];
        if (!days[day]) days[day] = [];
        days[day].push(item);
      });
      const today = new Date().toISOString().split("T")[0];
      const nextDays = Object.keys(days)
        .filter((d) => d !== today)
        .slice(0, 5)
        .map((day) => {
          const arr = days[day];
          const min = Math.min(...arr.map((i) => i.main.temp_min));
          const max = Math.max(...arr.map((i) => i.main.temp_max));
          // Pega o ícone mais frequente do dia
          const icons = arr.map((i) => i.weather[0].icon);
          const icon = icons.sort((a,b) => icons.filter(v => v===a).length - icons.filter(v => v===b).length).pop();
          return {
            date: day,
            min: Math.round(min),
            max: Math.round(max),
            icon,
            desc: arr[0].weather[0].description,
          };
        });
      setForecast(nextDays);
    } catch (err) {
      setError(err.message || "Erro desconhecido.");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{marginTop:32, marginBottom:32}}>
      <h2 style={{textAlign:'center', color:'#0d47a1', fontWeight:700, fontSize:'1.5rem', marginBottom:24}}>
        Previsão do Tempo no Chile: Clima Atual e Próximos 5 Dias
      </h2>
      <form style={{maxWidth:480, margin:'0 auto 18px auto'}}>
        <label htmlFor="cidade" style={{fontWeight:500, marginBottom:6, display:'block', color:'#333'}}>Selecione uma cidade chilena:</label>
        <select id="cidade" value={city} onChange={e => setCity(e.target.value)} style={{width:'100%', padding:8, borderRadius:8, border:'1px solid #b0bec5', fontSize:'1rem', marginBottom:10}}>
          {MAIN_CITIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          <option disabled>--- Capitais Regionais ---</option>
          {REGIONAL_CAPITALS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </form>
      <div style={{maxWidth:480, margin:'0 auto'}}>
        {loading ? (
          <div style={{textAlign:'center', color:'#1976d2', margin:'32px 0'}}>Carregando...</div>
        ) : error ? (
          <div style={{textAlign:'center', color:'#d32f2f', margin:'32px 0'}}>{error}</div>
        ) : weather && (
          <div style={{background:'#f5faff', borderRadius:16, boxShadow:'0 4px 16px rgba(13, 71, 161, 0.10)', padding:'24px 18px 18px 18px', marginBottom:16, textAlign:'center'}}>
            <h1 style={{fontSize:'1.3rem', margin:0, color:'#0d47a1'}}>{weather.name}, Chile</h1>
            <div className="date" style={{color:'#607d8b', fontSize:'0.99rem', marginBottom:10}}>
              {formatDate(new Date())}
            </div>
            <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:18, marginBottom:12}}>
              <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} width="64" height="64" alt={`Ícone ${weather.weather[0].description}`} title={weather.weather[0].description} style={{display:'block'}}/>
              <span style={{fontSize:'2.7rem', fontWeight:700, color:'#0d47a1'}}>{Math.round(weather.main.temp)}°C</span>
            </div>
            <div style={{fontSize:'1.1rem', color:'#1976d2', marginBottom:14, fontWeight:500}}>{weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1)}</div>
            <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:8, marginBottom:10}}>
              <div style={{flex:'1 1 45%', background:'#e3f2fd', borderRadius:8, padding:'8px 0', fontSize:'0.99rem', color:'#1565c0', margin:2}}>
                Sensação: {Math.round(weather.main.feels_like)}°C
              </div>
              <div style={{flex:'1 1 45%', background:'#e3f2fd', borderRadius:8, padding:'8px 0', fontSize:'0.99rem', color:'#1565c0', margin:2}}>
                Umidade: {weather.main.humidity}%
              </div>
              <div style={{flex:'1 1 45%', background:'#e3f2fd', borderRadius:8, padding:'8px 0', fontSize:'0.99rem', color:'#1565c0', margin:2}}>
                Vento: {Math.round(weather.wind.speed * 3.6)} km/h
              </div>
              <div style={{flex:'1 1 45%', background:'#e3f2fd', borderRadius:8, padding:'8px 0', fontSize:'0.99rem', color:'#1565c0', margin:2}}>
                Índice UV: {weather.uvi ? `${weather.uvi} - ${getUvLabel(weather.uvi)}` : "-"}
              </div>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', marginTop:18, gap:6}}>
              {forecast.map(day => (
                <div key={day.date} style={{background:'#e1f5fe', borderRadius:10, padding:'8px 4px 6px 4px', width:'18%', textAlign:'center', fontSize:'0.97rem', color:'#1976d2', boxShadow:'0 2px 8px rgba(33,150,243,0.07)'}}>
                  <div>{getWeekdayShort(day.date)}</div>
                  <img src={`https://openweathermap.org/img/wn/${day.icon}.png`} width="32" height="32" alt={`Ícone ${day.desc}`} title={day.desc} style={{display:'block', margin:'0 auto'}}/>
                  <div style={{fontSize:'0.97rem', fontWeight:500, color:'#0d47a1'}}>{day.max}°/{day.min}°</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function getUvLabel(uvi) {
  if (uvi < 3) return "Baixo";
  if (uvi < 6) return "Moderado";
  if (uvi < 8) return "Alto";
  if (uvi < 11) return "Muito Alto";
  return "Extremo";
}
