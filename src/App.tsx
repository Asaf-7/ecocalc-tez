import { useState, useMemo } from 'react';
import { Leaf, DollarSign, Zap, Flame, Target, TreeDeciduous, TrendingUp, BarChart3, Clock, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Modern Renk Paleti ve Katsayılar (Kaynak: IPCC/EPA Standartları Kabulleri)
const COLORS = {
  teal: '#059669',
  emerald: '#10b981',
  amber: '#334155',
  zinc: '#475569',
  background: 'slate-50',
  text: 'slate-900'
};

const CO2_COEFFICIENTS = {
  electric: 0.45,   // kg CO2e / kWh
  gas: 2.01,        // kg CO2e / m3
  fuel: 2.68,       // kg CO2e / Litre
  treeAbsorption: 45 // Bir ağacın yılda emdiği yaklaşık kg CO2 (kabaca)
};

const INITIAL_FORM = {
  electric: 5000,
  electricPrice: 3.5,
  gas: 1000,
  gasPrice: 12.0,
  fuel: 200,
  fuelPrice: 42.0,
  gesCapacity: 15,
  gesCost: 650000,
};

// Modern, Şeffaf Giriş Alanı Bileşeni
const ModernInput = ({ icon: Icon, label, unit, ...props }: any) => (
  <div className="relative group">
    <label className="text-[10px] font-semibold text-slate-600 mb-0.5 block tracking-wide uppercase">
      {label}
    </label>
    <div className="grid w-full grid-cols-[36px_1fr_minmax(64px,auto)] items-center rounded-xl border border-slate-200 bg-white/60 shadow-inner focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
      <span className="flex h-9 w-9 items-center justify-center rounded-l-xl border-r border-slate-200 bg-slate-100/80 text-slate-500 group-focus-within:text-emerald-600 transition-colors">
        <Icon size={16} strokeWidth={1.5} />
      </span>
      <input
        {...props}
        className="h-9 min-w-0 w-full bg-transparent py-1.5 px-2 text-slate-900 text-sm font-medium outline-none"
      />
      <span className="pointer-events-none flex h-9 items-center justify-center select-none whitespace-nowrap px-2 text-[10px] font-bold text-slate-500 text-center">
        {unit}
      </span>
    </div>
  </div>
);

// Modern Dashboard Kart Bileşeni (Glassmorphism + Shadow)
const MetricCard = ({ icon: Icon, title, value, unit, color, helpText }: any) => (
  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-white shadow-xl shadow-slate-100/70 hover:shadow-teal-100/50 transition-shadow group">
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2 rounded-xl bg-${color}-50 text-${color}-600 border border-${color}-100`}>
        <Icon size={20} strokeWidth={2} />
      </div>
      <div>
        <h3 className="text-xs font-semibold text-slate-600">{title}</h3>
        {helpText && <p className="text-[11px] text-slate-400 mt-0.5 truncate">{helpText}</p>}
      </div>
    </div>
    <div className="flex items-baseline gap-1.5">
      <span className="text-3xl font-extrabold tracking-tighter text-slate-950">{value}</span>
      <span className={`text-base font-bold text-${color}-700 bg-${color}-50 px-2 py-0.5 rounded-lg border border-${color}-100`}>
        {unit}
      </span>
    </div>
  </div>
);

function App() {
  const [form, setForm] = useState(INITIAL_FORM);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  // Hesaplama Motoru (useMemo ile Reaktif)
  const results = useMemo(() => {
    // 1. Aylık Emisyonlar (kg CO2e)
    const eCO2 = form.electric * CO2_COEFFICIENTS.electric;
    const gCO2 = form.gas * CO2_COEFFICIENTS.gas;
    const fCO2 = form.fuel * CO2_COEFFICIENTS.fuel;
    
    // Yıllık Toplam Karbon Ayak İzi (Ton)
    const totalCO2_kg = (eCO2 + gCO2 + fCO2) * 12;
    const totalCO2_Ton = totalCO2_kg / 1000;

    // 2. Maliyetler (TL)
    const annualEnergyCost = (
      (form.electric * form.electricPrice) + 
      (form.gas * form.gasPrice) + 
      (form.fuel * form.fuelPrice)
    ) * 12;

    // 3. GES Simülasyonu
    // Türkiyede 1kWp GES yaklaşık yılda 1400 kWh üretir (kabaca)
    const estimatedGesProduction = form.gesCapacity * 1400; 
    const annualGesSaving = estimatedGesProduction * form.electricPrice;

    // 4. Ekolojik Karşılık
    const requiredTrees = totalCO2_kg / CO2_COEFFICIENTS.treeAbsorption;

    // ROI (Yıl)
    const roi = annualGesSaving > 0 ? form.gesCost / annualGesSaving : 0;

    return {
      co2Ton: totalCO2_Ton.toFixed(1),
      co2Distribution: [
        { name: 'Elektrik', value: parseFloat((eCO2 * 12 / 1000).toFixed(1)), fill: COLORS.teal },
        { name: 'Doğalgaz', value: parseFloat((gCO2 * 12 / 1000).toFixed(1)), fill: COLORS.emerald },
        { name: 'Akaryakıt', value: parseFloat((fCO2 * 12 / 1000).toFixed(1)), fill: COLORS.amber },
      ],
      energyCost: (annualEnergyCost / 1000).toFixed(0), // bin TL
      requiredTrees: requiredTrees.toFixed(0),
      roi: roi > 0 && roi < 25 ? roi.toFixed(1) : (roi >= 25 ? '25+' : '∞'),
      savingPercentage: annualEnergyCost > 0 ? ((annualGesSaving / (annualEnergyCost/12*12)) * 100).toFixed(0) : '0'
    };
  }, [form]);

  return (
    <div className={`flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 p-2 md:p-3 font-inter`}>
      {/* Header */}
      <header className="flex items-center pb-3 mb-3 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-3xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/30">
            <Leaf size={32} />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-700 uppercase tracking-widest">Temiz Teknoloji Çözümü</p>
            <h1 className="text-2xl font-extrabold tracking-tighter text-slate-950">EcoCalc</h1>
            <p className="text-slate-500 mt-1 max-w-xl text-xs">KOBİ enerji tüketimini girin; karbon + ROI anlık hesaplansın.</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto grid grid-cols-1 lg:grid-cols-[1fr,2fr] gap-4">
        
        {/* Sol Panel - Veri Girişi */}
        <section className="bg-white/60 backdrop-blur-sm p-4 rounded-[26px] border border-slate-200 shadow-2xl shadow-slate-100/70">
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-200">
            <BarChart3 className="text-emerald-600" size={24}/>
            <h2 className="text-lg font-bold tracking-tight text-slate-950">Aylık Enerji Tüketimi</h2>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <ModernInput icon={Zap} name="electric" type="number" value={form.electric} onChange={handleChange} label="Elektrik" unit="kWh" />
              <ModernInput icon={DollarSign} name="electricPrice" type="number" step="0.1" value={form.electricPrice} onChange={handleChange} label="Birim Fiyat" unit="TL/kWh" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <ModernInput icon={Flame} name="gas" type="number" value={form.gas} onChange={handleChange} label="Doğalgaz" unit="m³" />
              <ModernInput icon={DollarSign} name="gasPrice" type="number" step="0.1" value={form.gasPrice} onChange={handleChange} label="Birim Fiyat" unit="TL/m³" />
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <ModernInput icon={Flame} name="fuel" type="number" value={form.fuel} onChange={handleChange} label="Akaryakıt (Dizel/Benzin)" unit="Litre" />
              <ModernInput icon={DollarSign} name="fuelPrice" type="number" step="0.1" value={form.fuelPrice} onChange={handleChange} label="Birim Fiyat" unit="TL/L" />
            </div>

            <div className="flex items-center gap-3 mt-6 mb-4 pt-4 border-t border-slate-200">
              <Target className="text-emerald-600" size={24}/>
              <h2 className="text-2xl font-bold tracking-tight text-slate-950">Güneş Enerjisi (GES) Simülasyonu</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ModernInput icon={TrendingUp} name="gesCapacity" type="number" value={form.gesCapacity} onChange={handleChange} label="Planlanan GES Kapasitesi" unit="kWp" />
              <ModernInput icon={DollarSign} name="gesCost" type="number" value={form.gesCost} onChange={handleChange} label="Tahmini Kurulum Maliyeti" unit="TL" />
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 mt-6">
                <AlertTriangle className="text-emerald-600" size={24} />
                <p className="text-xs">ROI hesaplaması, yıllık elektrik faturası tasarrufuna dayanır. Maliyetler ve emisyon çarpanları kabullere dayalıdır.</p>
            </div>
          </div>
        </section>

        {/* Sağ Panel - Dashboard */}
        <section className="space-y-4">
          
          {/* Ana Metrikler Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard 
              icon={Leaf} 
              title="Yıllık Karbon Ayak İzi" 
              value={results.co2Ton} 
              unit="Ton CO2e" 
              color="teal" 
              helpText="Kapsam 1 ve Kapsam 2 emisyonları (kabaca)"
            />
            <MetricCard 
              icon={TreeDeciduous} 
              title="Ekolojik Karşılık" 
              value={results.requiredTrees} 
              unit="Adet Ağaç" 
              color="emerald" 
              helpText="Yıllık emisyonu sıfırlamak için gereken ağaç sayısı"
            />
          </div>

          {/* Orta Kısım - Grafik ve ROI */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.5fr,1fr] gap-4">
            
            {/* Grafik Kartı - Pie Chart Yenilendi */}
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-white shadow-xl shadow-slate-100/70">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-slate-900">Emisyon Kaynak Dağılımı</h3>
                <span className="text-xs font-bold text-slate-500">Yıllık Ton CO2</span>
              </div>
              <ResponsiveContainer width="100%" height={205}>
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Pie
                    data={results.co2Distribution}
                    cx="50%"
                    cy="44%"
                    innerRadius={46}
                    outerRadius={70}
                    paddingAngle={8}
                    dataKey="value"
                    cornerRadius={12}
                  >
                    {results.co2Distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{border: 'none', borderRadius: '12px', padding: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} 
                    formatter={(value) => `${value} Ton`}
                  />
                   <text x="50%" y="41%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-extrabold tracking-tighter text-slate-950">
                    {results.co2Ton}
                  </text>
                  <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" className="text-xs font-semibold text-slate-500">
                    Toplam Ton
                  </text>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 grid grid-cols-1 gap-1.5 text-xs text-slate-700 sm:grid-cols-3">
                {results.co2Distribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5 border border-slate-200">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="font-semibold">{item.name}</span>
                    <span className="ml-auto font-bold">{item.value} Ton</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modern ROI Kartı (Daha vurgulu) */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-4 rounded-2xl text-white shadow-xl shadow-emerald-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-white/10 text-white">
                    <Clock size={22} />
                  </div>
                  <h3 className="text-lg font-semibold">GES Yatırım Analizi</h3>
                </div>
                <p className="text-sm text-teal-100 leading-relaxed">
                  Planladığınız {form.gesCapacity} kWp kapasiteli GES yatırımı, mevcut elektrik birim fiyatı üzerinden faturanızda tahminen <span className='font-bold text-white'>%{results.savingPercentage}</span> tasarruf sağlayacaktır.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-xs font-semibold text-teal-100 uppercase tracking-widest">Yatırım Geri Dönüş Süresi (ROI)</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-6xl font-extrabold tracking-tighter text-white">{results.roi}</span>
                  <span className="text-2xl font-bold text-teal-50 text-white/80">Yıl</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enerji Maliyeti Özeti */}
          <div className="bg-white/85 backdrop-blur-sm p-3 rounded-2xl border border-slate-200 shadow-lg shadow-slate-100/60">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-700">
                  Simülasyon Öncesi Tahmini Yıllık Enerji Gideri
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Elektrik, doğalgaz ve akaryakıt maliyetlerinin yıllık toplamı
                </p>
              </div>
              <div className="ml-3 flex items-center gap-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-l-xl bg-emerald-50 text-emerald-700 border border-emerald-100 border-r-0">
                  <DollarSign size={18} strokeWidth={2} />
                </div>
                <div className="flex items-baseline rounded-r-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 leading-none">
                  <span className="text-2xl font-extrabold tracking-tight text-slate-900">{results.energyCost}</span>
                  <span className="ml-1 text-[10px] font-bold text-slate-600">Bin TL / Yıl</span>
                </div>
              </div>
            </div>
          </div>

        </section>
      </main>

      <footer className="hidden">
        Bu uygulama akademik bir tez projesi kapsamında hazırlanmıştır. Hesaplamalar varsayımlara ve kabullere dayalıdır. Ticari kararlar için profesyonel mühendislik analizi gereklidir. <br />
        EcoCalc © 2026 - Kimya Mühendisliği ve Yazılım Harmanı
      </footer>
    </div>
  );
}

export default App;