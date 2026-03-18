import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';

interface EMICalculatorProps {
  carPrice: number;
}

export const EMICalculator: React.FC<EMICalculatorProps> = ({ carPrice }) => {
  const [downPayment, setDownPayment] = useState<number>(carPrice * 0.2); // Default 20%
  const [interestRate, setInterestRate] = useState<number>(9.5); // Default 9.5%
  const [loanTenure, setLoanTenure] = useState<number>(60); // Default 5 years (60 months)
  const [emi, setEmi] = useState<number>(0);

  useEffect(() => {
    calculateEMI();
  }, [downPayment, interestRate, loanTenure, carPrice]);

  const calculateEMI = () => {
    const principal = carPrice - downPayment;
    const ratePerMonth = interestRate / 12 / 100;
    
    if (principal <= 0 || ratePerMonth === 0 || loanTenure === 0) {
      setEmi(0);
      return;
    }

    const emiValue = 
      (principal * ratePerMonth * Math.pow(1 + ratePerMonth, loanTenure)) / 
      (Math.pow(1 + ratePerMonth, loanTenure) - 1);
      
    setEmi(Math.round(emiValue));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-500">
          <Calculator className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white">EMI Calculator</h3>
      </div>

      <div className="space-y-6">
        {/* Down Payment Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-zinc-400">Down Payment</label>
            <span className="text-sm font-bold text-white">{formatCurrency(downPayment)}</span>
          </div>
          <input 
            type="range" 
            min={0} 
            max={carPrice} 
            step={10000}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between mt-1 text-xs text-zinc-500">
            <span>0%</span>
            <span>{Math.round((downPayment / carPrice) * 100)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Interest Rate Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-zinc-400">Interest Rate (p.a.)</label>
            <span className="text-sm font-bold text-white">{interestRate}%</span>
          </div>
          <input 
            type="range" 
            min={5} 
            max={20} 
            step={0.1}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Loan Tenure Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-zinc-400">Loan Tenure</label>
            <span className="text-sm font-bold text-white">{loanTenure} Months</span>
          </div>
          <input 
            type="range" 
            min={12} 
            max={84} 
            step={12}
            value={loanTenure}
            onChange={(e) => setLoanTenure(Number(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between mt-1 text-xs text-zinc-500">
            <span>1 Yr</span>
            <span>7 Yrs</span>
          </div>
        </div>

        {/* Results */}
        <div className="mt-8 p-6 bg-zinc-950 rounded-xl border border-zinc-800 flex flex-col items-center justify-center text-center">
          <p className="text-zinc-400 text-sm mb-1">Estimated Monthly EMI</p>
          <p className="text-4xl font-bold text-emerald-400 mb-4">{formatCurrency(emi)}</p>
          
          <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
            <div>
              <p className="text-xs text-zinc-500 mb-1">Principal Amount</p>
              <p className="text-sm font-bold text-white">{formatCurrency(carPrice - downPayment)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Total Interest</p>
              <p className="text-sm font-bold text-white">{formatCurrency((emi * loanTenure) - (carPrice - downPayment))}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
