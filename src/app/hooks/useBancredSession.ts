import { useState, useEffect } from 'react';

export type UserData = {
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  nascimento?: string;
  [key: string]: any;
};

export type LoanData = {
  valorDesejado: number;
  valorLiberado?: number;
  parcelas: number;
  parcelaMensal: number;
  totalPagar: number;
  diaVencimento?: number;
  primeiraParcela?: string;
  [key: string]: any;
};

export function useBancredSession() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loan, setLoan] = useState<LoanData | null>(null);

  useEffect(() => {
    // Carregar usuário
    try {
      const storedUser = window.sessionStorage.getItem('userData');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Erro ao ler userData do sessionStorage", e);
    }

    // Carregar empréstimo
    try {
      const storedLoan = window.sessionStorage.getItem('simulacaoData');
      if (storedLoan) {
        setLoan(JSON.parse(storedLoan));
      }
    } catch (e) {
      console.error("Erro ao ler simulacaoData do sessionStorage", e);
    }
  }, []);

  return { 
    user, 
    loan,
    isAuthenticated: !!user?.cpf 
  };
}
