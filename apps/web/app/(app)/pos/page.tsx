'use client';
import React, { useState, useMemo } from 'react';
import {
  Search,
  Barcode,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Printer,
  CreditCard,
  Banknote,
  FileCheck,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Sliders,
  DollarSign,
  Layers,
  X,
  Sparkles,
} from 'lucide-react';
import { formatMad, CASH_PAYMENT_CEILING_MAD } from '../../lib/morocco';

interface POSItem {
  id: string;
  name: string;
  sku: string;
  priceHt: number;
  taxRate: number;
  stock: number;
  category: string;
}

const INITIAL_CATALOG: POSItem[] = [
  { id: 'p1', name: 'Pack Fournitures Bureau Premium', sku: 'BUR-001', priceHt: 450.0, taxRate: 20, stock: 45, category: 'Fournitures' },
  { id: 'p2', name: 'Cartouche Toner Laser HP Noir', sku: 'TON-85A', priceHt: 280.0, taxRate: 20, stock: 18, category: 'Informatique' },
  { id: 'p3', name: 'Rame Papier A4 80g Navigator (Carton 5 rames)', sku: 'PAP-A4-5', priceHt: 220.0, taxRate: 20, stock: 95, category: 'Fournitures' },
  { id: 'p4', name: 'Clé USB 64GB Kingston 3.2', sku: 'USB-64K', priceHt: 65.0, taxRate: 20, stock: 60, category: 'Informatique' },
  { id: 'p5', name: 'Pack Eau Minérale Sidi Ali (12x1.5L)', sku: 'EAU-SA-15', priceHt: 62.0, taxRate: 7, stock: 34, category: 'Alimentation' },
  { id: 'p6', name: 'Café Espresso Moulu Lavazza 1kg', sku: 'CAF-LAV-1K', priceHt: 145.0, taxRate: 20, stock: 22, category: 'Alimentation' },
  { id: 'p7', name: 'Prestation Maintenance Informatique / Heure', sku: 'SRV-MAIN-1H', priceHt: 350.0, taxRate: 20, stock: 999, category: 'Services' },
  { id: 'p8', name: 'Pack Câbles Réseau RJ45 Cat6 (10x 3m)', sku: 'CAB-RJ45-10', priceHt: 110.0, taxRate: 20, stock: 28, category: 'Informatique' },
  { id: 'p9', name: 'Souris Optique Sans Fil Logitech M185', sku: 'LOG-M185', priceHt: 120.0, taxRate: 20, stock: 15, category: 'Informatique' },
  { id: 'p10', name: 'Registre Comptable Relié DGI 200p', sku: 'REG-DGI-200', priceHt: 85.0, taxRate: 20, stock: 50, category: 'Fournitures' },
  { id: 'p11', name: 'Écran LED 24" Dell Full HD IPS', sku: 'MON-DELL-24', priceHt: 1450.0, taxRate: 20, stock: 8, category: 'Informatique' },
  { id: 'p12', name: 'Onduleur APC 650VA avec Parafoudre', sku: 'OND-APC-650', priceHt: 680.0, taxRate: 20, stock: 12, category: 'Informatique' },
];

const CUSTOMERS = [
  { id: 'c0', name: 'Client Comptoir (Passager)', ice: 'N/A', kreddyBalance: 0, kreddyLimit: 0 },
  { id: 'c1', name: 'Atlas Consulting SARL', ice: '001982736450091', kreddyBalance: 4250, kreddyLimit: 20000 },
  { id: 'c2', name: 'Société Maghrébine de BTP SA', ice: '002817263540082', kreddyBalance: 12800, kreddyLimit: 50000 },
  { id: 'c3', name: 'Kenza Alaoui (Architecte)', ice: '003192847560012', kreddyBalance: 1150, kreddyLimit: 10000 },
  { id: 'c4', name: 'Superette Al Baraka Casablanca', ice: '001552948172839', kreddyBalance: 8500, kreddyLimit: 15000 },
];

interface CartLine {
  product: POSItem;
  quantity: number;
  discountPct: number;
}

export default function POSPage() {
  const [catalog] = useState<POSItem[]>(INITIAL_CATALOG);
  const [cart, setCart] = useState<CartLine[]>([
    { product: INITIAL_CATALOG[0], quantity: 2, discountPct: 0 },
    { product: INITIAL_CATALOG[2], quantity: 3, discountPct: 5 },
  ]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('c0');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'CARD' | 'CHEQUE' | 'KREDDY'>('CASH');
  const [cashReceived, setCashReceived] = useState<number>(2000);
  const [chequeNumber, setChequeNumber] = useState('');
  const [chequeBank, setChequeBank] = useState('Attijariwafa Bank');
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Cash Register State
  const [cashRegisterModalOpen, setCashRegisterModalOpen] = useState(false);
  const [openingFloat] = useState(1500); // 1 500 DH fond de caisse initial
  const [denominations, setDenominations] = useState<{ [key: string]: number }>({
    '200': 12,
    '100': 15,
    '50': 10,
    '20': 18,
    '10': 20,
    '5': 15,
    '2': 25,
    '1': 30,
  });

  const categories = ['Tous', 'Informatique', 'Fournitures', 'Alimentation', 'Services'];

  const filteredCatalog = useMemo(() => {
    return catalog.filter((p) => {
      const matchCat = selectedCategory === 'Tous' || p.category === selectedCategory;
      const matchQuery =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [catalog, search, selectedCategory]);

  const selectedCustomer = CUSTOMERS.find((c) => c.id === selectedCustomerId) || CUSTOMERS[0];

  // Cart Calculations
  const { totalHt, totalTax, totalTtc, taxBreakdown } = useMemo(() => {
    let ht = 0;
    let tax = 0;
    const breakdown: { [rate: number]: { baseHt: number; taxAmount: number } } = {};

    cart.forEach((item) => {
      const lineHt = item.product.priceHt * item.quantity * (1 - item.discountPct / 100);
      const lineTax = lineHt * (item.product.taxRate / 100);
      ht += lineHt;
      tax += lineTax;

      if (!breakdown[item.product.taxRate]) {
        breakdown[item.product.taxRate] = { baseHt: 0, taxAmount: 0 };
      }
      breakdown[item.product.taxRate].baseHt += lineHt;
      breakdown[item.product.taxRate].taxAmount += lineTax;
    });

    return {
      totalHt: ht,
      totalTax: tax,
      totalTtc: ht + tax,
      taxBreakdown: breakdown,
    };
  }, [cart]);

  const cashWarning = paymentMode === 'CASH' && totalTtc > CASH_PAYMENT_CEILING_MAD;
  const cashChange = Math.max(0, cashReceived - totalTtc);

  function addToCart(product: POSItem) {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1, discountPct: 0 }];
    });
  }

  function updateQuantity(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartLine[]
    );
  }

  function handleProcessPayment() {
    const orderData = {
      orderNumber: `TK-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleString('fr-MA'),
      customer: selectedCustomer,
      items: cart,
      totalHt,
      totalTax,
      totalTtc,
      paymentMode,
      cashReceived: paymentMode === 'CASH' ? cashReceived : totalTtc,
      cashChange: paymentMode === 'CASH' ? cashChange : 0,
      chequeNumber: paymentMode === 'CHEQUE' ? chequeNumber : undefined,
      chequeBank: paymentMode === 'CHEQUE' ? chequeBank : undefined,
    };

    setCompletedOrder(orderData);
    setPaymentModalOpen(false);
    setReceiptModalOpen(true);
    setCart([]);
  }

  // Calculate counted cash from denominations
  const totalCountedCash = useMemo(() => {
    return Object.entries(denominations).reduce((acc, [denom, count]) => {
      return acc + Number(denom) * (count || 0);
    }, 0);
  }, [denominations]);

  const theoreticalCash = openingFloat + 3420; // Fond initial + ventes cash de la journée
  const cashVariance = totalCountedCash - theoreticalCash;

  return (
    <div className="space-y-6">
      {/* POS Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <ShoppingBag size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Point de Vente &amp; Caisse
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Session Active · Caisse #01
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Encaissement rapide, TVA Maroc conforme &amp; Gestion de caisse
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCashRegisterModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-[var(--border)] transition-colors"
          >
            <Banknote size={15} className="text-amber-500" />
            <span>Clôture &amp; Z de Caisse</span>
          </button>
          <div className="text-right pl-3 border-l border-[var(--border)]">
            <div className="text-[10px] text-slate-400 font-medium">Fond de caisse</div>
            <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
              {formatMad(openingFloat)}
            </div>
          </div>
        </div>
      </div>

      {/* Main POS Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Product Catalog & Categories (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Category Filter */}
          <div className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Rechercher par nom d'article, référence SKU ou code-barres (ex: PAP-A4, Toner)…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-xl py-2.5 pl-9 pr-10 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
              />
              <button
                title="Scanner code-barres"
                onClick={() => {
                  if (catalog.length > 0) addToCart(catalog[Math.floor(Math.random() * catalog.length)]);
                }}
                className="absolute right-2.5 top-2 p-1 text-slate-400 hover:text-[var(--primary)]"
              >
                <Barcode size={18} />
              </button>
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[var(--primary)] text-white shadow-sm font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredCatalog.map((product) => {
              const priceTtc = product.priceHt * (1 + product.taxRate / 100);
              return (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="group bg-[var(--surface)] hover:border-[var(--primary)] border border-[var(--border)] rounded-2xl p-3.5 text-left transition-all hover:shadow-md flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-mono">{product.sku}</span>
                      <span
                        className={`font-semibold px-1.5 py-0.5 rounded ${
                          product.taxRate === 20
                            ? 'bg-blue-500/10 text-blue-500'
                            : 'bg-emerald-500/10 text-emerald-500'
                        }`}
                      >
                        TVA {product.taxRate}%
                      </span>
                    </div>
                    <div className="font-bold text-xs text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug group-hover:text-[var(--primary)] transition-colors">
                      {product.name}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[var(--border)] flex items-end justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400">HT: {formatMad(product.priceHt)}</div>
                      <div className="text-xs font-extrabold font-mono text-slate-900 dark:text-white">
                        {formatMad(priceTtc)}
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-[var(--primary)] group-hover:text-white flex items-center justify-center transition-colors">
                      <Plus size={14} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Cart, Customer & Checkout (5 cols) */}
        <div className="lg:col-span-5 bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-5 shadow-lg space-y-4">
          {/* Customer Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Client &amp; Facturation</span>
              {selectedCustomer.id !== 'c0' && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                  ICE: {selectedCustomer.ice}
                </span>
              )}
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium"
            >
              {CUSTOMERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.kreddyBalance > 0 ? `(Dette: ${formatMad(c.kreddyBalance)})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Cart Items List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <ShoppingBag className="mx-auto text-slate-300 dark:text-slate-600" size={32} />
                <p className="text-xs">Le panier est actuellement vide.</p>
                <p className="text-[10px]">Cliquez sur un article ou scannez un code-barres.</p>
              </div>
            ) : (
              cart.map((item) => {
                const lineHt = item.product.priceHt * item.quantity * (1 - item.discountPct / 100);
                const lineTtc = lineHt * (1 + item.product.taxRate / 100);
                return (
                  <div
                    key={item.product.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {item.product.name}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span>{formatMad(item.product.priceHt)} HT / u</span>
                        <span>·</span>
                        <span>TVA {item.product.taxRate}%</span>
                        {item.discountPct > 0 && (
                          <span className="text-amber-500 font-bold">-{item.discountPct}%</span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-[var(--border)] rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center font-mono font-bold text-slate-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {formatMad(lineTtc)}
                      </div>
                      <div className="text-[9px] text-slate-400">TTC</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Tax Breakdown & Totals */}
          {cart.length > 0 && (
            <div className="pt-3 border-t border-[var(--border)] space-y-2 text-xs">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Total HT</span>
                <span className="font-mono font-medium">{formatMad(totalHt)}</span>
              </div>

              {/* Dynamic VAT Breakdown */}
              {Object.entries(taxBreakdown).map(([rate, data]) => (
                <div key={rate} className="flex justify-between text-[11px] text-slate-400">
                  <span>TVA {rate}% (sur {formatMad(data.baseHt)} HT)</span>
                  <span className="font-mono">{formatMad(data.taxAmount)}</span>
                </div>
              ))}

              <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-[var(--border)]">
                <span>Total TTC à Payer</span>
                <span className="font-mono text-base text-[var(--primary)]">{formatMad(totalTtc)}</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setCart([])}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 size={14} />
                  <span>Vider</span>
                </button>
                <button
                  onClick={() => {
                    setCashReceived(Math.ceil(totalTtc / 50) * 50 || totalTtc);
                    setPaymentModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-500 transition-all"
                >
                  <CreditCard size={15} />
                  <span>Encaisser</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Processing Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Règlement de la Vente
                </h3>
                <p className="text-xs text-slate-400">Total à percevoir: <strong className="text-slate-900 dark:text-white font-mono">{formatMad(totalTtc)}</strong></p>
              </div>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Payment Modes Tabs */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { mode: 'CASH', label: 'Espèces', icon: Banknote },
                { mode: 'CARD', label: 'TPE / Carte', icon: CreditCard },
                { mode: 'CHEQUE', label: 'Chèque', icon: FileCheck },
                { mode: 'KREDDY', label: 'Kreddy', icon: BookOpen },
              ].map(({ mode, label, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => setPaymentMode(mode as any)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                    paymentMode === mode
                      ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                      : 'border-[var(--border)] bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Cash Ceiling Warning (Art 193 CGI) */}
            {cashWarning && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-start gap-2.5">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <div>
                  <strong>Avertissement Fiscal (Art. 193 CGI Maroc) :</strong>
                  <p className="text-[11px] mt-0.5">
                    Le règlement en espèces dépasse le plafond légal de 5 000 MAD pour une transaction commerciale. Risque de non-déductibilité fiscale.
                  </p>
                </div>
              </div>
            )}

            {/* Mode-specific Fields */}
            {paymentMode === 'CASH' && (
              <div className="space-y-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Montant Reçu (MAD)
                  </label>
                  <span className="text-[10px] text-slate-400">Total TTC: {formatMad(totalTtc)}</span>
                </div>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-800 border border-[var(--border)] rounded-xl py-2 px-3 text-base font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
                <div className="flex justify-between items-center pt-2 border-t border-[var(--border)]">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Monnaie à Rendre :
                  </span>
                  <span className="text-sm font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatMad(cashChange)}
                  </span>
                </div>
              </div>
            )}

            {paymentMode === 'CHEQUE' && (
              <div className="space-y-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-[var(--border)]">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Numéro du Chèque
                  </label>
                  <input
                    type="text"
                    placeholder="ex: 0982341"
                    value={chequeNumber}
                    onChange={(e) => setChequeNumber(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-[var(--border)] rounded-xl py-2 px-3 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Banque Émettrice
                  </label>
                  <select
                    value={chequeBank}
                    onChange={(e) => setChequeBank(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-[var(--border)] rounded-xl py-2 px-3 text-xs outline-none"
                  >
                    <option>Attijariwafa Bank</option>
                    <option>Banque Populaire (BP)</option>
                    <option>Bank of Africa (BMCE)</option>
                    <option>CIH Bank</option>
                    <option>Crédit du Maroc</option>
                    <option>Société Générale Maroc</option>
                  </select>
                </div>
              </div>
            )}

            {paymentMode === 'KREDDY' && (
              <div className="space-y-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-[var(--border)] text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Client Débiteur :</span>
                  <strong className="text-slate-800 dark:text-slate-200">{selectedCustomer.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Encours Actuel :</span>
                  <span className="font-mono text-amber-500 font-bold">{formatMad(selectedCustomer.kreddyBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Plafond de Crédit Autorisé :</span>
                  <span className="font-mono">{formatMad(selectedCustomer.kreddyLimit)}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[11px]">
                  Cette vente sera inscrite dans le carnet de dettes client avec génération de reçu Kreddy.
                </div>
              </div>
            )}

            <button
              onClick={handleProcessPayment}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} />
              <span>Valider l&apos;Encaissement &amp; Imprimer Ticket</span>
            </button>
          </div>
        </div>
      )}

      {/* Ticket / Thermal Receipt Modal Simulator */}
      {receiptModalOpen && completedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 border border-slate-300 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 font-mono text-xs animate-in zoom-in-95">
            <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-3">
              <div className="font-extrabold text-sm tracking-wider">SAHLBIZ STORE MAROC</div>
              <div className="text-[10px] text-slate-500">Boulevard d&apos;Anfa, Casablanca</div>
              <div className="text-[10px] text-slate-500">ICE: 001982736450091 · IF: 40291823</div>
              <div className="text-[10px] text-slate-500">RC: 39481 Casa · Patente: 3829102</div>
            </div>

            <div className="flex justify-between text-[10px] text-slate-600">
              <span>Ticket: {completedOrder.orderNumber}</span>
              <span>{completedOrder.date}</span>
            </div>

            <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1.5">
              {completedOrder.items.map((item: CartLine) => (
                <div key={item.product.id} className="flex justify-between text-[11px]">
                  <span className="truncate pr-2">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="font-bold">
                    {formatMad(item.product.priceHt * item.quantity * (1 + item.product.taxRate / 100))}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-1 pt-1 text-[11px]">
              <div className="flex justify-between">
                <span>Total HT :</span>
                <span>{formatMad(completedOrder.totalHt)}</span>
              </div>
              <div className="flex justify-between">
                <span>TVA :</span>
                <span>{formatMad(completedOrder.totalTax)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm border-t border-slate-400 pt-1">
                <span>TOTAL TTC :</span>
                <span>{formatMad(completedOrder.totalTtc)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-600 pt-1">
                <span>Mode : {completedOrder.paymentMode}</span>
                <span>Reçu : {formatMad(completedOrder.cashReceived)}</span>
              </div>
              {completedOrder.cashChange > 0 && (
                <div className="flex justify-between text-[10px] font-bold text-emerald-700">
                  <span>Rendu :</span>
                  <span>{formatMad(completedOrder.cashChange)}</span>
                </div>
              )}
            </div>

            <div className="text-center text-[10px] text-slate-500 border-t border-dashed border-slate-300 pt-3">
              <div>Choukran bzaf l-ziyaratkom!</div>
              <div>Merci pour votre confiance · Conforme DGI Maroc</div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-slate-900 text-white font-sans text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Printer size={14} />
                <span>Imprimer</span>
              </button>
              <button
                onClick={() => setReceiptModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 font-sans text-xs font-semibold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cash Reconciliation / Z de Caisse Modal */}
      {cashRegisterModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Clôture Journalière &amp; Décompte des Espèces (Z de Caisse)
                </h3>
                <p className="text-xs text-slate-400">Comptage physique des billets et pièces en caisse</p>
              </div>
              <button
                onClick={() => setCashRegisterModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Denomination Counter Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              {['200', '100', '50', '20', '10', '5', '2', '1'].map((denom) => (
                <div key={denom} className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-[var(--border)] space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>{denom} MAD</span>
                    <span>= {formatMad(Number(denom) * (denominations[denom] || 0))}</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={denominations[denom] || 0}
                    onChange={(e) =>
                      setDenominations({
                        ...denominations,
                        [denom]: Math.max(0, parseInt(e.target.value) || 0),
                      })
                    }
                    className="w-full bg-white dark:bg-slate-800 border border-[var(--border)] rounded-lg py-1 px-2 text-center font-mono font-bold text-slate-900 dark:text-white outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Reconciliation Totals */}
            <div className="bg-slate-100 dark:bg-slate-900/80 p-4 rounded-2xl border border-[var(--border)] space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Fond de Caisse Initial :</span>
                <span className="font-mono">{formatMad(openingFloat)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Total Espèces Théorique (Système) :</span>
                <span className="font-mono font-semibold">{formatMad(theoreticalCash)}</span>
              </div>
              <div className="flex justify-between text-slate-900 dark:text-white font-bold">
                <span>Total Espèces Compté Réel :</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                  {formatMad(totalCountedCash)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[var(--border)] text-xs font-bold">
                <span>Écart de Caisse :</span>
                <span
                  className={`font-mono ${
                    cashVariance === 0
                      ? 'text-emerald-500'
                      : cashVariance > 0
                      ? 'text-blue-500'
                      : 'text-rose-500'
                  }`}
                >
                  {cashVariance > 0 ? '+' : ''}
                  {formatMad(cashVariance)} {cashVariance === 0 ? '(Parfait)' : ''}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                alert('Clôture de caisse Z validée avec succès et enregistrée dans le journal PCGM 5161.');
                setCashRegisterModalOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-bold text-sm shadow-md hover:opacity-95 transition-all"
            >
              Enregistrer le Z de Caisse &amp; Archiver
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
