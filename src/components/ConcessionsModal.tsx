import React, { useState } from 'react';
import { X, Plus, Minus, UtensilsCrossed, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';
import { SnackItem, BookedSnack, BookingSeatItem, Show } from '../types';

interface ConcessionsModalProps {
  snacks: SnackItem[];
  selectedSeats: BookingSeatItem[];
  show: Show;
  onClose: () => void;
  onBackToSeats: () => void;
  onProceedToCheckout: (bookedSnacks: BookedSnack[]) => void;
}

export const ConcessionsModal: React.FC<ConcessionsModalProps> = ({
  snacks,
  selectedSeats,
  show,
  onClose,
  onBackToSeats,
  onProceedToCheckout,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [quantities, setQuantities] = useState<{ [snackId: string]: number }>({});

  const categories = [
    { id: 'all', label: 'All Concessions' },
    { id: 'combos', label: 'Cine Combos' },
    { id: 'popcorn', label: 'Popcorn Bar' },
    { id: 'snacks', label: 'Warm Snacks' },
    { id: 'beverages', label: 'Cold Drinks' },
  ];

  const updateQuantity = (snackId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[snackId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[snackId];
        return copy;
      }
      return { ...prev, [snackId]: next };
    });
  };

  const filteredSnacks =
    activeCategory === 'all'
      ? snacks
      : snacks.filter((s) => s.category === activeCategory);

  const bookedSnacks: BookedSnack[] = Object.entries(quantities)
    .filter(([_, qty]) => qty > 0)
    .map(([id, qty]) => {
      const snack = snacks.find((s) => s.id === id)!;
      return { snack, quantity: qty };
    });

  const snacksSubtotal = bookedSnacks.reduce((acc, item) => acc + item.snack.price * item.quantity, 0);
  const ticketSubtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSeats}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Back to Seats"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-amber-500" />
                Gourmet Cinema Concessions
              </h3>
              <p className="text-xs text-slate-400">
                Fresh popcorn, artisanal nachos, and drinks delivered to your screen seat.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-950 text-slate-400 hover:text-white flex items-center justify-center border border-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Food Items Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredSnacks.map((item) => {
              const qty = quantities[item.id] || 0;
              return (
                <div
                  key={item.id}
                  className="bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-slate-900 relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {item.calories && (
                      <span className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-slate-800">
                        {item.calories}
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white leading-snug">{item.name}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                      <span className="text-sm font-bold font-mono text-amber-400">
                        ${item.price.toFixed(2)}
                      </span>

                      {qty === 0 ? (
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-3 py-1 rounded-lg bg-red-600/90 hover:bg-red-600 text-white text-xs font-semibold flex items-center gap-1 transition-all"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold font-mono text-white px-1">
                            {qty}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Checkout Bar */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs">
            <div className="text-slate-400">
              Tickets ({selectedSeats.length}): <strong className="text-white font-mono">${ticketSubtotal.toFixed(2)}</strong>
              {snacksSubtotal > 0 && (
                <>
                  <span className="mx-1.5 text-slate-600">·</span>
                  Concessions: <strong className="text-amber-400 font-mono">${snacksSubtotal.toFixed(2)}</strong>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Current Subtotal: <strong className="text-red-400 font-mono">${(ticketSubtotal + snacksSubtotal).toFixed(2)}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onProceedToCheckout([])}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
            >
              Skip Snacks
            </button>
            <button
              onClick={() => onProceedToCheckout(bookedSnacks)}
              className="flex items-center gap-1.5 px-6 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition-all cursor-pointer"
            >
              <span>Proceed to Payment</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
