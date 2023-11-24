import { useMemo, useState } from "react";
import { useWindowWidth } from "../../../../../app/hooks/useWindowWidth";
import { useDashboard } from "../DashboardContext/useDashboard";
import { useBankAccounts } from "../../../../../app/hooks/useBankAccounts";

export function useAccountsController() {
  const windowWidth = useWindowWidth();
  const { areValuesVisible, toggleValuesVisibility, openNewAccountModal, openEditAccountModal } = useDashboard();
  const { accounts, isPending } = useBankAccounts();


  const [sliderState, setSliderState] = useState({
    isBeginning: true,
    isEnd: false
  });

  const currentBalance = useMemo(() => {
    if(!accounts) return 0;
    
    return accounts.reduce((total, account) => 
      total + account.currentBalance
    , 0)
  }, [accounts]);

  return {
    sliderState, 
    setSliderState,
    windowWidth,
    areValuesVisible,
    toggleValuesVisibility,
    isLoading: false,
    openNewAccountModal,
    isPending,
    accounts,
    currentBalance,
    openEditAccountModal
  }
}
